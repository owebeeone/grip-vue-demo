import { expect, it, vi } from 'vitest';
import { Grok, createAtomValueTap, createFunctionTap, type Grip } from '@owebeeone/grip-core';
import { render, settle } from './helpers';
import ClockCounterPanel from '../src/ClockCounterPanel.vue';
import CalculatorPanel from '../src/CalculatorPanel.vue';
import WeatherPanel from '../src/WeatherPanel.vue';
import { registry } from '../src/runtime';
import {
  COUNT,
  COUNT_TAP,
  CURRENT_TIME,
  WEATHER_PROVIDER_NAME,
  WEATHER_PROVIDER_NAME_TAP,
} from '../src/grips';
import { WEATHER_LOCATION, WEATHER_TEMP_C, GEO_LABEL } from '../src/grips.weather';
import { CalculatorTap } from '../src/taps_calculator';

it('publishes valid counter input to an independent clock and derives description values without replacing the focused draft', async () => {
  const grok = new Grok(registry);
  grok.registerTap(createAtomValueTap(COUNT, { initial: 1, handleGrip: COUNT_TAP }));
  grok.registerTap(createAtomValueTap(CURRENT_TIME, { initial: new Date('2026-01-01T12:00:00Z') }));
  const view = render(ClockCounterPanel, grok);
  await settle(grok);
  expect(view.get('[aria-label="Clock"]').text()).toContain('Hidden');
  const count = view.get<HTMLInputElement>('input[aria-label="Count"]');
  await count.trigger('focus');
  await count.setValue('42');
  await settle(grok);
  expect(view.get('[aria-label="Clock"]').text()).toContain('Live');
  await count.setValue('-');
  await settle(grok);
  expect(view.get('[aria-label="Clock"]').text()).toContain('Live');
  await count.trigger('blur');
  await settle(grok);
  expect(count.element.value).toBe('42');
  const description = view.get<HTMLInputElement>('.description-example input');
  description.element.focus();
  description.element.value = 'a quick edit';
  description.element.setSelectionRange(7, 7);
  await description.trigger('input');
  await settle(grok);
  expect(description.element.value).toBe('a quick edit');
  expect(description.element.selectionStart).toBe(7);
  expect(view.get('[aria-label="Stored value"]').text()).toBe('A QUICK EDIT');
  expect(view.get('[aria-label="Computed slug"]').text()).toBe('a-quick-edit');
  expect(view.get('[aria-label="Text statistics"]').text()).toBe('3 words · 12 characters');
  await description.trigger('blur');
  await settle(grok);
  expect(description.element.value).toBe('A QUICK EDIT');
});

it('runs calculator actions through the published Core function grips', async () => {
  const grok = new Grok(registry);
  grok.registerTap(new CalculatorTap());
  const view = render(CalculatorPanel, grok);
  await settle(grok);
  for (const key of ['2', '+', '3', '=']) {
    await view
      .findAll('button')
      .find((button) => button.text() === key)!
      .trigger('click');
    await settle(grok);
  }
  expect(view.get('output').text()).toBe('5');
});

it('keeps weather scopes independent and retains cities through parent provider rerenders', async () => {
  const grok = new Grok(registry);
  grok.registerTap(
    createAtomValueTap(WEATHER_PROVIDER_NAME, {
      initial: 'mock',
      handleGrip: WEATHER_PROVIDER_NAME_TAP,
    }),
  );
  grok.registerTap(
    createFunctionTap({
      provides: [WEATHER_TEMP_C, GEO_LABEL],
      destinationParamGrips: [WEATHER_LOCATION],
      compute: ({ getDestParam }) => {
        const city = getDestParam(WEATHER_LOCATION);
        return new Map<Grip<any>, any>([
          [WEATHER_TEMP_C, city === 'Sydney' ? 20 : 12],
          [GEO_LABEL, city],
        ]);
      },
    }),
  );
  const view = render(WeatherPanel, grok);
  await settle(grok);
  expect(view.findAll('select').map((select) => select.element.value)).toEqual([
    'Sydney',
    'San Jose',
  ]);
  await view.findAll('select')[0].setValue('Paris');
  await settle(grok);
  await view
    .findAll('button')
    .find((button) => button.text() === 'Meteo')!
    .trigger('click');
  await settle(grok);
  expect(view.findAll('select').map((select) => select.element.value)).toEqual([
    'Paris',
    'San Jose',
  ]);
  expect(view.get('[aria-label="Location A"]').text()).toContain('Paris');
  expect(view.get('[aria-label="Location B"]').text()).toContain('San Jose');
});
