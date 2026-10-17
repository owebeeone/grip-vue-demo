import { createApp } from 'vue';
import { createGripPlugin } from '@owebeeone/grip-vue';
import Counter from './Counter.vue';
import { createCounterRuntime } from './counterRuntime';
import '../index.css';
createApp(Counter)
  .use(createGripPlugin({ grok: createCounterRuntime() }))
  .mount('#app');
