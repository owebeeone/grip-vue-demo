<template>
  <div class="app-root">
    <div class="app-main">
      <div class="app-inner">
        <AppHeader />
        <TabBar />

        <div v-if="tab === 'clock'">
          <div v-if="!isCountOdd">
            <TimeClock />
          </div>
          <div v-else class="clock-blocked">
            Count is odd - no time
          </div>
          <div class="counter-row">
            <button @click="decCount">-</button>
            <div>Count: {{ countDisplay }}</div>
            <button @click="incCount">+</button>
          </div>
          <div>Description: {{ desc ?? '' }}</div>
        </div>

        <div v-else-if="tab === 'calc'">
          <div class="calc-display">
            {{ calcDisplay ?? '0' }}
          </div>
          <div class="calc-grid">
            <button v-for="n in [7,8,9]" :key="'d'+n" @click="() => digit(n)">{{ n }}</button>
            <button @click="div">/</button>
            <button v-for="n in [4,5,6]" :key="'d'+n" @click="() => digit(n)">{{ n }}</button>
            <button @click="mul">*</button>
            <button v-for="n in [1,2,3]" :key="'d'+n" @click="() => digit(n)">{{ n }}</button>
            <button @click="sub">-</button>
            <button @click="() => digit(0)">0</button>
            <button @click="clearCalc">C</button>
            <button @click="equals">=</button>
            <button @click="add">+</button>
          </div>
        </div>

        <WeatherPanel v-else-if="tab === 'weather'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGrip } from '@owebeeone/grip-vue'
import AppHeader from './AppHeader.vue'
import TabBar from './TabBar.vue'
import TimeClock from './TimeClock.vue'
import WeatherPanel from './WeatherPanel.vue'
import {
  DESCRIPTION,
  COUNT,
  COUNT_TAP,
  CALC_DISPLAY,
  CURRENT_TAB,
  CALC_DIGIT_PRESSED,
  CALC_ADD_PRESSED,
  CALC_SUB_PRESSED,
  CALC_MUL_PRESSED,
  CALC_DIV_PRESSED,
  CALC_EQUALS_PRESSED,
  CALC_CLEAR_PRESSED
} from './grips'

const count = useGrip(COUNT)
const countTap = useGrip(COUNT_TAP)
const desc = useGrip(DESCRIPTION)

const calcDisplay = useGrip(CALC_DISPLAY)
const tab = useGrip(CURRENT_TAB)

const calcDigitPressed = useGrip(CALC_DIGIT_PRESSED)
const calcAddPressed = useGrip(CALC_ADD_PRESSED)
const calcSubPressed = useGrip(CALC_SUB_PRESSED)
const calcMulPressed = useGrip(CALC_MUL_PRESSED)
const calcDivPressed = useGrip(CALC_DIV_PRESSED)
const calcEqualsPressed = useGrip(CALC_EQUALS_PRESSED)
const calcClearPressed = useGrip(CALC_CLEAR_PRESSED)

onMounted(() => {
  if (countTap.value) {
    countTap.value.set(1)
  }
})

const countDisplay = computed(() => count.value ?? 0)
const isCountOdd = computed(() => Boolean((countDisplay.value as number) & 1))

function incCount() {
  countTap.value?.update((c: number | undefined) => (c === undefined ? 1 : c + 1))
}

function decCount() {
  countTap.value?.update((c: number | undefined) => (c === undefined ? 0 : c - 1))
}

function digit(n: number) {
  calcDigitPressed.value?.(n)
}
function add() { calcAddPressed.value?.() }
function sub() { calcSubPressed.value?.() }
function mul() { calcMulPressed.value?.() }
function div() { calcDivPressed.value?.() }
function equals() { calcEqualsPressed.value?.() }
function clearCalc() { calcClearPressed.value?.() }
</script>

<style scoped>
.app-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.app-main {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
  min-width: 0;
}
.app-inner {
  padding: 16px;
  width: 100%;
}
.counter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.calc-display {
  font-family: monospace;
  font-size: 20px;
  padding: 8px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
}
.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 48px);
  gap: 8px;
}
.clock-blocked {
  padding: 8px 12px;
  border: 1px dashed #d33;
  border-radius: 6px;
  margin-bottom: 8px;
  color: #b00;
  background: #fff5f5;
}
</style>
