<template>
  <GripParams :ctx="ctx" :bindings="locationBindings">
    <div class="weather-column">
      <WeatherLocationSelect :title="title" :ctx="ctx" />

      <div class="geo">
        Location: <strong>{{ geoLabel }}</strong>
      </div>

      <div v-if="isLoading" class="status">Loading weather…</div>
      <div v-else-if="errorMessage" class="status error">
        Failed to load weather: {{ errorMessage }}
      </div>
      <div v-else class="grid">
        <div>Temp (°C)</div><div>{{ temp }}</div>
        <div>Humidity (%)</div><div>{{ humidity }}</div>
        <div>Wind (kph)</div><div>{{ wind }}</div>
        <div>Wind dir</div><div>{{ windDir }}</div>
        <div>Rain chance (%)</div><div>{{ rain }}</div>
        <div>Sunny chance (%)</div><div>{{ sunny }}</div>
        <div>UV index</div><div>{{ uv }}</div>
      </div>
    </div>
  </GripParams>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GripParams, useGrip, useGripRuntime, useGripQuery } from '@owebeeone/grip-vue'
import type { GripContextLike } from '@owebeeone/grip-core'
import WeatherLocationSelect from './WeatherLocationSelect.vue'
import {
  WEATHER_LOCATION,
  WEATHER_LOCATION_TAP,
  GEO_LABEL,
  WEATHER_SUMMARY,
  type WeatherSummary
} from './grips.weather'

const props = defineProps<{
  title: string
  initialLocation: string
}>()

const { context: parentCtx } = useGripRuntime()
const ctx = parentCtx
  .getGripConsumerContext()
  .createChild(`weather-column-${props.title.toLowerCase().replace(/\s+/g, '-')}`) as GripContextLike

const locationBindings = computed(() => [
  { grip: WEATHER_LOCATION, value: props.initialLocation, handleGrip: WEATHER_LOCATION_TAP }
])

const summary = useGripQuery<WeatherSummary | undefined>(WEATHER_SUMMARY, { ctx })
const geo = useGrip(GEO_LABEL, ctx)

const geoLabel = computed(() => geo.value ?? 'Unknown')
const temp = computed(() => summary.data.value?.tempC ?? '-')
const humidity = computed(() => summary.data.value?.humidityPct ?? '-')
const wind = computed(() => summary.data.value?.windSpeedKph ?? '-')
const windDir = computed(() => summary.data.value?.windDirection ?? '')
const rain = computed(() => summary.data.value?.rainChancePct ?? '-')
const sunny = computed(() => summary.data.value?.sunnyChancePct ?? '-')
const uv = computed(() => summary.data.value?.uvIndex ?? '-')
const isLoading = computed(() => summary.loading.value)
const errorMessage = computed(() => {
  const err = summary.error.value
  if (!err) return ''
  if (err instanceof Error) return err.message
  return typeof err === 'string' ? err : String(err)
})
</script>

<style scoped>
.weather-column {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
}
.geo {
  margin-bottom: 8px;
  color: gray;
}
.grid {
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 6px;
  column-gap: 8px;
}
.status {
  margin-top: 8px;
  color: #555;
}
.status.error {
  color: #b00020;
}
</style>
