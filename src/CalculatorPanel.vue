<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import {
  CALC_DISPLAY,
  CALC_DIGIT_PRESSED,
  CALC_ADD_PRESSED,
  CALC_SUB_PRESSED,
  CALC_MUL_PRESSED,
  CALC_DIV_PRESSED,
  CALC_EQUALS_PRESSED,
  CALC_CLEAR_PRESSED,
} from './grips';
const display = useGrip(CALC_DISPLAY);
const digit = useGrip(CALC_DIGIT_PRESSED);
const add = useGrip(CALC_ADD_PRESSED);
const sub = useGrip(CALC_SUB_PRESSED);
const mul = useGrip(CALC_MUL_PRESSED);
const div = useGrip(CALC_DIV_PRESSED);
const equals = useGrip(CALC_EQUALS_PRESSED);
const clear = useGrip(CALC_CLEAR_PRESSED);
</script>
<template>
  <section class="demo-card calculator" aria-label="Calculator">
    <output class="calc-display" aria-label="Result">{{ display ?? '0' }}</output>
    <div class="calc-grid">
      <button v-for="n in [7, 8, 9]" :key="n" @click="digit?.(n)">{{ n }}</button
      ><button @click="div?.()">/</button>
      <button v-for="n in [4, 5, 6]" :key="n" @click="digit?.(n)">{{ n }}</button
      ><button @click="mul?.()">*</button>
      <button v-for="n in [1, 2, 3]" :key="n" @click="digit?.(n)">{{ n }}</button
      ><button @click="sub?.()">−</button> <button @click="digit?.(0)">0</button
      ><button @click="clear?.()">C</button><button @click="equals?.()">=</button
      ><button @click="add?.()">+</button>
    </div>
  </section>
</template>
