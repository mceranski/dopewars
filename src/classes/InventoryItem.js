import { ref } from 'vue';
import { Gun } from './Gun.js';

class InventoryItem {
    constructor({ name }) {
        this.name = name;
        this.space = 0;
        this.quantity = ref(0);
        this.price = ref(0);
    }

    getSpaceUsed = () => this.space * this.quantity.value;
}

class DrugInventory extends InventoryItem {
    constructor({ name, price, quantity }) {
        super({ name });
        this.price.value = price;
        this.space = 1;
        this.quantity.value = quantity;
    }
}

class GunInventory extends InventoryItem {
    constructor({ name, price }) {
        //guns do not change prices so we can just use the model price
        const model = Gun.all.find(x => x.name == name);
        if (model == null) throw new Error(`Gun model ${name} not found!`);
        super({ name: model.name });
        this.damage = model.damage;
        this.space = model.inventorySpace;
        this.quantity.value = 1; // Guns are sold one at a time
        this.price.value = price || model.price;
    }
}

export { InventoryItem, DrugInventory, GunInventory };
