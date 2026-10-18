import { expect, it } from 'vitest';
import { Grok, createAtomValueTap } from '@owebeeone/grip-core';
import App from '../src/App.vue';
import { registry } from '../src/runtime';
import { CURRENT_TAB, CURRENT_TAB_TAP } from '../src/grips';
import { examples } from '../src/demoGuide';
import { render, settle } from './helpers';

it('starts at the overview, links the project, and guides navigation and source inspection', async () => {
  const grok = new Grok(registry);
  grok.registerTap(createAtomValueTap(CURRENT_TAB, { initial: CURRENT_TAB.defaultValue, handleGrip: CURRENT_TAB_TAP }));
  const view = render(App, grok);
  await settle(grok);
  expect(view.get('[aria-label="Overview"]').exists()).toBe(true);
  expect(view.get('a[href="https://github.com/owebeeone/grip-vue#readme"]').text()).toBe('Documentation & API guide');
  expect(view.get('a[href="https://github.com/owebeeone/grip-vue-demo"]').text()).toBe('Demo source');
  const button = (name: string) => view.findAll('button').find(button => button.text() === name)!;
  await button('View Code').trigger('click');
  expect(view.get('[aria-label="Example source"]').text()).toContain('Overview.vue');
  await button('Back to demo').trigger('click');
  for (const example of Object.values(examples)) {
    await button(`Explore ${example.title}`).trigger('click');
    await settle(grok);
    expect(view.get('[aria-label="About this example"]').text()).toContain(example.tryIt);
    expect(view.get('[aria-label="About this example"]').text()).toContain(example.notice);
    await button('Overview').trigger('click');
    await settle(grok);
  }
});
