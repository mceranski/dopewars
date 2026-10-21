import { computed } from 'vue';
import { random } from '@/classes/Utils.js';
import { Cop } from '../Cop.js';
import { ref } from 'vue';
import { Log } from '../Log.js';

function useFight({ game, options }) {
  const log = ref(new Log(25));
  const cop = random.element(Cop.all);
  const copName = cop.name;
  const player = game.player.value;

  const isOver = ref(false);
  const canStand = computed(() => canRunAway.value);
  const canFight = computed(() => canRunAway.value && playerGun.value !== null);
  const canRunAway = computed(() => isOver.value == false && player.health > 0);
  const canExit = computed(() => isOver.value == true);

  const bitchCount = computed(() => player.bitches || 0);
  const deputyCount = ref(cop.deputyCount || 0);
  const currentDeputyHealth = ref(cop.deputyCount > 0 ? 100 : 0);
  const currentBitchHealth = ref(player.bitches > 0 ? 100 : 0);
  const copHealth = ref(cop.health);
  const runAttempts = ref(0);

  const exit = () => game.closeView();

  const playerHealthMeter = computed(() => {
    return bitchCount.value > 0
      ? currentBitchHealth.value
      : player.health;
  });

  const copHealthMeter = computed(() => {
    return deputyCount.value > 0
      ? currentDeputyHealth.value
      : copHealth.value;
  });

  const playerGun = computed(() => player.guns.length > 0
    ? player.guns.sort((a, b) => b.damage - a.damage)[0]
    : null);

  const fight = () => {
    game.playSound("gun");
    inflictCopDamage();
    if (isOver.value == true) return;
    inflictPlayerDamage();
  }

  const inflictCopDamage = () => {
    var damage = Math.floor(playerGun.value.damage * random.number(0.8, 1.5));
    if (deputyCount.value > 0) {
      currentDeputyHealth.value -= damage;
      if (currentDeputyHealth.value <= 0) {
        deputyCount.value -= 1;
        if (deputyCount.value > 0) currentDeputyHealth.value = 100;
        log.value.info(`You hit a deputy for ${damage} damage and killed him!`);
      }
      else
        log.value.info(`You hit a deputy for ${damage} damage!`);
    }
    else {
      copHealth.value -= damage;
      if (copHealth.value <= 0) {
        game.playSound("cha_ching");
        var reward = random.number(200, 3000);
        log.value.info(`You killed ${cop.name}! You find $${reward} on the body!`);
        player.cash += reward;
      }
      else
        log.value.info(`You hit ${cop.name} for ${damage} damage!`);
    }

    if (copHealth.value > 0) return;
    endFight();
  }


  const inflictPlayerDamage = () => {
    var isDeputy = deputyCount.value > 0;
    var damage = cop.getDamagePerShot(isDeputy);

    if (bitchCount.value > 0) {
      currentBitchHealth.value -= damage;
      if (currentBitchHealth.value <= 0) {
        player.bitches -= 1;
        if (bitchCount.value > 0) currentBitchHealth.value = 100;
        game.playSound("losebitch");
        log.value.info(`Your bitch took ${damage} damage and died!`);
      }
      else {
        log.value.info(`Your bitch took ${damage} damage!`);
      }
    }
    else {
      player.health -= damage;
      log.value.info(`${isDeputy ? "A deputy" : cop.name} hit you for ${damage} damage, man!`);
    }

    if (player.health > 0) return;
    player.die(`You were killed by ${isDeputy ? "a deputy" : cop.name}...`);
    endFight();
  };

  const endFight = () => {
    isOver.value = true;
  }
  const runAway = () => {
    game.playSound("run");

    //the probability starts at 20% and increases expontially as the run attempts increases
    var probability = 0.20 * Math.exp(runAttempts.value / 2);
    if (random.occurence(probability)) {
      log.value.info(`You got away!`);
      endFight();
      return;
    }

    runAttempts.value++;
    inflictPlayerDamage();
  }

  const stand = () => {
    game.playSound("colt");
    log.value.info(`You stand there like a dummy.`);
    inflictPlayerDamage();
  }

  const subTitle = `Officer ${cop.name} and ${cop.deputyCount} deputies - ${cop.getArmorStatus()} - are chasing you, man!`;

  const init = () => {
    log.value.warn(subTitle);
    game.playSound('police_siren');
  }

  init();

  return {
    name: options.name || "Stand-Off",
    log,
    subTitle,
    bitchCount,
    deputyCount,
    copName,
    copHealthMeter,
    playerHealthMeter,
    canFight,
    fight,
    canStand,
    stand,
    canRunAway,
    runAway,
    canExit,
    exit
  }
}

export { useFight }
