<script setup lang="ts">
import { GripScope } from '@owebeeone/grip-vue';
import CoinColumn from './CoinColumn.vue';
import { initCoinColumn } from './coinScope';
</script>
<template>
  <div class="example-columns">
    <GripScope scope-key="coin-column:left" :init="(ctx) => initCoinColumn(ctx, 'BTC-USD')"
      ><CoinColumn title="Market A"
    /></GripScope>
    <GripScope scope-key="coin-column:right" :init="(ctx) => initCoinColumn(ctx, 'ETH-USD')"
      ><CoinColumn title="Market B"
    /></GripScope>
  </div>
</template>
