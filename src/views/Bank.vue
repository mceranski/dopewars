<script setup>
import { format } from '@/classes/Utils';
const model = defineModel();
</script>

<template>
<div>
  <div class="level">
    <div class="level-left">
      <h1 class="title"><font-awesome-icon :icon="['fas', 'bank']" class="mr-2" /> {{ model.name }}</h1>
    </div>
    <div class="level-right">
      <button type="button" class="button is-info" @click="model.exit()">Deal Drugs</button>
    </div>
  </div>


  <div class="fixed-grid has-3-cols">
    <div class="grid">
      <div class="cell" v-if="model.canDeposit">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Deposit Money
            </p>
          </header>
          <div class="card-content">
            <p>You have ${{ format.number(model.cash) }}. How much would you like to deposit?</p>
            <div class="field mt-4 is-grouped is-grouped-centered">
              <div class="control">
                <input class="input has-text-right" type="number" min="0" v-model="model.depositAmount" :max="model.cash">
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="buttons is-centered card-footer-item">
              <button type="button" class="button is-primary" :disabled="!model.canDeposit" @click="model.deposit()">Deposit ${{ format.number(model.depositAmount) }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="cell" v-if="model.canWithdraw">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Withdraw Money
            </p>
          </header>
          <div class="card-content">
            You currently have ${{ format.number(model.savings) }} in your savings. How much would you like to withdraw?

            <div class="field mt-4 is-grouped is-grouped-centered">
              <div class="control">
                <input class="input has-text-right" type="number" min="0" v-model="model.withdrawAmount" :max="model.savings">
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="buttons is-centered card-footer-item">
              <button type="button" class="button is-primary" :disabled="!model.canWithdraw" @click="model.withdraw()">Withdraw ${{ format.number(model.withdrawAmount) }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
