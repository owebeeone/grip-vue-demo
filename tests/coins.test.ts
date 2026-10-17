import { expect, it, vi } from 'vitest';
import { Grok } from '@owebeeone/grip-core';
import { render, settle } from './helpers';
import CoinPanel from '../src/CoinPanel.vue';
import { registry } from '../src/runtime';

class TestSocket extends EventTarget {
  static connections: TestSocket[] = [];
  send = vi.fn();
  close = vi.fn(() => this.dispatchEvent(new Event('close')));
  constructor(readonly url: string) {
    super();
    TestSocket.connections.push(this);
  }
  message(data: unknown) {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(data) }));
  }
}

it('streams independent products, switches live providers, and closes sockets when consumers unmount', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  TestSocket.connections = [];
  vi.stubGlobal('WebSocket', TestSocket);
  const grok = new Grok(registry);
  const runtimeTimers = vi.getTimerCount();
  const view = render(CoinPanel, grok);
  await settle(grok);
  const left = view.get('[aria-label="Market A"]');
  const right = view.get('[aria-label="Market B"]');
  expect(left.text()).toContain('streaming');
  expect(right.text()).toContain('streaming');
  expect(left.text()).toMatch(/\$6[45],/);
  expect(right.text()).toMatch(/\$3,/);
  await left.findAll('select')[1].setValue('SOL-USD');
  await settle(grok);
  expect(left.text()).toMatch(/\$1[45]\d\./);
  expect(right.findAll('select')[1].element.value).toBe('ETH-USD');
  await left.findAll('select')[0].setValue('coinbase');
  await settle(grok, 300);
  const coinbase = TestSocket.connections.at(-1)!;
  expect(coinbase.url).toContain('coinbase');
  coinbase.dispatchEvent(new Event('open'));
  expect(JSON.parse(coinbase.send.mock.calls[0][0]).product_ids).toEqual(['SOL-USD']);
  coinbase.message({ type: 'ticker', price: '155', last_size: '2', time: '2026-01-01T00:00:00Z' });
  await settle(grok);
  expect(left.text()).toContain('$155.00');
  expect(right.find('strong').text()).toBe('MockCoin');
  await left.findAll('select')[0].setValue('binance');
  await settle(grok, 300);
  expect(coinbase.close).toHaveBeenCalled();
  const binance = TestSocket.connections.at(-1)!;
  expect(binance.url).toContain('solusdt@ticker');
  binance.message({ c: '156', v: '42', E: Date.now() });
  await settle(grok);
  expect(left.text()).toContain('$156.00');
  view.unmount();
  await settle(grok, 300);
  expect(binance.close).toHaveBeenCalled();
  // Core keeps its own graph GC interval; consumer-owned stream timers are gone.
  expect(vi.getTimerCount()).toBe(runtimeTimers);
});

it('closes a failed socket before retrying instead of retaining an abandoned connection', async () => {
  vi.useFakeTimers();
  TestSocket.connections = [];
  vi.stubGlobal('WebSocket', TestSocket);
  const grok = new Grok(registry);
  const view = render(CoinPanel, grok);
  await settle(grok);
  await view.get('[aria-label="Market A"]').findAll('select')[0].setValue('coinbase');
  await settle(grok);
  const socket = TestSocket.connections.at(-1)!;
  socket.dispatchEvent(new Event('error'));
  await settle(grok);
  expect(socket.close).toHaveBeenCalled();
  await settle(grok, 2000);
  expect(TestSocket.connections.length).toBeGreaterThan(1);
});
