import { ref, computed } from "vue";

function useBank({ game, options }) {
  const player = game.player.value;
  const savings = computed(() => player.savings);
  const cash = computed(() => player.cash);
  const exit = () => game.closeView();

  const canWithdraw = computed(() => player.savings > 0);
  const canDeposit = computed(() => player.cash > 0);
  const withdrawAmount = ref(player.savings > 0 ? player.savings : 0);
  const depositAmount = ref(player.cash > 0 ? player.cash : 0);

  const withdraw = () => {
    player.withdrawMoney(withdrawAmount.value);
    withdrawAmount.value = 0;
  }

  const deposit = () => {
    player.depositMoney(depositAmount.value);
    depositAmount.value = 0;
  }

  return {
    name: options.name || "Bank",
    cash,
    canWithdraw,
    withdraw,
    withdrawAmount,
    canDeposit,
    deposit,
    depositAmount,
    savings,
    exit
  }
}

export { useBank };
