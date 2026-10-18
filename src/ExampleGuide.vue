<script setup lang="ts">
import { computed } from 'vue';
import { examples, type ExampleTab } from './demoGuide';
const props = defineProps<{ tab: ExampleTab }>();
const guide = computed(() => examples[props.tab]);
</script>
<template>
  <section class="example-guide" aria-label="About this example">
    <h2>{{ guide.summary }}</h2>
    <p><strong>Try:</strong> {{ guide.tryIt }}</p>
    <p><strong>Notice:</strong> {{ guide.notice }}</p>
  </section>
</template>
