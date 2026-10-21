import { ref } from 'vue';
import { random } from '@/classes/Utils.js';

class LogEntry {
  constructor({ message, color = "black" }) {
    this.message = message;
    this.color = color;
  }
}

class Log extends EventTarget {
  constructor(maxEntries = 100) {
    super();
    this.entries = ref([]);
    this.maxEntries = maxEntries;
  }

  write({ message, color }) {
    const entry = new LogEntry({ message: message, color: color });
    this.entries.value.push(entry);
    this.dispatchEvent(new CustomEvent('added', { detail: entry }));

    if (this.entries.value.length > this.maxEntries) {
      this.entries.value.shift();
    }
  }

  clear = () => this.entries.value = [];
  warn = (message) => this.write({ message: message, color: "yellow" });
  error = (error) => this.write({ message: error.message, color: "red" });
  fatal = (message) => this.write({ message: message, color: "red" });
  success = (message) => this.write({ message: message, color: "green" });
  info = (message) => this.write({ message: message, color: "default" });
  music = (song) => this.write({ message: `You hear someone playing ♫ ♪ ♬ ${song}`, color: "purple" });
  subway = (saying) => {
    var prefix = "<div>The lady next to you on the subway said,<div/>";
    var message = `<div class='ml-3'>&quot;${saying}&quot;</div>`;
    var suffix = random.bool() ? "" : "<div class='ml-6'>(at least, you -think- that's what she said)</div>";
    this.write({ message: `${prefix}${message}${suffix}`, color: "blue" })
  };
}

export { Log, LogEntry };
