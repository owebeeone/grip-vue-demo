import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createGripPlugin } from '@owebeeone/grip-vue'
import { grok, main } from './runtime'
import { registerAllTaps } from './taps'

registerAllTaps()

const app = createApp(App)
app.use(createGripPlugin({ grok, context: main }))
app.mount('#app')

