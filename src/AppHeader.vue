<template>
  <div class="app-header">
    <h3 class="title">GRIP Vue Demo</h3>
    <div class="subtitle">
      Sydney temp: <strong>{{ tempSydneyDisplay }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { createAtomValueTap, type Tap } from '@owebeeone/grip-core'
import { useGripRuntime, useGrip, useTap } from '@owebeeone/grip-vue'
import { WEATHER_LOCATION, WEATHER_TEMP_C } from './grips.weather'

const { context: parentCtx } = useGripRuntime()
const headerCtx = parentCtx.getGripConsumerContext().createChild('header-weather')

useTap(
  () => createAtomValueTap(WEATHER_LOCATION, { initial: 'Sydney' }) as unknown as Tap,
  { ctx: headerCtx }
)

const tempSydney = useGrip(WEATHER_TEMP_C, headerCtx)
const tempSydneyDisplay = computed(() => {
  const v = tempSydney.value
  return typeof v === 'number' ? v.toFixed(1) + ' °C' : '…'
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}
.title {
  margin: 0;
}
.subtitle {
  color: #555;
  font-size: 0.9rem;
}
</style>
