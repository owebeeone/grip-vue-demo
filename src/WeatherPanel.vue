<script setup lang="ts">
import { GripScope, useGrip } from '@owebeeone/grip-vue';
import { createAtomValueTap, type MatchingContext } from '@owebeeone/grip-core';
import { WEATHER_PROVIDER_NAME, WEATHER_PROVIDER_NAME_TAP } from './grips';
import { WEATHER_LOCATION, WEATHER_LOCATION_TAP } from './grips.weather';
import WeatherColumn from './WeatherColumn.vue';
const provider = useGrip(WEATHER_PROVIDER_NAME);
const handle = useGrip(WEATHER_PROVIDER_NAME_TAP);
function seed(context: MatchingContext, city: string) {
  context
    .getGripHomeContext()
    .registerTap(
      createAtomValueTap(WEATHER_LOCATION, { initial: city, handleGrip: WEATHER_LOCATION_TAP }),
    );
}
</script>
<template>
  <div>
    <div class="provider-row">
      <span
        >Current weather provider: <strong>{{ provider }}</strong></span
      >
      <div>
        <button
          :disabled="provider === 'meteo'"
          :aria-pressed="provider === 'meteo'"
          @click="handle?.set('meteo')"
        >
          Meteo
        </button>
        <button
          :disabled="provider === 'mock'"
          :aria-pressed="provider === 'mock'"
          @click="handle?.set('mock')"
        >
          Mock
        </button>
      </div>
    </div>
    <div class="example-columns">
      <GripScope scope-key="weather-column:left" :init="(ctx) => seed(ctx, 'Sydney')"
        ><WeatherColumn title="Location A"
      /></GripScope>
      <GripScope scope-key="weather-column:right" :init="(ctx) => seed(ctx, 'San Jose')"
        ><WeatherColumn title="Location B"
      /></GripScope>
    </div>
  </div>
</template>
