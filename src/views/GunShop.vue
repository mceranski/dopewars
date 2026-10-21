<script setup>
import { format } from '@/classes/Utils.js';
const model = defineModel();
</script>

<template>
<div>
  <div class="level">
    <div class="level-left">
      <h1 class="title"><font-awesome-icon :icon="['fas', 'store']" class="mr-2" /> {{ model.name }}</h1>
    </div>
    <div class="level-right">
      <button type="button" class="button is-info" @click="model.exit()">Deal Drugs</button>
    </div>
  </div>

  <p>
    You have ${{ format.number(model.cashAvailable) }} cash. Your trenchcoat has {{ model.spaceRemaining }} space remaining.
    You have enough space for {{ model.gunCapacity }} guns.
  </p>

  <div class="fixed-grid has-3-cols">
    <div class="grid">
      <div class="cell" v-for="gun in model.inventory" :key="gun.name">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <font-awesome-icon :icon="['fas', 'gun']" class="mr-2" />
              {{ gun.name }}
            </p>
          </header>
          <div class="card-content">
            <p>Price: ${{ format.number(gun.price) }}</p>
            <p>Inventory Space: {{ gun.inventorySpace }}</p>
            <p>Damage: {{ gun.damage }}</p>
            <p>Quantity Owned: {{ model.getGunCount(gun.name) }}</p>
          </div>

          <div class="card-footer">
            <div class="buttons is-centered card-footer-item">
              <button type="button" class="button is-primary" @click="model.buyGun(gun)" :disabled="!model.canBuyGun(gun)">Buy</button>
              <button type="button" class="button is-light" @click="model.sellGun(gun)" :disabled="!model.canSellGun(gun)">Sell</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
