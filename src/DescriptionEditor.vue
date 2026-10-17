<script setup lang="ts">
import { GripInput, useGrip } from '@owebeeone/grip-vue';
import { DESCRIPTION, DESCRIPTION_TAP, DESCRIPTION_SLUG, DESCRIPTION_STATS } from './grips';
const stored = useGrip(DESCRIPTION);
const slug = useGrip(DESCRIPTION_SLUG);
const statistics = useGrip(DESCRIPTION_STATS);
</script>
<template>
  <section class="demo-card description-example" aria-label="Text and derived values">
    <h3>Text &amp; derived values</h3>
    <label
      >Description
      <GripInput
        :grip="DESCRIPTION"
        :tap-grip="DESCRIPTION_TAP"
        :parse="(text: string) => text.toUpperCase()"
        autocomplete="off"
        :spellcheck="false"
    /></label>
    <p class="card-caption">Edit anywhere. The caret stays put.</p>
    <dl>
      <dt>Stored value</dt>
      <dd>
        <output aria-label="Stored value">{{ stored || '—' }}</output>
      </dd>
      <dt>Computed slug</dt>
      <dd>
        <output aria-label="Computed slug">{{ slug || '—' }}</output>
      </dd>
      <dt>Text statistics</dt>
      <dd>
        <output aria-label="Text statistics">{{ statistics }}</output>
      </dd>
    </dl>
  </section>
</template>
