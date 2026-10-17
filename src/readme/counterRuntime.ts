import {
  Grok,
  GripOf,
  GripRegistry,
  createAtomValueTap,
  type AtomTapHandle,
} from '@owebeeone/grip-core';
const registry = new GripRegistry();
const defineGrip = GripOf(registry);
export const COUNT = defineGrip<number>('Count', 0);
export const COUNT_TAP = defineGrip<AtomTapHandle<number>>('Count.Handle');
export function createCounterRuntime() {
  const grok = new Grok(registry);
  grok.registerTap(createAtomValueTap(COUNT, { initial: 0, handleGrip: COUNT_TAP }));
  return grok;
}
