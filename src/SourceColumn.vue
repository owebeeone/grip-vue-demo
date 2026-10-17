<script setup lang="ts">
import { computed, ref } from 'vue';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
const props = defineProps<{ title: string; files: { name: string; text: string }[] }>();
const index = ref(0);
const source = computed(() => props.files[index.value] ?? props.files[0]);
// Prism escapes source text before producing markup; no source is executed.
const highlighted = computed(() =>
  Prism.highlight(
    source.value.text,
    source.value.name.endsWith('.vue') ? Prism.languages.markup : Prism.languages.typescript,
    source.value.name.endsWith('.vue') ? 'markup' : 'typescript',
  ),
);
</script>
<template>
  <section class="source-column">
    <label
      >{{ title }}
      <select v-model="index" :aria-label="`${title} source file`">
        <option v-for="(file, position) in files" :key="file.name" :value="position">
          {{ file.name }}
        </option>
      </select></label
    >
    <pre :aria-label="`${source.name} source code`"><code v-html="highlighted" /></pre>
  </section>
</template>
