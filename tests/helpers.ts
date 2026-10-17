import { nextTick } from 'vue';
import { mount, type ComponentMountingOptions, type VueWrapper } from '@vue/test-utils';
import { afterEach, vi } from 'vitest';
import type { Component } from 'vue';
import type { Grok } from '@owebeeone/grip-core';
import { createGripPlugin } from '@owebeeone/grip-vue';
const views: VueWrapper[] = [];
export function render(
  component: Component,
  grok: Grok,
  options: ComponentMountingOptions<any> = {},
) {
  const view = mount(component, {
    ...options,
    attachTo: document.body,
    global: { ...options.global, plugins: [createGripPlugin({ grok })] },
  });
  views.push(view);
  return view;
}
export async function settle(grok: Grok, ms = 10) {
  grok.flush();
  if (vi.isFakeTimers()) {
    await vi.advanceTimersByTimeAsync(ms);
  } else {
    await Promise.resolve();
  }
  grok.flush();
  await nextTick();
}
afterEach(async () => {
  for (const view of views.splice(0)) {
    view.unmount();
  }
  if (vi.isFakeTimers()) {
    await vi.advanceTimersByTimeAsync(300);
  }
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});
