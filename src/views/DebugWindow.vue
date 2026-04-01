<script setup>
import { ViewService } from '@/classes/ViewService';
import { useDebug } from '@/classes/composables/Debug';

const game = defineModel();
const model = useDebug({ game: game.value });
</script>

<template>
<div class="notification">
  <div class="buttons has-addons mb-1">
    <button type="button" class="button" @click="model.goToAttraction(ViewService.Bank)">Bank</button>
    <button type="button" class="button" @click="model.goToAttraction(ViewService.GunShop)">Gun Shop</button>
    <button type="button" class="button" @click="model.goToAttraction(ViewService.LoanShark)">Loan Shark</button>
    <button type="button" class="button" @click="model.startFight()">Fight</button>
    <button type="button" class="button" @click="model.startRandomEvent()">Random</button>
  </div>
  <div class="buttons has-addons">
    <button type="button" class="button" @click="model.buyGun()">Buy Baretta</button>
    <button type="button" class="button mr-3" @click="model.sellGun()">Sell Baretta</button>

    <button type="button" class="button mr-3" @click="model.buyAcid()">Buy Acid</button>

    <button type="button" class="button" @click="model.addCash(10000)">10K Cash</button>
    <button type="button" class="button" @click="model.borrow(1000)">+1K Debt</button>
    <button type="button" class="button" @click="model.payDebt(1000)">-1K Debt</button>
    <button type="button" class="button" @click="model.payDebt(100000)">-100K Debt</button>
    <button type="button" class="button mr-3" @click="model.makeDeposit(1000)">1K Savings</button>

    <button type="button" class="button" @click="model.sellLung()">Sell Lung</button>
    <button type="button" class="button mr-3" @click="model.heal()">Heal</button>

    <button type="button" class="button" @click="model.addBitch()">Hire Bitch</button>
  </div>
</div>
</template>
