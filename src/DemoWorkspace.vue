<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { GripGraphVisualizer, GraphDumpButton, useGrip, useGripRuntime } from '@owebeeone/grip-vue';
import { CURRENT_TAB } from './grips';
import ExampleSource from './ExampleSource.vue';
const { grok } = useGripRuntime();
const tab = useGrip(CURRENT_TAB);
const mode = ref<'graph' | 'code' | null>(null);
const fit = ref(true);
const refresh = ref(0);
const split = ref(45);
const panels = ref<HTMLElement>();
const back = ref<HTMLButtonElement>();
const sourceButton = ref<HTMLButtonElement>();
watch(mode, async (next) => {
  if (next === 'code') {
    await nextTick();
    back.value?.focus();
  }
});
async function closeSource() {
  mode.value = null;
  await nextTick();
  sourceButton.value?.focus();
}
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') {
    return;
  }
  const dialog = event.currentTarget as HTMLElement;
  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>('button, select, input, [tabindex="0"]'),
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
function resize(event: PointerEvent) {
  const rect = panels.value?.getBoundingClientRect();
  if (rect) {
    split.value = Math.max(25, Math.min(75, ((event.clientX - rect.left) / rect.width) * 100));
  }
}
function stopResize() {
  window.removeEventListener('pointermove', resize);
  window.removeEventListener('pointerup', stopResize);
}
function startResize(event: PointerEvent) {
  event.preventDefault();
  window.addEventListener('pointermove', resize);
  window.addEventListener('pointerup', stopResize);
}
function resizeKey(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    split.value = Math.max(25, Math.min(75, split.value + (event.key === 'ArrowRight' ? 5 : -5)));
  }
}
onUnmounted(stopResize);
</script>
<template>
  <div class="demo-workspace">
    <div ref="panels" class="workspace-panels" :inert="mode === 'code'">
      <div class="demo-running-example" :style="{ width: mode === 'graph' ? `${split}%` : '100%' }">
        <slot />
      </div>
      <template v-if="mode === 'graph'">
        <div
          class="workspace-divider"
          role="separator"
          aria-label="Resize graph pane"
          aria-orientation="vertical"
          :aria-valuenow="split"
          :aria-valuemin="25"
          :aria-valuemax="75"
          tabindex="0"
          @pointerdown="startResize"
          @keydown="resizeKey"
        />
        <section class="graph-pane" aria-label="Context graph">
          <header class="inspector-toolbar">
            <strong>Live graph</strong
            ><label><input v-model="fit" type="checkbox" /> Fit graph</label
            ><button @click="refresh++">Refresh</button>
          </header>
          <GripGraphVisualizer :grok="grok" :fit-to-pane="fit" :refresh-trigger="refresh" />
        </section>
      </template>
    </div>
    <footer class="demo-tools" :inert="mode === 'code'">
      <button @click="mode = mode === 'graph' ? null : 'graph'">
        {{ mode === 'graph' ? 'Hide Graph' : 'Show Graph' }}</button
      ><button ref="sourceButton" @click="mode = 'code'">View Code</button
      ><GraphDumpButton :grok="grok" />
    </footer>
    <section
      v-if="mode === 'code'"
      class="demo-inspector"
      role="dialog"
      aria-modal="true"
      aria-label="Example source"
      @keydown.esc="closeSource"
      @keydown="trapFocus"
    >
      <header class="inspector-toolbar">
        <strong>Example source</strong><button ref="back" @click="closeSource">Back to demo</button>
      </header>
      <ExampleSource :tab="tab ?? 'overview'" />
    </section>
  </div>
</template>
