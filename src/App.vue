<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { CURRENT_TAB } from './grips';
import AppHeader from './AppHeader.vue';
import TabBar from './TabBar.vue';
import ClockCounterPanel from './ClockCounterPanel.vue';
import CalculatorPanel from './CalculatorPanel.vue';
import WeatherPanel from './WeatherPanel.vue';
import CoinPanel from './CoinPanel.vue';
import Overview from './Overview.vue';
import ExampleGuide from './ExampleGuide.vue';
import DemoWorkspace from './DemoWorkspace.vue';
const tab = useGrip(CURRENT_TAB);
</script>
<template>
  <DemoWorkspace>
    <main class="demo-content">
      <AppHeader />
      <TabBar />
      <Overview v-if="tab === 'overview'" />
      <ExampleGuide v-if="tab && tab !== 'overview'" :tab="tab" />
      <ClockCounterPanel v-if="tab === 'clock'" />
      <CalculatorPanel v-else-if="tab === 'calc'" />
      <WeatherPanel v-else-if="tab === 'weather'" />
      <CoinPanel v-else-if="tab === 'coins'" />
    </main>
  </DemoWorkspace>
</template>
