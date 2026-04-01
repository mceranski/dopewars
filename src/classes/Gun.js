export class Gun {
  constructor({ name, price, inventorySpace, damage }) {
    this.name = name;
    this.price = price;
    this.inventorySpace = inventorySpace;
    this.damage = damage;
  }

  static all = [
    new Gun({ name: "Baretta", price: 3000, inventorySpace: 4, damage: 25 }),
    new Gun({ name: ".38 Special", price: 3500, inventorySpace: 4, damage: 45 }),
    new Gun({ name: "Ruger", price: 2900, inventorySpace: 4, damage: 20 }),
    new Gun({ name: "Saturday Night Special", price: 3100, inventorySpace: 4, damage: 35 }),
  ];
}
