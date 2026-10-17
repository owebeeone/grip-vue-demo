import { expect, it, vi } from 'vitest';
import { render, settle } from './helpers';
import WeatherApp from '../src/readme/WeatherApp.vue';
import Counter from '../src/readme/Counter.vue';
import { createWeatherRuntime } from '../src/readme/runtime';
import { createCounterRuntime } from '../src/readme/counterRuntime';

it('runs the standalone counter from its own runtime', async () => {
  const grok = createCounterRuntime();
  const view = render(Counter, grok);
  await settle(grok);
  await view.get('button').trigger('click');
  await settle(grok);
  expect(view.get('output').text()).toBe('1');
});

it('resolves the weather fixture dependency chain and preserves independent city selections when switching providers', async () => {
  vi.useFakeTimers();
  const fetch = vi.fn(() => {
    throw new Error('README samples must be offline');
  });
  vi.stubGlobal('fetch', fetch);
  const grok = createWeatherRuntime();
  const view = render(WeatherApp, grok);
  await settle(grok);
  expect(view.findAll('output').map((output) => output.text())).toEqual(['20', '12']);
  await view.findAll('select')[0].setValue('coordinates');
  await settle(grok);
  expect(view.findAll('output').map((output) => output.text())).toEqual(['22', '14']);
  await view.findAll('select')[1].setValue('Paris');
  await settle(grok);
  await view.findAll('select')[0].setValue('mock');
  await settle(grok);
  expect(view.findAll('output').map((output) => output.text())).toEqual(['12', '12']);
  expect(fetch).not.toHaveBeenCalled();
});
