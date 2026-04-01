import { computed } from 'vue';

function useGameOver({ game, options }) {
  const player = game.player.value;
  const profit = computed(() => player.profit);
  const reasonOfDeath = computed(() => player.reasonOfDeath);
  const health = computed(() => player.health);
  const restartGame = () => game.reset();

  return {
    name: options.name || "Game Over",
    health,
    profit,
    reasonOfDeath,
    restartGame
  }
}

export { useGameOver };
