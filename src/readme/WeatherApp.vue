<script setup lang="ts">
import { GripScope, useGrip } from '@owebeeone/grip-vue';
import { createAtomValueTap, type MatchingContext } from '@owebeeone/grip-core';
import { LOCATION, LOCATION_TAP, SOURCE, SOURCE_TAP, type City, type WeatherSource } from './grips';
import WeatherColumn from './WeatherColumn.vue';
const source = useGrip(SOURCE);
const handle = useGrip(SOURCE_TAP);
function seed(context: MatchingContext, city: City) {
  context
    .getGripHomeContext()
    .registerTap(createAtomValueTap(LOCATION, { initial: city, handleGrip: LOCATION_TAP }));
}
</script>
<template>
  <main class="demo-content">
    <h1>Scoped weather</h1>
    <p>Both providers use local fixtures. No network request is needed.</p>
    <label
      >Provider
      <select
        :value="source"
        @change="handle?.set(($event.target as HTMLSelectElement).value as WeatherSource)"
      >
        <option value="mock">Mock</option>
        <option value="coordinates">Coordinates (fixture)</option>
      </select></label
    >
    <div class="example-columns">
      <GripScope scope-key="readme-weather:left" :init="(ctx) => seed(ctx, 'Sydney')"
        ><WeatherColumn title="Location A"
      /></GripScope>
      <GripScope scope-key="readme-weather:right" :init="(ctx) => seed(ctx, 'Paris')"
        ><WeatherColumn title="Location B"
      /></GripScope>
    </div>
  </main>
</template>
