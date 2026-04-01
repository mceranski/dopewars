import { Gun } from './Gun.js';
import { GunInventory, DrugInventory } from './InventoryItem.js';
import { format } from './Utils.js';
import { ref, computed } from 'vue';

function createPlayer(options) {
  const dailyInterestRate = 0.15;
  const startingCash = 2000;
  const startingDebt = 5000;
  const startingStorage = 100;
  const game = options.game;
  const log = game.log;
  const name = ref(options?.name || "Player 1");
  const health = ref(0);
  const cash = ref(0);
  const debt = ref(0);
  const savings = ref(0);
  const drugs = ref([]);
  const guns = ref([]);
  const reasonOfDeath = ref(null);
  const lungs = ref(0);
  const bitches = ref(0);
  const storage = ref(0);

  const reset = () => {
    health.value = 100;
    cash.value = startingCash;
    debt.value = startingDebt;
    storage.value = startingStorage;
    savings.value = 0;
    drugs.value = [];
    guns.value = [];
    reasonOfDeath.value = null;
    lungs.value = 2;
    bitches.value = 0;
  }

  const buyDrugs = ({ name, price, quantity = 1 }) => {
    //if the price is 0, it's a gift and we don't need to check for cash or space
    if (price > 0) {
      if (quantity > spaceRemaining.value) {
        throw new Error(`Not enough space in trenchcoat for ${quantity} ${name}!`);
      }

      if ((price * quantity) > cash.value) {
        throw new Error(`You don't have enough cash to buy ${quantity} ${name}!`);
      }
    }

    var match = drugs.value.find(drug => drug.name === name);
    if (!match) {
      match = new DrugInventory({ name: name, price: price, quantity: quantity });
      drugs.value.push(match);
    }
    else {
      //increase the quantity of the drug in the trenchcoat
      match.quantity += quantity;
      //recalculate the average price of the drug in the trenchcoat
      match.price = ((match.price * (match.quantity - quantity)) + (price * quantity)) / match.quantity;
    }

    cash.value -= price * quantity;
    const verb = price > 0 ? "bought" : "acquired";
    log.success(`You ${verb} ${quantity} ${name} for $${format.number(quantity * price)}.`);
  }

  const buyGun = ({ name, price }) => {
    var model = Gun.all.find(x => x.name == name);
    var cost = price || model.price;

    if (!model) {
      log.fatal(`No gun model found with name ${name}`);
      return;
    }

    if (model.spaceRequired > spaceRemaining.value) {
      log.fatal(`Not enough space in trenchcoat for a ${name}!`);
      return;
    }

    if (getGunCount() >= gunCapacity.value) {
      log.fatal(`You can only hold ${gunCapacity.value} guns. You can carry two in your trenchcoat and one per bitch!`);
      return;
    }

    if (cost > cash.value) {
      log.fatal(`You don't have enough cash to buy a ${model.name}!`);
      return;
    }

    var match = guns.value.find(gun => gun.name === name);
    if (!match) {
      match = new GunInventory({ name: name, price: cost });
      guns.value.push(match);
    }
    else
      match.quantity += 1;

    cash.value -= cost;
    log.success(`You bought a ${name} for $${format.number(cost)}.`);
  }

  const borrowMoney = (amount) => {
    cash.value += amount;
    debt.value += amount;
    log.success(`You borrowed $${format.number(amount)}.`);
  }

  const buySomething = ({ price, logMessage }) => {
    if (price > cash.value) {
      log.error(`You don't have enough cash!`);
      return;
    }
    cash.value -= price;
    log.success(logMessage);
  }

  const die = (reason) => {
    game.playSound("die");
    health.value = 0;
    reasonOfDeath.value = reason;
    game.over(reason);
  }

  const getDrugCount = (name = "") => drugs.value.filter(drug => name == "" || drug.name === name).reduce((total, drug) => total + drug.quantity, 0);

  const gunCapacity = computed(() => 2 + ((bitches.value || 0) * 1)); //

  const gunCount = computed(() => getGunCount());

  const getGunCount = (name = "") => guns.value.filter(gun => name == "" || gun.name === name).reduce((total, gun) => total + gun.quantity, 0);

  const percentageFull = computed(() => (spaceUsed.value / storageCapacity.value) * 100);

  const spaceRemaining = computed(() => storageCapacity.value - spaceUsed.value);

  const spaceUsed = computed(() => [...drugs.value, ...guns.value].reduce((total, item) => total + item.getSpaceUsed(), 0) || 0);

  const storageCapacity = computed(() => storage.value + (bitches.value * 10));

  const giveCash = ({ amount, message }) => {
    cash.value += amount;
    log.success(message || `You received $${format.number(amount)}.`);
  }

  const heal = ({ amount, price }) => {
    try {
      var cost = price || 0;
      buySomething({ price: cost });
      health.value += amount;
      if (health.value > 100) health.value = 100;

      if (cost <= 0)
        log.success(`You're healed! Your current health is ${health.value}.`);
      else
        log.success(`You healed yourself for ${format.number(cost)}. Your current health is ${health.value}.`);
    }
    catch (error) {
      log.error(error);
    }
  }

  const hireBitch = ({ name, price }) => {
    buySomething({ price });
    bitches.value += 1;
    log.success(`You hired ${name} as your bitch for $${format.number(price)}.`);
  }

  const incurDailyDebt = () => {
    debt.value = Math.floor(debt.value * (1 + dailyInterestRate)); // Increase debt by daily interest rate on travel
  }

  const depositMoney = (amount) => {
    if (amount > cash.value) {
      log.fatal(`You don't have $${format.number(amount)} to deposit!`);
      return;
    }

    cash.value -= amount;
    savings.value += amount;
    log.success(`You have added $${format.number(amount)} to your savings.`);
  }

  const withdrawMoney = (amount) => {
    if (amount > savings.value) {
      log.fatal(`You don't have $${format.number(amount)} in your savings!`);
      return;
    }

    savings.value -= amount;
    cash.value += amount;
    log.success(`You have withdrawn $${format.number(amount)} from your savings.`);
  }

  const payDebt = (amount) => {
    if (amount > cash.value) {
      log.fatal(`You don't have $${format.number(amount)}!`);
      return;
    }

    if (amount > debt.value) amount = debt.value; //can't pay more than you owe
    cash.value -= amount;
    debt.value -= amount;

    if (debt.value <= 0)
      log.success(`Congratulations! You have paid off all your debt.`);
    else
      log.success(`You paid $${format.number(amount)} towards your debt.`);
  }

  const profit = computed(() => (cash.value + savings.value) - debt.value);

  const dropDrugs = ({ name, quantity }) => removeDrugs({ name, quantity, price: 0, drop: true });

  const sellDrugs = ({ name, price, quantity }) => removeDrugs({ name, quantity, price, drop: false });

  const removeDrugs = ({ name, quantity, price, drop = false }) => {
    if (quantity <= 0) return;

    var quantityOwned = getDrugCount(name);

    if (quantityOwned < quantity) {
      log.fatal(`You don't have ${quantity} ${name} to ${drop ? 'drop' : 'sell'}. You only have ${quantityOwned}!`);
      return;
    }

    const match = drugs.value.find(drug => drug.name === name);
    if (!match) return; // No such drug in the trenchcoat, nothing to remove

    match.quantity -= quantity;

    // If quantity drops to 0, remove the item from the trenchcoat
    if (match.quantity === 0) {
      drugs.value = drugs.value.filter(x => x.name != name);
    }

    if (drop == false) {
      cash.value += price * quantity;
      log.success(`You sold ${quantity} ${name} for $${format.number(quantity * price)}.`);
    }
    else
      log.info(`You dropped ${quantity} ${name}.`);
  }

  const sellGun = ({ name, price, quantity = 1 }) => {
    const match = guns.value.find(g => g.name === name);
    if (!match) {
      log.warn(`You don't have a ${name} to sell!`);
      return;
    }

    match.quantity -= quantity;
    // If quantity drops to 0, remove the item from the trenchcoat
    if (match.quantity === 0) {
      guns.value = guns.value.filter(x => x.name != name);
    }

    var totalCost = (price || match.price) * quantity;
    cash.value += totalCost;
    log.success(`You sold ${quantity} ${name}(s) for $${format.number(totalCost)}.`);
  }

  const sellLung = (price) => {
    health.value *= (lungs.value > 1 ? 0.5 : 1); //selling first lung takes 50%, selling second lung kills you
    lungs.value -= 1;
    cash.value += price;
    if (lungs.value <= 0) {
      die("You sold your last healthy lung and suffocated to death!");
    }
  }

  const takeDamage = (amount) => {
    if (health.value - amount <= 0) {
      die("You took too much damage and died!");
    }
    else {
      health.value -= amount;
    }
  }

  reset();

  return {
    giveCash,
    bitches,
    borrowMoney,
    buyDrugs,
    buyGun,
    buySomething,
    cash,
    debt,
    die,
    drugs,
    dropDrugs,
    getDrugCount,
    gunCapacity,
    getGunCount,
    gunCount,
    incurDailyDebt,
    depositMoney,
    withdrawMoney,
    percentageFull,
    spaceRemaining,
    spaceUsed,
    storageCapacity,
    guns,
    heal,
    health,
    hireBitch,
    lungs,
    name,
    payDebt,
    profit,
    reasonOfDeath,
    reset,
    savings,
    sellDrugs,
    sellGun,
    sellLung,
    storage,
    takeDamage
  }
}

export { createPlayer };
