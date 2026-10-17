<script setup lang="ts">
import { computed } from 'vue';
import { useGrip } from '@owebeeone/grip-vue';
import { COUNT } from './grips';
import TimeClock from './TimeClock.vue';
const count = useGrip(COUNT);
const visible = computed(() => count.value != null && count.value % 2 === 0);
</script>
<template>
  <section class="demo-card" aria-label="Clock">
    <div class="card-heading">
      <h3>Clock</h3>
      <span class="clock-status" :class="{ 'is-live': visible }">{{
        visible ? 'Live' : 'Hidden'
      }}</span>
    </div>
    <div class="clock-value"><TimeClock v-if="visible" /><span v-else>—</span></div>
    <p class="card-caption">Visible when the count is even</p>
  </section>
</template>
