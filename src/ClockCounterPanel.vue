<script setup lang="ts">
import { GripInput, GripScope, useGrip } from '@owebeeone/grip-vue';
import { COUNT, COUNT_TAP } from './grips';
import ClockCard from './ClockCard.vue';
import DescriptionEditor from './DescriptionEditor.vue';
import { initDescriptionEditor } from './descriptionScope';
const handle = useGrip(COUNT_TAP);
function parseCount(text: string): number | undefined {
  if (!/^-?\d+$/.test(text)) {
    return undefined;
  }
  const value = Number(text);
  return Number.isSafeInteger(value) ? value : undefined;
}
</script>
<template>
  <div class="clock-counter-panel">
    <div class="example-columns">
      <section class="demo-card" aria-label="Counter">
        <h3>Counter</h3>
        <div class="counter-controls">
          <button aria-label="Decrement count" @click="handle?.update((value) => value - 1)">
            −
          </button>
          <GripInput
            class="counter-value"
            aria-label="Count"
            :grip="COUNT"
            :tap-grip="COUNT_TAP"
            :parse="parseCount"
            inputmode="numeric"
            autocomplete="off"
            :spellcheck="false"
          />
          <button aria-label="Increment count" @click="handle?.update((value) => value + 1)">
            +
          </button>
        </div>
        <p class="card-caption">Shared through GRIP</p>
      </section>
      <ClockCard />
    </div>
    <GripScope scope-key="description-editor" :init="initDescriptionEditor"
      ><DescriptionEditor
    /></GripScope>
  </div>
</template>
