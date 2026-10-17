<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { LOCATION, LOCATION_TAP, TEMPERATURE, type City } from './grips';
defineProps<{ title: string }>();
const location = useGrip(LOCATION);
const handle = useGrip(LOCATION_TAP);
const temperature = useGrip(TEMPERATURE);
</script>
<template>
  <section class="demo-card" :aria-label="title">
    <h2>{{ title }}</h2>
    <label
      >City
      <select
        :value="location"
        @change="handle?.set(($event.target as HTMLSelectElement).value as City)"
      >
        <option>Sydney</option>
        <option>Paris</option>
      </select></label
    >
    <p>
      Temperature: <output>{{ temperature ?? '…' }}</output> °C
    </p>
  </section>
</template>
