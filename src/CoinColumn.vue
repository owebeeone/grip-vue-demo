<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import {
  COIN_SOURCE,
  COIN_SOURCE_TAP,
  COIN_PRODUCT,
  COIN_PRODUCT_TAP,
  COIN_PRICE_USD,
  COIN_VOLUME,
  COIN_EXCHANGE,
  COIN_STATUS,
  COIN_UPDATED_AT,
  type CoinSource,
} from './grips.coin';
defineProps<{ title: string }>();
const source = useGrip(COIN_SOURCE);
const sourceTap = useGrip(COIN_SOURCE_TAP);
const product = useGrip(COIN_PRODUCT);
const productTap = useGrip(COIN_PRODUCT_TAP);
const price = useGrip(COIN_PRICE_USD);
const volume = useGrip(COIN_VOLUME);
const exchange = useGrip(COIN_EXCHANGE);
const status = useGrip(COIN_STATUS);
const updated = useGrip(COIN_UPDATED_AT);
const products = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'DOGE-USD'];
function formatPrice(value: number | undefined) {
  if (value == null) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value);
}
</script>
<template>
  <section class="demo-card" :aria-label="title">
    <h3>{{ title }}</h3>
    <div class="market-controls">
      <label
        >Source
        <select
          :value="source"
          @change="sourceTap?.set(($event.target as HTMLSelectElement).value as CoinSource)"
        >
          <option value="mock">MockCoin</option>
          <option value="coinbase">Coinbase</option>
          <option value="binance">Binance</option>
        </select></label
      >
      <label
        >Product
        <select
          :value="product"
          @change="productTap?.set(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="item in products" :key="item">{{ item }}</option>
        </select></label
      >
    </div>
    <p class="card-caption">
      Feed: <strong>{{ exchange || '—' }}</strong>
    </p>
    <dl>
      <dt>Price</dt>
      <dd>{{ formatPrice(price) }}</dd>
      <dt>Volume</dt>
      <dd>{{ volume?.toLocaleString('en-US', { maximumFractionDigits: 2 }) ?? '—' }}</dd>
      <dt>Status</dt>
      <dd>{{ status ?? 'idle' }}</dd>
      <dt>Updated</dt>
      <dd>{{ updated?.toLocaleTimeString() ?? '—' }}</dd>
    </dl>
  </section>
</template>
