import { defineComponent, h } from 'vue';
import { beforeEach, expect, it, vi } from 'vitest';
import { Grok, createAtomValueTap } from '@owebeeone/grip-core';
import { render, settle } from './helpers';
import DemoWorkspace from '../src/DemoWorkspace.vue';
import ClockCounterPanel from '../src/ClockCounterPanel.vue';
import { COUNT, COUNT_TAP, CURRENT_TAB, CURRENT_TAB_TAP } from '../src/grips';
import { registry } from '../src/runtime';
import coinSource from '../src/CoinColumn.vue?raw';

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true; } });
});

it('keeps the running demo mounted while the graph updates, resizes, refreshes, and switches to source inspection', async () => {
  vi.useFakeTimers();
  const grok = new Grok(registry);
  grok.registerTap(createAtomValueTap(CURRENT_TAB, { initial: 'clock', handleGrip: CURRENT_TAB_TAP }));
  grok.registerTap(createAtomValueTap(COUNT, { initial: 1, handleGrip: COUNT_TAP }));
  const view = render(
    defineComponent({ setup: () => () => h(DemoWorkspace, null, () => h(ClockCounterPanel)) }),
    grok,
  );
  await settle(grok);
  const count = view.get<HTMLInputElement>('input[aria-label="Count"]');
  const element = count.element;
  const button = (label: string) =>
    view.findAll('button').find((button) => button.text() === label)!;
  await button('Show Graph').trigger('click');
  await count.setValue('42');
  await settle(grok, 750);
  const graph = view.get('[aria-label="Context graph"]');
  expect(graph.text()).toContain('42');
  expect(graph.findAll('.graph-card').length).toBeGreaterThan(1);
  await graph.get('input[type="checkbox"]').setValue(false);
  expect(graph.get('svg').attributes('width')).not.toBe('100%');
  await view.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' });
  expect(view.get('[role="separator"]').attributes('aria-valuenow')).toBe('50');
  await count.setValue('43');
  await settle(grok, 0);
  await button('Refresh').trigger('click');
  expect(graph.text()).toContain('43');
  await button('Hide Graph').trigger('click');
  await button('View Code').trigger('click');
  const dialog = view.get('[role="dialog"]');
  expect(dialog.text()).toContain('initDescriptionEditor');
  expect(dialog.text()).toContain('GripInput');
  expect(document.activeElement).toBe(button('Back to demo').element);
  await dialog.trigger('keydown', { key: 'Escape' });
  expect(view.find('[role="dialog"]').exists()).toBe(false);
  expect(view.get('input[aria-label="Count"]').element).toBe(element);
  expect(element.value).toBe('43');
  expect(document.activeElement).toBe(button('View Code').element);
});

it('displays actual files for the selected tab and downloads a current graph snapshot', async () => {
  const grok = new Grok(registry);
  grok.registerTap(
    createAtomValueTap(CURRENT_TAB, { initial: 'coins', handleGrip: CURRENT_TAB_TAP }),
  );
  const view = render(DemoWorkspace, grok, { slots: { default: '<p>Running example</p>' } });
  await settle(grok);
  const button = (label: string) =>
    view.findAll('button').find((button) => button.text() === label)!;
  await button('View Code').trigger('click');
  expect(view.get('[aria-label="CoinColumn.vue source code"]').text()).toBe(coinSource.trim());
  await view.get('[aria-label="Scope & providers source file"]').setValue(2);
  expect(view.get('[aria-label="cointaps.ts source code"]').text()).toContain(
    'createAsyncStreamMultiTap',
  );
  await button('Back to demo').trigger('click');
  const blobs: Blob[] = [];
  const createObjectURL = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return 'blob:test';
  });
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = createObjectURL;
      static revokeObjectURL = vi.fn();
    },
  );
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  await button('Graph Dump').trigger('click');
  document.querySelector<HTMLButtonElement>('dialog footer button:nth-child(2)')!.click();
  expect(click).toHaveBeenCalledOnce();
  const text = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsText(blobs[0]);
  });
  const dump = JSON.parse(text);
  expect(dump.summary.contextCount).toBeGreaterThan(0);
  expect(dump.nodes.drips.some((drip: { value: unknown }) => drip.value === 'coins')).toBe(true);
});
