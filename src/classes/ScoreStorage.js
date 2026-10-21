import { ref } from 'vue';

const storageKey = 'dopewars.highScores';
const storageError = ref('');
const scoreEntries = ref(loadScores());

function reportStorageError(message, error) {
  console.error(message, error);
  storageError.value = message;
}

function loadScores() {
  try {
    const storedScores = localStorage.getItem(storageKey);
    if (storedScores === null) return [];

    const parsedScores = JSON.parse(storedScores);
    if (!Array.isArray(parsedScores))
      throw new Error('The saved high scores are not a valid list.');

    const hasInvalidScore = !parsedScores.every(score =>
      typeof score.playerName === 'string' &&
      typeof score.playerKey === 'string' &&
      Number.isFinite(score.value) &&
      typeof score.playedAt === 'string' &&
      Number.isFinite(Date.parse(score.playedAt))
    );
    if (hasInvalidScore)
      throw new Error('The saved high scores contain an invalid entry.');

    return parsedScores;
  }
  catch (error) {
    reportStorageError('Unable to load saved high scores.', error);
    return [];
  }
}

function getHighScores(playerName) {
  const playerKey = playerName.trim().toLowerCase();
  return scoreEntries.value
    .filter(score => score.playerKey === playerKey)
    .sort((left, right) => right.value - left.value || right.playedAt.localeCompare(left.playedAt))
    .slice(0, 10);
}

function recordScore(playerName, value) {
  const name = playerName.trim() || 'Player 1';
  const playerKey = name.toLowerCase();
  const playerScores = [
    ...scoreEntries.value.filter(score => score.playerKey === playerKey),
    { playerName: name, playerKey, value, playedAt: new Date().toISOString() }
  ]
    .sort((left, right) => right.value - left.value || right.playedAt.localeCompare(left.playedAt))
    .slice(0, 10);

  scoreEntries.value = [
    ...scoreEntries.value.filter(score => score.playerKey !== playerKey),
    ...playerScores
  ];

  try {
    localStorage.setItem(storageKey, JSON.stringify(scoreEntries.value));
    storageError.value = '';
  }
  catch (error) {
    reportStorageError('Unable to save high scores in this browser.', error);
  }

  return playerScores;
}

export { getHighScores, recordScore, storageError };
