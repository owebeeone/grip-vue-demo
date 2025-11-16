<template>
  <div class="weather-location-select">
    <label class="label">{{ title }}</label>
    <select v-model="selected" @change="onChange">
      <option v-for="opt in options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { GripContextLike } from '@owebeeone/grip-core'
import { ref, watchEffect } from 'vue'
import { useGrip } from '@owebeeone/grip-vue'
import { WEATHER_LOCATION, WEATHER_LOCATION_TAP } from './grips.weather'

const props = defineProps<{
  title: string
  ctx: GripContextLike
}>()

const options = [
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
  'Canberra',
  'Newcastle',
  'Wollongong'
] as const

const location = useGrip(WEATHER_LOCATION, props.ctx)
const locationTap = useGrip(WEATHER_LOCATION_TAP, props.ctx)

const selected = ref<string>('Sydney')

watchEffect(() => {
  if (location.value) {
    selected.value = String(location.value)
  }
})

function onChange() {
  locationTap.value?.set(selected.value as any)
}
</script>

<style scoped>
.weather-location-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.label {
  min-width: 80px;
}
</style>

