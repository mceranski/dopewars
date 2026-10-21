export class Location {
  static MaxVisits = 2;

  constructor({ name, latLong }) {
    this.name = name
    this.latLong = latLong;
    this.attractions = [];
    this.probability = .5;
  }

  static All = [
    new Location({ name: "Bronx", latLong: [40.8448, -73.8648] })
      .addAttraction("LoanShark", "The Loan Shark", 0.4),
    new Location({ name: "Ghetto", latLong: [40.7957, -73.9389] }),
    new Location({ name: "Central Park", latLong: [40.785091, -73.968285] }),
    new Location({ name: "Manhattan", latLong: [40.7831, -73.9712] })
      .addAttraction("Bank", "The Bank", 0.3),
    new Location({ name: "Brooklyn", latLong: [40.6782, -73.9442] })
      .addAttraction("GunShop", "Dan's House of Guns", 0.35),
    new Location({ name: "Queens", latLong: [40.7282, -73.7949] })
  ];

  addAttraction(type, name, probability) {
    const attraction = { type, name, probability, visitCount: 0 };
    this.attractions.push(attraction);
    return this; // Return the instance to allow chaining
  }

  findAvailableAttraction() {
    var available = this.attractions.filter(x => x.visitCount < Location.MaxVisits);

    if (available.length === 0) return null;

    //sort available attractions by probability and visit count, prioritizing attractions that have been visited less and have higher probability
    var sorted = available.sort((a, b) => a.visitCount - b.visitCount)

    var shouldVisit = Math.random() < sorted[0].probability;
    if (!shouldVisit) return null;

    var bestMatch = sorted[0];
    bestMatch.visitCount++;
    bestMatch.probability *= 0.75; //reduce the probability of visiting the same attraction again by 25%
    return bestMatch;
  }
}
