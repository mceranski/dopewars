const format = {
  number: (value) => {
    if (value === "0" || value === 0) return "0";
    if (value == null || isNaN(value)) return "";
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  },
  date: (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
}

const _getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const _getRandomOccurence = (percentChance) => Math.random() < percentChance;

const random = {
  number: (min, max) => _getRandomNumber(min, max),
  element: (array) => array[_getRandomNumber(0, array.length - 1)],
  elements: (array, min, max) => {
    const count = _getRandomNumber(min, max || array.length);
    const copy = [...array];
    const result = [];
    for (let i = 0; i < count; i++) {
      const index = _getRandomNumber(0, copy.length - 1);
      result.push(copy[index]);
      copy.splice(index, 1);
    }
    return result;
  },
  bool: () => _getRandomOccurence(0.5),
  occurence: (percentChance) => _getRandomOccurence(percentChance)
}

const validate = {
  quantity: (event, min, max) => {
    // Ensure the value is always non-negative
    const value = parseInt(event.target.value);
    if (isNaN(value)) {
      event.target.value = min;
      return;
    }

    var absValue = Math.abs(value);
    if (absValue > max)
      event.target.value = max;
    else
      event.target.value = absValue;
  }
}

const daysBetween = (date1, date2) => {
  const ONE_DAY_MS = 1000 * 60 * 60 * 24;
  // Convert both dates to UTC timestamps (discarding the time part)
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Calculate the difference in milliseconds and convert to days
  const differenceMs = Math.abs(utc2 - utc1); // Use Math.abs for a positive result
  return Math.floor(differenceMs / ONE_DAY_MS); // Use Math.floor for full days
}

export { format, validate, random, daysBetween };
