<template>
  <div>
    <div class="provider-row">
      <span>
        Current weather provider: <strong>{{ weatherProvider }}</strong>
      </span>
      <div>
        <button
          class="weather-provider-button"
          :class="{ selected: weatherProvider === 'meteo' }"
          :disabled="weatherProvider === 'meteo'"
          @click="() => setProvider('meteo')"
        >
          Meteo
        </button>
        <button
          class="weather-provider-button"
          :class="{ selected: weatherProvider === 'mock' }"
          :disabled="weatherProvider === 'mock'"
          @click="() => setProvider('mock')"
        >
          Mock
        </button>
      </div>
    </div>
    <div class="columns">
      <WeatherColumn title="Location A" initialLocation="Sydney" />
      <WeatherColumn title="Location B" initialLocation="Melbourne" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGrip } from '@owebeeone/grip-vue'
import { WEATHER_PROVIDER_NAME, WEATHER_PROVIDER_NAME_TAP } from './grips'
import WeatherColumn from './WeatherColumn.vue'

const provider = useGrip(WEATHER_PROVIDER_NAME)
const providerTap = useGrip(WEATHER_PROVIDER_NAME_TAP)

const weatherProvider = computed(() => provider.value ?? 'meteo')

function setProvider(next: 'meteo' | 'mock') {
  providerTap.value?.set(next)
}
</script>

<style scoped>
.provider-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 12px;
}
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.weather-provider-button {
  margin-left: 4px;
}
.weather-provider-button.selected {
  font-weight: bold;
  text-decoration: underline;
}
</style>

