<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { WEATHER_LOCATION, WEATHER_LOCATION_TAP } from './grips.weather';
defineProps<{ title: string }>();
const location = useGrip(WEATHER_LOCATION);
const handle = useGrip(WEATHER_LOCATION_TAP);
const OPTIONS = [
  'Sydney',
  'Melbourne',
  'San Jose',
  'Palo Alto',
  'Paris',
  'Bella Vista, NSW',
  'Darwin',
  'Adelaide',
  'Perth',
  'Hobart',
  'Brisbane',
  'Gold Coast',
  'Newcastle',
  'Canberra',
  'Wollongong',
  'Cairns',
  'Toowoomba',
  'Sunshine Coast',
  'Mackay',
  'Townsville',
  'Rockhampton',
  'Bundaberg',
  'Gladstone',
  'Hervey Bay',
  'Maryborough',
  'Bunbury',
  'Port Macquarie',
  'Port Douglas',
  'Port Lincoln',
  'Port Pirie',
  'Port Augusta',
] as const;
</script>
<template>
  <label
    >{{ title }}
    <select :value="location" @change="handle?.set(($event.target as HTMLSelectElement).value)">
      <option v-for="city in OPTIONS" :key="city">{{ city }}</option>
    </select></label
  >
</template>
