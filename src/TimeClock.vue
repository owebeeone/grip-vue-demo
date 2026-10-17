<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { CURRENT_TIME } from './grips';
const now = useGrip(CURRENT_TIME);
</script>
<template>
  <time>{{ now?.toLocaleTimeString() ?? '…' }}</time>
</template>
