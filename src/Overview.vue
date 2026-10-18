<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { CURRENT_TAB_TAP } from './grips';
import { examples } from './demoGuide';
const tab = useGrip(CURRENT_TAB_TAP);
</script>
<template>
  <section class="demo-overview" aria-label="Overview">
    <h1>Explore reactive data flow with GRIP</h1>
    <p>GRIP connects requested values to the providers that supply them. These Vue examples show how shared state, derived values, asynchronous requests, and streams fit into a context graph.</p>
    <nav class="project-links" aria-label="Project resources">
      <a href="https://github.com/owebeeone/grip-vue">GRIP Vue project</a>
      <a href="https://github.com/owebeeone/grip-vue#readme">Documentation &amp; API guide</a>
      <a href="https://github.com/owebeeone/grip-vue-demo">Demo source</a>
      <a href="https://github.com/owebeeone/grip-core">GRIP Core</a>
    </nav>
    <div class="overview-examples">
      <article v-for="(guide, key) in examples" :key="key" class="overview-example">
        <h2>{{ guide.title }}</h2><p>{{ guide.summary }}</p>
        <p><strong>Try:</strong> {{ guide.tryIt }}</p>
        <p><strong>Notice:</strong> {{ guide.notice }}</p>
        <button @click="tab?.set(key)">Explore {{ guide.title }}</button>
      </article>
    </div>
    <section class="inspection-guide" aria-label="Inspection tools">
      <h2>Follow the data as you experiment</h2>
      <p><strong>Show Graph</strong> displays contexts, providers, and current consumer values beside the running example. <strong>View Code</strong> shows the actual source for the selected page. <strong>Graph Dump</strong> captures a JSON snapshot for closer inspection.</p>
      <p>Open an example, change a value, and compare the result with its graph. Changed values briefly highlight in blue with a gold edge; reduced-motion settings use a static highlight. Opening inspection tools preserves the running example and your edits.</p>
    </section>
  </section>
</template>
