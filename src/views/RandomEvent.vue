<script setup>
const model = defineModel();
</script>

<template>
<div>
  <div class="level">
    <div class="level-left">
      <p class="title">{{ model.title }}</p>
    </div>
    <div class="level-right">
      <button type="button" class="button is-info" @click="model.exit()">Deal Drugs</button>
    </div>
  </div>

  <div v-for="(item, index) in model.content" :key="index" class="block">
    <p class="subtitle mt-2" v-html="item" :class="{ 'has-text-weight-bold': index % 2 == 0, 'is-italic': index % 2 !== 0 }"></p>
  </div>

  <div class="buttons mt-2" v-if="!model.isCompleted">
    <button v-for="(command, index) in model.commands" :key="index" type="button" class="button" @click="command.execute()">
      {{ command.text }}
    </button>
  </div>
</div>
</template>
