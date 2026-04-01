<script setup>
import { format } from '@/classes/Utils.js';
const model = defineModel();
</script>

<template>
<div>
  <h2 class="title">Game Over</h2>

  <div class="block">
    <div class="is-pulled-left">
      <font-awesome-icon v-if="model.health <= 0" :icon="['fas', 'skull-crossbones']" class="is-size-1 mr-2" />
      <font-awesome-icon v-else :icon="['fas', 'trophy']" class="is-size-1 mr-2" />
    </div>
    <p>
      <span v-show="model.health <= 0">R.I.P {{ model.reasonOfDeath }}</span>
      <span>{{ ` You made a net profit of $${format.number(model.profit)}!` }}</span>
    </p>
  </div>

  <button class="button is-primary mt-4" @click="model.restartGame()">Play Again</button>
</div>
</template>
