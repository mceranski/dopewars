<script setup>
import { ref, nextTick } from 'vue';
const log = defineModel();
const logControl = ref(null);

log.value.addEventListener('added', async () => {
  await nextTick(); // Wait for the DOM to update with the new log entry
  if (!logControl.value) return;
  logControl.value.scrollTop = logControl.value.scrollHeight + 20; // Scroll to the bottom of the log
});
</script>

<template>
<div ref="logControl" class="log-container">
  <div v-for="(entry, index) in log.entries.value" :key="index" v-bind:class="`log-entry-${entry.color}`" v-html="entry.message">
  </div>
</div>
</template>

<style scoped>
.log-container {
  height: 105px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 5px 10px;
}

.log-entry-blue {
  color: cornflowerblue;
}

.log-entry-red {
  color: mediumvioletred;
}

.log-entry-green {
  color: rgb(45, 126, 45);
}

.log-entry-purple {
  color: purple;
}

.log-entry-yellow {
  color: goldenrod;
}
</style>
