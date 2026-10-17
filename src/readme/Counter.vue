<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { COUNT, COUNT_TAP } from './counterRuntime';
const count = useGrip(COUNT);
const handle = useGrip(COUNT_TAP);
</script>
<template>
  <main class="demo-content">
    <section class="demo-card">
      <h1>GRIP Vue counter</h1>
      <output aria-label="Count">{{ count }}</output>
      <button @click="handle?.update((value) => value + 1)">Increment</button>
    </section>
  </main>
</template>
