<script setup>
import { format, validate } from '@/classes/Utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const model = defineModel();
</script>

<template>
<div>
  <h1 class="title">
    <font-awesome-icon :icon="['fas', 'location-dot']" class="has-text-link" /> {{ model.location.name }}
    <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2 mr-2 has-text-grey" />Deal Drugs
  </h1>

  <div class="columns">
    <div class="column is-narrow">
      <label class="label">
        <font-awesome-icon :icon="['fas', 'capsules']" class="has-text-success mr-2" />
        Available Drugs
      </label>
      <table class="table is-striped is-narrowed drug-table">
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Drug</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="drug in model.availableDrugs" :key="drug.name">
            <td>
              <div class="field has-addons has-addons-right">
                <p class="control">
                  <input class="input has-text-right" type="number" v-model="drug.quantity" min="0" @input="validate.quantity($event, 0, model.player.storageCapacity - model.player.spaceUsed)">
                </p>
                <p class="control">
                  <button class="button is-link" @click="model.buyDrugs(drug)">
                    Buy
                  </button>
                </p>
              </div>
            </td>
            <td class="nowrap">{{ drug.name }}</td>
            <td class="has-text-right">${{ format.number(drug.price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column is-narrow">
      <label class="label">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="has-text-success mr-2" />
        Drugs Carried
      </label>
      <table class="table is-striped is-narrowed drug-table">
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Owned</th>
            <th>Drug</th>
            <th>Avg. Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="drug in model.playerDrugs" :key="drug.name">
            <td>
              <div class="field has-addons has-addons-right has-addons-left">
                <p class="control">

                  <button class="button is-link" @click="model.sellDrugs(drug)" :disabled="!model.canSellDrug(drug)">
                    Sell
                  </button>
                </p>
                <p class="control">
                  <input class="input has-text-right" type="number" v-model="model.cart[`${drug.name}`]" min="0" :max="model.getPlayerDrugCount(drug.name)" @input="validate.quantity($event, 0, model.getPlayerDrugCount(drug.name))">
                </p>
                <p class="control">
                  <button class="button is-danger" @click="model.dropDrugs(drug)">
                    Drop
                  </button>
                </p>
              </div>
            </td>
            <td class="has-text-right">{{ model.getPlayerDrugCount(drug.name) }}</td>
            <td class="nowrap">{{ drug.name }}</td>
            <td class="has-text-right">${{ format.number(drug.price) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="model.playerDrugs.length == 0">
        <p class="has-text-centered">
          <font-awesome-icon :icon="['fas', 'face-frown']" class="mr-2" />
          You don't have any drugs to sell...
        </p>
      </div>
    </div>
  </div>
</div>
</template>
