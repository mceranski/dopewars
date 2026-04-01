import { format, random } from "../Utils";
import { ref } from "vue";
import { bitchNames } from "../Strings";
import { Gun } from "../Gun.js";

class Proposition {
  constructor(text, commands = []) {
    this.text = text;
    this.commands = commands;
  }
}

class Command {
  constructor(text, onExecute = () => "", canExecute = () => true) {
    this.text = text;
    this.onExecute = onExecute;
    this.canExecute = canExecute;
  }

  execute = () => this.canExecute() == true
    ? this.onExecute()
    : "Nothing happened.";
}

class SmokeWeed extends Proposition {
  constructor(game, player) {
    var willDie = random.occurence(.55);

    var commands = [
      new Command(
        "Yes",
        () => {
          var healthGained = willDie ? 0 : random.number(10, 100 - player.health);

          var message = willDie
            ? "You smoked the weed and had a great time! But unfortunately, it was laced with paraquat and you died."
            : `You smoked the weed and had a great time! You gained some health.`;

          if (willDie) {
            player.die(message);
            return message;
          }

          game.log.info(message);
          player.health += healthGained;
          return message;
        },
      ),
      new Command("No", () => "Suit yourself. It's probably for the best.")
    ];
    super("There is some weed that smells like paraquat here! It looks good! Will you smoke it?", commands);
  }
}

class BuyBiggerTrenchcoat extends Proposition {
  constructor(game, player) {
    const cost = random.number(500, 1200);
    var commands = [
      new Command(
        "Yes",
        () => {
          player.storage += 15;
          var message = `You bought a bigger trenchcoat for $$${format.number(cost)}! You can now carry more drugs!`;
          player.buySomething({ price: cost, logMessage: message });
          return message;
        },
        () => {
          return player.cash >= cost;
        }
      ),
      new Command("No", () => "Maybe next time.")
    ];
    super(`Would you like to buy a bigger trenchcoat for $${format.number(cost)}?`, commands);
  }
}

class HireBitch extends Proposition {
  constructor(game, player) {
    const cost = random.number(100, 1500);
    var bitchName = random.element(bitchNames);
    var commands = [
      new Command(
        "Yes",
        () => {
          player.hireBitch({ name: bitchName, price: cost });
          return `You ${bitchName} for $${format.number(cost)}!`;
        },
        () => player.cash >= cost
      ),
      new Command("No", () => "Fine, maybe next time.")
    ];
    super(`Would you like to hire ${bitchName} for $${format.number(cost)}? She can help carry drugs and increase your influence.`, commands);
  }
}

class HealWounds extends Proposition {
  constructor(game, player) {
    const cost = random.number(500, 5000);
    const isEnabled = player.health < 100 && player.cash >= cost;
    var commands = [
      new Command(
        "Yes",
        () => {
          var damage = 100 - player.health.value;
          player.heal({ amount: damage, price: cost });
          return `Ah, I am feeling much better.`;
        },
        () => isEnabled
      ),
      new Command(
        "No",
        () => "No pain, no gain.",
        () => isEnabled
      )
    ];
    super(`You look a little banged up. Would you like me to heal your wounds for $${format.number(cost)}?`, commands);
  }
}

class DroppedDrugs extends Proposition {
  constructor(game, player) {
    var drug = random.element(player.drugs);
    var quantityLost = drug == null ? 0 : Math.ceil(drug.quantity * 0.1); //lose 10% of the drug, rounded up
    var message = `Police dogs chase you for 5 blocks! You dropped ${quantityLost} ${drug?.name}! That's a drag, man!`;
    var commands = [
      new Command(
        "Ok",
        () => {
          player.dropDrugs({ name: drug.name, quantity: quantityLost });
          return message;
        },
        () => drug != null
      )
    ];
    super(message, commands);
  }
}

class MuggedInSubway extends Proposition {
  constructor(game, player) {
    var damage = Math.ceil(player.health * .25);
    var message = `You were mugged in the subway! You lost ${damage} health!`;
    var commands = [
      new Command(
        "Ok",
        () => {
          player.takeDamage(damage);
          return message;
        }
      )
    ];

    super(message, commands);
  }
}

class BuyGun extends Proposition {
  constructor(game, player) {
    var gun = random.element(Gun.all);
    const cost = gun.price * .1; //offered at 10% of normal price because it's a shady deal
    var commands = [
      new Command(
        "Yes",
        () => {
          player.buyGun({ name: gun.name, price: cost });
          return `You bought a ${gun.name} for $${format.number(cost)}!`;
        },
        () => player.cash >= cost
      ),
      new Command("No", () => "Maybe next time.")
    ];
    super(`Would you like to buy a ${gun.name} for $${format.number(cost)}?`, commands);
  }
}
//Hey dude! I'll help carry your %tde for a mere %P. Yes or no?"
//Would you like to buy a %tde for %P?"
//"You hallucinated for three days on the wildest trip you ever imagined!^Then you died because your brain disintegrated!
//Do you pay a doctor %P to sew you up?"
//"You were mugged in the subway!"
//"You meet a friend! He gives you %d %tde."
//"You meet a friend! You give him %d %tde."
//Would you like to hire a %tde for %P?"

function useRandomEvent({ game }) {
  const player = game.player.value;
  var title = "Random Event";
  const content = ref([]);
  const isCompleted = ref(false);
  const commands = ref([]);
  const exit = () => game.closeView();

  const executeCommand = (command) => {
    const result = command.execute();
    content.value.push(result || "Nothing happened.");
    isCompleted.value = true;
  }

  const init = () => {
    var items = [
      new SmokeWeed(game, player),
      new BuyBiggerTrenchcoat(game, player),
      new HireBitch(game, player),
      new HealWounds(game, player),
      new DroppedDrugs(game, player),
      new MuggedInSubway(game, player),
      new BuyGun(game, player)
    ];

    var candidates = items.filter(item => item.commands.every(command => command.canExecute()));
    var candidate = candidates.length > 0 ? random.element(candidates) : null;
    var isEvent = candidate?.commands.length == 1;

    if (isEvent) { //execute immedietely if it's just an event with one command
      title = "Event";
      var consequence = isEvent ? candidate.commands[0].execute() : null;
      content.value.push(consequence || "Nothing happened.");
      isCompleted.value = true;
      return
    }

    title = candidate != null ? "Proposition" : "Hmmmph...";
    content.value.push(candidate?.text || "Nothing to do right now...");
    commands.value = candidate?.commands.map(command => ({
      text: command.text,
      execute: () => executeCommand(command)
    })) || [];
  }

  init();

  return {
    title,
    content,
    commands,
    exit,
    isCompleted
  };
}

export { useRandomEvent };
