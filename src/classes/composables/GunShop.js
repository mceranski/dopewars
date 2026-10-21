import { computed } from "vue";
import { random } from "@/classes/Utils";
import { Gun } from "@/classes/Gun";

function useGunShop({ game, options }) {
  const player = game.player.value;
  const inventory = random.elements(Gun.all, 1);
  const gunsOwned = computed(() => player.guns);

  const canBuyGun = (gun) => {
    return (player.cash >= gun.price)
      && (player.spaceRemaining >= gun.inventorySpace)
      && (gunsOwned.value.length < gunCapacity.value);
  }

  const canSellGun = (gun) => gunsOwned.value.some(g => g.name === gun.name);
  const cashAvailable = computed(() => player.cash);
  const gunCapacity = computed(() => player.gunCapacity);
  const spaceRemaining = computed(() => player.spaceRemaining);
  const getGunCount = (name) => player.getGunCount(name);

  const buyGun = (gun) => player.buyGun({ name: gun.name });
  const sellGun = (gun) => player.sellGun({ name: gun.name });
  const exit = () => game.closeView();

  return {
    name: options.name || "Gun Shop",
    cashAvailable,
    inventory,
    gunsOwned,
    gunCapacity,
    cashAvailable,
    spaceRemaining,
    canBuyGun,
    buyGun,
    canSellGun,
    sellGun,
    getGunCount,
    exit
  }
}

export { useGunShop };
