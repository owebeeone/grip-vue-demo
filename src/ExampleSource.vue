<script setup lang="ts">
import { computed } from 'vue';
import SourceColumn from './SourceColumn.vue';
import source0 from './ClockCounterPanel.vue?raw';
import source1 from './DescriptionEditor.vue?raw';
import source2 from './TimeClock.vue?raw';
import source3 from './descriptionScope.ts?raw';
import source4 from './grips.ts?raw';
import source5 from './taps.ts?raw';
import source6 from './CalculatorPanel.vue?raw';
import source7 from './taps_calculator.ts?raw';
import source8 from './WeatherColumn.vue?raw';
import source9 from './WeatherLocationSelect.vue?raw';
import source10 from './WeatherPanel.vue?raw';
import source11 from './openmeteo_taps.ts?raw';
import source12 from './grips.weather.ts?raw';
import source13 from './CoinColumn.vue?raw';
import source14 from './CoinPanel.vue?raw';
import source15 from './coinScope.ts?raw';
import source16 from './cointaps.ts?raw';
import source17 from './grips.coin.ts?raw';
import clockCard from './ClockCard.vue?raw';
const props = defineProps<{ tab: 'clock' | 'calc' | 'weather' | 'coins' }>();
const examples = {
  clock: {
    title: 'Clock & Counter',
    ui: [
      { name: 'ClockCounterPanel.vue', text: source0 },
      { name: 'ClockCard.vue', text: clockCard },
      { name: 'DescriptionEditor.vue', text: source1 },
      { name: 'TimeClock.vue', text: source2 },
    ],
    providers: [
      { name: 'descriptionScope.ts', text: source3 },
      { name: 'grips.ts', text: source4 },
      { name: 'taps.ts', text: source5 },
    ],
  },
  calc: {
    title: 'Calculator',
    ui: [{ name: 'CalculatorPanel.vue', text: source6 }],
    providers: [
      { name: 'taps_calculator.ts', text: source7 },
      { name: 'grips.ts', text: source4 },
    ],
  },
  weather: {
    title: 'Weather',
    ui: [
      { name: 'WeatherColumn.vue', text: source8 },
      { name: 'WeatherLocationSelect.vue', text: source9 },
    ],
    providers: [
      { name: 'WeatherPanel.vue', text: source10 },
      { name: 'openmeteo_taps.ts', text: source11 },
      { name: 'grips.weather.ts', text: source12 },
      { name: 'taps.ts', text: source5 },
    ],
  },
  coins: {
    title: 'Coins',
    ui: [{ name: 'CoinColumn.vue', text: source13 }],
    providers: [
      { name: 'CoinPanel.vue', text: source14 },
      { name: 'coinScope.ts', text: source15 },
      { name: 'cointaps.ts', text: source16 },
      { name: 'grips.coin.ts', text: source17 },
    ],
  },
};
const example = computed(() => examples[props.tab]);
</script>
<template>
  <div class="example-source">
    <h3>{{ example.title }}</h3>
    <div class="source-columns">
      <SourceColumn :key="`${tab}-ui`" title="UI" :files="example.ui" />
      <SourceColumn
        :key="`${tab}-providers`"
        title="Scope & providers"
        :files="example.providers"
      />
    </div>
  </div>
</template>
