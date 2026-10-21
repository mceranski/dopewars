import { ref, computed } from 'vue';
import { Drug } from '../Drug.js';
import { random } from '../Utils.js';
import { ViewService } from '../ViewService.js';

function useDrugDeal({ game, options }) {
  const cart = ref({});
  const availableDrugs = ref([]);
  const player = game.player.value;
  const log = game.log;
  const location = computed(() => game.location.value);

  const buyDrugs = ({ name, price, quantity = 1 }) => {
    player.buyDrugs({ name, price, quantity });
    updateDrugs(false);
  }

  const sellDrugs = (item) => {
    var quantity = cart.value[item.name] || 0;
    const currentPrice = availableDrugs.value.find(x => x.name === item.name)?.price || 0;
    player.sellDrugs({ name: item.name, quantity, price: currentPrice, drop: false });
    updateDrugs(false);
  }

  const dropDrugs = async (item) => {
    var quantity = cart.value[item.name] || 0;
    player.dropDrugs({ name: item.name, quantity, price: 0, drop: true });
    updateDrugs(false);

    if (random.occurence(0.4)) { // 40% chance of cops showing up when dropping drugs
      log.info(`The cops spotted you dropping drugs!`);
      await game.startView(ViewService.StandOff, location.value.name, true); // Return to this drug deal view after the stand-off
    }
  }

  const canSellDrug = (drug) => availableDrugs.value.some(x => x.name === drug.name);

  const playerDrugs = computed(() => player.drugs);

  const getPlayerDrugCount = (name) => player.getDrugCount(name);

  const updateDrugs = (repopulate = true) => {
    if (repopulate)
      availableDrugs.value = Drug.getRandomDrugs({ min: 3, max: 8 });

    availableDrugs.value.forEach(drug => {
      if (repopulate) {
        if (drug.priceIndex > 3) log.warn(Drug.getExpensiveString(drug));
        if (drug.priceIndex < 0.5) log.warn(Drug.getCheapString(drug));
      }
      var maxAffordableQuantity = Math.floor(player.cash / drug.price);
      var remainingSpace = player.spaceRemaining;
      drug.quantity = Math.min(maxAffordableQuantity, remainingSpace);
    });

    cart.value = player.drugs.reduce((cart, item) => {
      cart[item.name] = player.getDrugCount(item.name); // Set default quantity to the total quantity owned for each drug
      return cart;
    }, {});
  }

  updateDrugs();

  return {
    name: options.name || "Drug Deal",
    availableDrugs,
    getPlayerDrugCount,
    location,
    buyDrugs,
    dropDrugs,
    canSellDrug,
    playerDrugs,
    cart,
    sellDrugs,
    updateDrugs
  }
}

export { useDrugDeal }
