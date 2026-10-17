import { createApp } from 'vue';
import { createGripPlugin } from '@owebeeone/grip-vue';
import WeatherApp from './WeatherApp.vue';
import { createWeatherRuntime } from './runtime';
import '../index.css';
createApp(WeatherApp)
  .use(createGripPlugin({ grok: createWeatherRuntime() }))
  .mount('#app');
