import { ViewService } from "../ViewService";
import { bitchNames } from "../Strings";
import { random } from "../Utils";

function useDebug({ game }) {
  const player = game.player;
  const exit = () => game.closeView();
  const buyGun = () => player.buyGun({ name: 'Baretta' });
  const sellGun = () => player.sellGun({ name: 'Baretta' });
  const buyAcid = () => player.buyDrugs({ name: "Acid", price: 1, quantity: 1 });
  const borrow = (amount) => player.borrowMoney(amount);
  const payDebt = (amount) => player.payDebt(amount);
  const heal = () => player.heal({ amount: 100, price: 0 });
  const sellLung = () => player.sellLung(1000);
  const addCash = (amount) => player.giveCash({ amount: amount, message: `You won $${amount}.` });
  const addBitch = () => player.hireBitch({ name: random.element(bitchNames), price: 1000 });
  const makeDeposit = (amount) => player.depositMoney(amount);
  const startFight = () => goToView(ViewService.Fight);
  const startRandomEvent = () => goToView(ViewService.RandomEvent);
  const goToView = (name) => game.startView(name, { name: `Debug: ${name}` }, true);

  function goToAttraction(name) {
    var attraction = game.locations.map(x => x.attractions).flat().find(x => x.type == name);
    game.startView(attraction.type, { name: `Debug: ${attraction.name}` }, true);
  }

  return {
    name,
    exit,
    buyGun,
    sellGun,
    buyAcid,
    borrow,
    payDebt,
    heal,
    sellLung,
    addCash,
    addBitch,
    makeDeposit,
    goToAttraction,
    startFight,
    startRandomEvent
  }
}

export { useDebug };
