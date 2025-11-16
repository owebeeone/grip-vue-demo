<template>
  <div class="tab-bar">
    <button @click="setTab('clock')" :disabled="tab === 'clock'">Clock &amp; Counter</button>
    <button @click="setTab('calc')" :disabled="tab === 'calc'">Calculator</button>
    <button @click="setTab('weather')" :disabled="tab === 'weather'">Weather</button>
  </div>
</template>

<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue'
import { CURRENT_TAB, CURRENT_TAB_TAP } from './grips'

const tab = useGrip(CURRENT_TAB) as any
const tabTap = useGrip(CURRENT_TAB_TAP)

function setTab(next: 'clock' | 'calc' | 'weather') {
  tabTap.value?.set(next)
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
</style>

