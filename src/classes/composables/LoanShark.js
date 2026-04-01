import { ref, computed } from "vue";
import { random } from "@/classes/Utils.js";

function useLoanShark({ game, options }) {
  const player = game.player.value;
  const paymentAmount = ref(player.cash > player.debt ? player.debt : 0);
  const borrowAmount = random.number(500, 20000);
  const canBorrow = ref(true);
  const debt = computed(() => player.debt);
  const canPayDebt = computed(() => player.cash > 0 && player.debt > 0);

  const exit = () => game.closeView();

  const payDebt = () => {
    player.payDebt(paymentAmount.value);
    paymentAmount.value = 0;
  }

  const borrow = () => {
    player.borrowMoney(borrowAmount);
    canBorrow.value = false;
  }

  return {
    name: options.name || "Loan Shark",
    paymentAmount,
    borrowAmount,
    debt,
    exit,
    payDebt,
    canPayDebt,
    canBorrow,
    borrow
  }
}

export { useLoanShark };
