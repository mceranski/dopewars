<script setup>
import LogControl from '@/components/LogControl.vue';
const model = defineModel();
</script>

<template>
<div>
  <h1 class="title">
    <font-awesome-icon :icon="['fas', 'person-military-pointing']" class="mr-2" /> Fight!
  </h1>

  <p>{{ model.subTitle }}</p>

  <table class="table is-fullwidth">
    <tbody>
      <tr>
        <td>You</td>
        <td>{{ model.bitchCount }} bitches</td>
        <td style="width:60%">
          <div class="columns">
            <div class="column is-narrow">
              <label class="label mr-3">Health</label>
            </div>
            <div class="column">
              <progress class="progress mt-1" :value="model.playerHealthMeter" max="100">{{ model.playerHealthMeter }}%</progress>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>{{ model.copName }}</td>
        <td>{{ model.deputyCount }} deputies</td>
        <td style="width:60%">
          <div class="columns">
            <div class="column is-narrow">
              <label class="label mr-3">Health</label>
            </div>
            <div class="column">
              <progress class="progress mt-1" :value="model.copHealthMeter" max="100">{{ model.copHealthMeter }}%</progress>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <log-control v-model="model.log" ref="logControl"></log-control>

  <div class="buttons mt-3">
    <button type="button" class="button is-link" @click="model.stand()" v-show="model.canStand">Stand Your Ground</button>
    <button type="button" class="button is-warning" @click="model.runAway()" v-show="model.canRunAway">Run Away</button>
    <button type="button" class="button is-danger" @click="model.fight()" v-show="model.canFight">Fight</button>
    <button type="button" class="button is-light" @click="model.exit()" v-show="model.canExit">Deal Drugs</button>
  </div>
</div>
</template>
