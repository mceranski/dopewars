import { random } from "./Utils.js";

export class Cop {
  constructor({ name, copArmor, deputyArmor }) {
    this.name = name;
    this.isAgent = name.startsWith("Agent");
    this.copArmor = copArmor;
    this.deputyArmor = deputyArmor;
    this.health = 100; // Cops start with 100% health
    this.deputyCount = Math.max(2, Math.min(15, Math.floor(this.copArmor / 5) + 1));
  }

  //TODO: Agent should have cops, cops should have deputies
  getTotalArmor = () => this.copArmor + (this.deputyCount * this.deputyArmor);

  getArmorStatus = () => {
    const totalArmor = this.getTotalArmor();
    if (totalArmor > 100) return 'heavily armed';
    if (totalArmor > 50) return 'adequately armed';
    return 'pitifully armed';
  };

  getBaseDamage = (isDeputy) => (this.isAgent ? 20 : 10) * (isDeputy ? 0.75 : 1);
  getMultiplier = () => this.isAgent ? random.number(1, 1.4) : random.number(.5, 1);
  getDamagePerShot = (isDeputy) => Math.floor((this.getBaseDamage(isDeputy) * this.getMultiplier()) * (isDeputy ? random.number(.5, .8) : 1));

  static all = [
    new Cop({ name: "Officer Hardass", copArmor: 4, deputyArmor: 3 }),
    new Cop({ name: "Officer Bob", copArmor: 15, deputyArmor: 4 }),
    new Cop({ name: "Agent Smith", copArmor: 50, deputyArmor: 6 })
  ];
}
