<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import {
  WEATHER_TEMP_C,
  WEATHER_HUMIDITY,
  WEATHER_WIND_SPEED,
  WEATHER_WIND_DIR,
  WEATHER_RAIN_PCT,
  WEATHER_SUNNY_PCT,
  WEATHER_UV_INDEX,
  GEO_LABEL,
} from './grips.weather';
import WeatherLocationSelect from './WeatherLocationSelect.vue';
defineProps<{ title: string }>();
const temp = useGrip(WEATHER_TEMP_C);
const humidity = useGrip(WEATHER_HUMIDITY);
const wind = useGrip(WEATHER_WIND_SPEED);
const direction = useGrip(WEATHER_WIND_DIR);
const rain = useGrip(WEATHER_RAIN_PCT);
const sunny = useGrip(WEATHER_SUNNY_PCT);
const uv = useGrip(WEATHER_UV_INDEX);
const location = useGrip(GEO_LABEL);
</script>
<template>
  <section class="demo-card" :aria-label="title">
    <WeatherLocationSelect :title="title" />
    <p class="card-caption">
      Location: <strong>{{ location || '…' }}</strong>
    </p>
    <dl>
      <dt>Temp (°C)</dt>
      <dd>{{ temp ?? '—' }}</dd>
      <dt>Humidity (%)</dt>
      <dd>{{ humidity ?? '—' }}</dd>
      <dt>Wind (kph)</dt>
      <dd>{{ wind ?? '—' }}</dd>
      <dt>Wind dir</dt>
      <dd>{{ direction || '—' }}</dd>
      <dt>Rain chance (%)</dt>
      <dd>{{ rain ?? '—' }}</dd>
      <dt>Sunny (%)</dt>
      <dd>{{ sunny ?? '—' }}</dd>
      <dt>UV index</dt>
      <dd>{{ uv ?? '—' }}</dd>
    </dl>
  </section>
</template>
