<script setup>
import { format } from '@/classes/Utils.js';

defineProps({
  scores: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <p v-if="scores.length === 0" class="has-text-centered">No scores recorded yet. Finish a game to set your first score!</p>
  <div v-else class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(score, index) in scores" :key="`${score.playedAt}-${index}`">
          <th>{{ index + 1 }}</th>
          <td>${{ format.number(score.value) }}</td>
          <td>{{ format.date(score.playedAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
