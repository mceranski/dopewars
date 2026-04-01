import { useBank } from '@/classes/composables/Bank';
import { useDrugDeal } from '@/classes/composables/DrugDeal';
import { useGameOver } from '@/classes/composables/GameOver';
import { useGunShop } from '@/classes/composables/GunShop';
import { useLoanShark } from '@/classes/composables/LoanShark';
import { useFight } from '@/classes/composables/Fight';
import { useRandomEvent } from '@/classes/composables/RandomEvent';

export class ViewService {
  constructor(game) {
    this.game = game;
  }

  static DrugDeal = "DrugDeal";
  static Bank = "Bank";
  static GameOver = "GameOver";
  static GunShop = "GunShop";
  static LoanShark = "LoanShark";
  static Fight = "Fight";
  static RandomEvent = "RandomEvent";

  static mappings = new Map([
    [ViewService.Bank, useBank],
    [ViewService.DrugDeal, useDrugDeal],
    [ViewService.GameOver, useGameOver],
    [ViewService.GunShop, useGunShop],
    [ViewService.LoanShark, useLoanShark],
    [ViewService.Fight, useFight],
    [ViewService.RandomEvent, useRandomEvent]
  ]);

  create({ type, options = {} }) {
    const activator = ViewService.mappings.get(type);
    if (activator === undefined)
      throw new Error(`No mapping found for: ${type}`);
    var composable = activator({ game: this.game, options });
    return { type, instance: composable };
  }
}
