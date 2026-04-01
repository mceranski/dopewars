<script setup>
import { format } from '@/classes/Utils';
const model = defineModel();
</script>

<template>
<div>
  <div class="level">
    <div class="level-left">
      <h1 class="title"><font-awesome-icon :icon="['fas', 'money-bill-wave']" class="mr-2" /> {{ model.name }}</h1>
    </div>

    <div class="level-right">
      <button type="button" class="button is-info" @click="model.exit()">Deal Drugs</button>
    </div>
  </div>

  <div class="notification" v-if="!model.canPayDebt && !model.canBorrow">
    <p>You have no money to pay off your debt, and the loan shark won't lend you any more. Better luck next time!</p>
  </div>

  <div class="fixed-grid has-3-cols">
    <div class="grid">
      <div class="cell" v-if="model.canBorrow">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Borrow Money
            </p>
          </header>
          <div class="card-content">
            <p>Need some quick cash? The loan shark can help you out... for a price. I can offer you
              <strong>${{ format.number(model.borrowAmount) }}</strong>, but be prepared to pay it back
              with 15% daily interest!
            </p>
          </div>

          <div class="card-footer">
            <div class="buttons is-centered card-footer-item">
              <button type="button" class="button is-primary" :disabled="!model.canBorrow" @click="model.borrow()">Borrow ${{ format.number(model.borrowAmount) }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="cell" v-if="model.canPayDebt">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Pay Debt
            </p>
          </header>
          <div class="card-content">
            You currently owe ${{ format.number(model.debt) }}. How much would you like to pay back?

            <div class="field mt-4 is-grouped is-grouped-centered">
              <div class="control">
                <input class="input has-text-right" type="number" min="0" v-model="model.paymentAmount" :max="model.debt">
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="buttons is-centered card-footer-item">
              <button type="button" class="button is-primary" :disabled="!model.canPayDebt" @click="model.payDebt()">Pay Debt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
