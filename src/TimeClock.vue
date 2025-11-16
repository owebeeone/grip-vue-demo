<template>
  <div>Time: {{ timeString }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGrip } from '@owebeeone/grip-vue'
import { CURRENT_TIME } from './grips'

const now = useGrip(CURRENT_TIME) as any

const timeString = computed(() => {
  const d = now.value as Date | undefined
  return d ? d.toLocaleTimeString() : '…'
})
</script>

