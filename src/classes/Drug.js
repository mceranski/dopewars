import { random } from "./Utils";

export class Drug {
  constructor({ name, minPrice, maxPrice, canBeExtraCheap = false, canBeExtraExpensive = false }) {
    this.name = name;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.price = 0;
    this.quantity = 0;
    this.priceIndex = 0;
    this.canBeExtraCheap = canBeExtraCheap;
    this.canBeExtraExpensive = canBeExtraExpensive;
  }

  static cheapStrings = new Map([
    ['Acid', `The market is flooded with cheap home-made acid!`],
    ['Cocaine', `The market is saturated with cheap cocaine! Cocaine prices are plummeting!`],
    ['Hashish', `The Marrakesh Express has arrived! Hashish prices are dropping!`],
    ['Heroin', `The Afghan caravan got lost in the mountains! Heroin prices are plummeting!`],
    ['Shrooms', `The mushroom farm had a bumper crop! Shroom prices are dropping!`],
    ['Ludes', `Rival drug deals raided a pharmacy and are selling cheap ludes!`],
    ['MDA', `The rave scene is booming! MDA prices are dropping!`],
    ['Opium', `The opium fields had a great harvest! Opium prices are plummeting!`],
    ['Peyote', `The desert is blooming with peyote! Prices are dropping!`],
    ['Speed', `The meth lab is running 24/7! Speed prices are plummeting!`],
    ['Weed', `Columbian freighter dusted the Coast Guard! Weed prices have bottomed out!`]
  ]);

  static expensiveStrings = new Map([
    ['Acid', `The government cracked down on acid production! Prices are soaring!`],
    ['Cocaine', `Cops made a big cocaine bust! Prices are outrageous!`],
    ['Hashish', `The Marrakesh Express got hijacked by pirates! Hashish prices are skyrocketing!`],
    ['Heroin', `The Afghan caravan fended off bandits! Heroin prices are soaring!`],
    ['Shrooms', `The mushroom farm was hit by a blight! Shroom prices are skyrocketing!`],
    ['Ludes', `Rival drug deals set fire to a pharmacy! Lude prices are through the roof!`],
    ['MDA', `The rave scene is dying! MDA prices are skyrocketing!`],
    ['Opium', `The opium fields were destroyed by a flood! Opium prices are soaring!`],
    ['Peyote', `The peyote crop was wiped out by a sandstorm! Prices are skyrocketing!`],
    ['Speed', `The meth lab got raided by the cops! Speed prices are skyrocketing!`],
    ['Weed', `The Columbian freighter got caught in a storm and lost its cargo! Weed prices have skyrocketed!`]
  ]);

  static all = [
    new Drug({ name: "Acid", minPrice: 1000, maxPrice: 4400, canBeExtraCheap: true, canBeExtraExpensive: false }),
    new Drug({ name: "Cocaine", minPrice: 15000, maxPrice: 29000, canBeExtraCheap: false, canBeExtraExpensive: true }),
    new Drug({ name: "Hashish", minPrice: 480, maxPrice: 1280, canBeExtraCheap: true, canBeExtraExpensive: false }),
    new Drug({ name: "Heroin", minPrice: 5500, maxPrice: 13000, canBeExtraCheap: false, canBeExtraExpensive: true }),
    new Drug({ name: "Ludes", minPrice: 11, maxPrice: 60, canBeExtraCheap: true, canBeExtraExpensive: false }),
    new Drug({ name: "MDA", minPrice: 1500, maxPrice: 4400 }),
    new Drug({ name: "Opium", minPrice: 540, maxPrice: 1250, canBeExtraCheap: false, canBeExtraExpensive: true }),
    new Drug({ name: "PCP", minPrice: 1000, maxPrice: 2500 }),
    new Drug({ name: "Peyote", minPrice: 220, maxPrice: 700 }),
    new Drug({ name: "Shrooms", minPrice: 630, maxPrice: 1300 }),
    new Drug({ name: "Speed", minPrice: 90, maxPrice: 250, canBeExtraCheap: false, canBeExtraExpensive: true }),
    new Drug({ name: "Weed", minPrice: 315, maxPrice: 890, canBeExtraCheap: true, canBeExtraExpensive: false })
  ];

  static getRandomDrugs({ min = 3, max = 8 }) {
    var items = random.elements(Drug.all, min, max)
    items.forEach(x => x.randomizePrice());
    return items.sort((a, b) => a.name.localeCompare(b.name)); //sort by name
  }

  static getExpensiveString(drug) {
    return Drug.expensiveStrings.get(drug.name) || `The price of ${drug.name} is skyrocketing!`;
  }

  static getCheapString(drug) {
    return Drug.cheapStrings.get(drug.name) || `The price of ${drug.name} is plummeting!`;
  }

  canBeExtraCheap = () => this.canBeExtraCheap;
  canBeExtraExpensive = () => this.canBeExtraExpensive;

  randomizePrice() {
    var basePrice = Math.random() * (this.maxPrice - this.minPrice + 1) + this.minPrice;

    if (this.canBeExtraCheap && Math.random() < 0.15) // 15% chance to be extra cheap
      basePrice = this.minPrice * (Math.random() * 0.35 + 0.25); // 25 to 60% of minPrice, with a bias towards lower prices
    else if (this.canBeExtraExpensive && Math.random() < 0.2) // 20% chance to be extra expensive
      basePrice = this.maxPrice * (Math.random() * 2.5 + 1.5); //150% to 400% of maxPrice, with a bias towards higher prices

    this.price = Math.floor(basePrice);
    this.priceIndex = (this.price / ((this.minPrice + this.maxPrice) / 2));
    return this.priceIndex;
  }
}
