<script setup>
import { format } from '@/classes/Utils.js';

defineProps({
  scores: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <section class="block">
    <h2 class="title is-5">High Scores</h2>
    <p v-if="scores.length === 0" class="has-text-grey">No scores recorded yet.</p>
    <table v-else class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Player</th>
          <th class="has-text-right">Profit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores" :key="score.name">
          <td>{{ score.name }}</td>
          <td class="has-text-right">${{ format.number(score.score) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>