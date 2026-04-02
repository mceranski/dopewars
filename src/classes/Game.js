import { Log } from './Log.js';
import { ref, computed } from 'vue';
import { random, daysBetween } from '@/classes/Utils.js';
import { createPlayer } from './Player.js';
import { Location } from './Location.js';
import { songNames, subwaySayings, stopToDos } from './Strings.js';
import { ViewService } from './ViewService.js';

function useGame() {
  const maxDays = 31;
  const startDate = new Date("December 1, 1984");
  const locations = Location.All;
  const date = ref(new Date(startDate));
  const daysRemaining = ref(maxDays);
  const hasUserInteracted = ref(false);
  const isOver = ref(false);
  const location = ref(null);
  const lastCopEncounter = ref(null); // Initialize to a very old date to ensure the first encounter can happen
  const copEncounters = ref(0);
  const log = new Log(10);
  const muted = ref(true);
  const player = ref(null);
  var resolver = null;
  const view = ref(ViewService.DrugDeal);

  const reset = () => {
    date.value = new Date(startDate);
    isOver.value = false;
    lastCopEncounter.value = null;
    copEncounters.value = 0;
    daysRemaining.value = maxDays;
    log.clear();
    resolver = null; // Initialize resolver for async operations
    var playerName = player.value?.name || "Player 1";
    player.value = createPlayer({ name: playerName, game: self });
    jet(random.element(locations));
    return self;
  }

  const isCopEncounterDue = () => {
    //a max of 3 encounters per game
    if (copEncounters.value >= 3) return false;

    var daysSinceLastEncounter = daysBetween(date.value, player.value.lastCopEncounter || startDate);

    if (daysSinceLastEncounter < 5) return false; //encounters must be at least 5 days apart

    // Probability increases exponentially after 5 days, up to a maximum of 75% chance
    var probablity = Math.min(0.75, 0.1 * Math.exp((daysSinceLastEncounter - 5) / 2));
    var startEncounter = copEncounters.value < 3 && random.occurence(probablity);

    if (startEncounter) {
      log.info("Cops are present in the area!");
      copEncounters.value++;
      player.value.lastCopEncounter = new Date(date.value);
    }

    return startEncounter;
  }

  const checkForRandomInteractions = async () => {
    //only either 1 subway saying, music, or random stop to do can occur per jet, with a 8% chance each
    //This prevents the log from being spammed with too many interactions at once, while still allowing for some fun randomness and flavor during gameplay
    if (random.occurence(0.08)) {
      var interactionType = random.element(['subway', 'music', 'stop']);
      if (interactionType === 'subway')
        log.subway(getRandomSubwaySaying());
      if (interactionType === 'music')
        log.music(getRandomSongName());
      if (interactionType === 'stop')
        log.info(`You stopped to ${getRandomStopToDo()}.`);
    }

    //no interactions for the first week, gives the player some time to get settled in
    if (daysRemaining.value <= maxDays - 7) {
      var areCopsPresent = isCopEncounterDue();
      if (areCopsPresent) {
        await startView(ViewService.Fight);
        return;
      }

      //only visit attractions if cops aren't present
      var attraction = areCopsPresent ? null : location.value.findAvailableAttraction();
      if (attraction) {
        log.info(`You decided to visit "${attraction.name}".`);
        // Set the view to the type of the attraction (e.g., "GunShop", "Pub", etc.)
        await startView(attraction.type, { name: attraction.name });
        return;
      }

      var showRandomEvent = random.occurence(0.1);
      if (showRandomEvent) {
        await startView(ViewService.RandomEvent);
      }
    }
  }

  const closeView = async () => {
    if (resolver) {
      resolver(); // Resolve the promise to continue execution
      resolver = null; // Reset the resolver
    }
  }

  const over = (reason) => {
    closeView(); // Close any open views when the game is over
    log.fatal(reason);
    isOver.value = true;
    startView(ViewService.GameOver);
  }

  const getRandomSongName = () => random.element(songNames);
  const getRandomSubwaySaying = () => random.element(subwaySayings);
  const getRandomStopToDo = () => random.element(stopToDos);

  const incrementDate = async (days = 1) => {
    date.value.setDate(date.value.getDate() + days);
    daysRemaining.value -= days;
    player.value.incurDailyDebt(); // Increase player's debt by daily interest rate on travel
  }

  const canJet = computed(() => isOver.value == false && view.value?.type !== ViewService.Fight);

  async function jet(destination) {
    var isLastDay = daysRemaining.value <= 1;

    if (location.value != null) {
      log.info(`Jetting to ${destination.name}.`);
      await incrementDate();
    }

    if (isLastDay == true) {
      over("Your dealing time is up!");
      return;
    }

    location.value = destination;
    playSound('train'); // Replace with the actual path to your sound file
    await checkForRandomInteractions();
    if (isOver.value) return; // If the game ended during random interactions, don't start the next view
    startView(ViewService.DrugDeal, { name: location.value.name });
  }

  const playSound = (name) => {
    if (!hasUserInteracted.value || muted.value) return; // Don't play sound if user hasn't interacted with the page or if muted
    const audio = new Audio(`sounds/${name}.mp3`); // Replace with the actual path to your sound file
    audio.play();
  }

  const startView = async (type, options = {}, returnAfter = false) => {
    var returnVm = returnAfter ? view.value : null; // Store the current view to return to after the stand-off
    if (returnVm != null) closeView(); // Close the current view before starting the new one
    var vm = new ViewService(self).create({ type, options });
    await runView(vm);
    if (returnVm != null) await runView(returnVm);
  }

  const runView = async (vm) => {
    view.value = vm;
    await new Promise(resolve => {
      resolver = resolve; // Store the resolver to be called when we want to close the view
    });
  }

  var self = {
    closeView,
    date,
    daysRemaining,
    hasUserInteracted,
    isOver,
    canJet,
    jet,
    location,
    locations,
    log,
    playSound,
    muted,
    over,
    player,
    reset,
    startView,
    view
  }

  return self.reset();
}

export { useGame };
