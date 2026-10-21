import { computed } from 'vue';
import { recordScore, storageError } from '@/classes/ScoreStorage.js';

function useGameOver({ game, options }) {
  const player = game.player.value;
  const profit = computed(() => player.profit);
  const reasonOfDeath = computed(() => player.reasonOfDeath);
  const health = computed(() => player.health);
  const name = player.name;
  const scores = recordScore(name, profit.value);
  const restartGame = () => game.reset();

  return {
    name: options.name || "Game Over",
    playerName: name,
    health,
    profit,
    reasonOfDeath,
    scores,
    storageError,
    restartGame
  }
}

export { useGameOver };
