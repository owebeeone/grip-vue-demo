<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { CURRENT_TAB, CURRENT_TAB_TAP } from './grips';
const tab = useGrip(CURRENT_TAB);
const handle = useGrip(CURRENT_TAB_TAP);
const tabs = {
  clock: 'Clock & Counter',
  calc: 'Calculator',
  weather: 'Weather',
  coins: 'Coins',
} as const;
</script>
<template>
  <nav class="tab-bar" aria-label="Examples">
    <button
      v-for="(label, key) in tabs"
      :key="key"
      :aria-pressed="tab === key"
      :disabled="tab === key"
      @click="handle?.set(key)"
    >
      {{ label }}
    </button>
  </nav>
</template>
