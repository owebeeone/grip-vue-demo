# grip-vue-demo

A Vue 3 + TypeScript demo application showcasing GRIP (Generalized Retrieval Intent Provisioning) using `@owebeeone/grip-vue`.

This is a port of `grip-react-demo` that demonstrates reactive data flows, async state management, and context-aware data resolution through Vue's Composition API. It includes examples of atom taps, function taps, and async taps with real-world use cases.

## Features

- **Calculator** - Demonstrates function taps with state management
- **Weather Integration** - Shows async taps with OpenMeteo API integration
- **Time Clock** - Simple atom tap example
- **Context Scoping** - Demonstrates hierarchical context resolution

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

### Setup

The demo initializes GRIP in `src/main.ts`:

```ts
import { createGripPlugin } from '@owebeeone/grip-vue'
import { grok, main } from './runtime'
import { registerAllTaps } from './taps'

// Register all taps before mounting the app
registerAllTaps()

const app = createApp(App)
app.use(createGripPlugin({ grok, context: main }))
app.mount('#app')
```

The runtime (`src/runtime.ts`) creates the GRIP registry and Grok instance:

```ts
import { GripRegistry, GripOf, Grok } from '@owebeeone/grip-core'

export const registry = new GripRegistry()
export const defineGrip = GripOf(registry)
export const grok = new Grok(registry)
export const main = grok.mainContext
```

### Using Grips in Components

Components use the `useGrip` composable to subscribe to data:

```vue
<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue'
import { COUNT, CALC_DISPLAY } from './grips'

// Reactive refs that update when Grips change
const count = useGrip(COUNT)
const calcDisplay = useGrip(CALC_DISPLAY)
</script>

<template>
  <div>Count: {{ count ?? 0 }}</div>
  <div>Display: {{ calcDisplay ?? '0' }}</div>
</template>
```

### Registering Taps

Taps are registered using the `useTap` composable:

```vue
<script setup lang="ts">
import { useTap } from '@owebeeone/grip-vue'
import { createAtomValueTap } from '@owebeeone/grip-core'
import { COUNT } from './grips'

// Register a tap that provides COUNT
useTap(() => createAtomValueTap(COUNT, { initial: 0 }))
</script>
```

### Async Data with useGripQuery

For async taps with loading/error states:

```vue
<script setup lang="ts">
import { useGripQuery } from '@owebeeone/grip-vue'
import { USER_DATA, USER_DATA_STATE, USER_DATA_CONTROLLER } from './grips'

const { data, loading, error, refetch } = useGripQuery(USER_DATA, {
  stateGrip: USER_DATA_STATE,
  controllerGrip: USER_DATA_CONTROLLER
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>{{ data }}</div>
  <button @click="refetch()">Refresh</button>
</template>
```

## Project Structure

- `src/grips.ts` - Grip definitions
- `src/grips.weather.ts` - Weather-specific Grips
- `src/taps.ts` - Tap implementations
- `src/taps_calculator.ts` - Calculator function taps
- `src/openmeteo_taps.ts` - Async weather data taps
- `src/runtime.ts` - GRIP runtime setup (registry, Grok, main context)
- `src/main.ts` - Application entry point (plugin setup)
- `src/App.vue` - Main application component

## Key Concepts Demonstrated

### Atom Taps
Simple state containers for local values. The demo uses atom taps for:
- Counter value
- Current tab selection
- Calculator display

### Function Taps
Derived/computed values that transform inputs. The calculator uses function taps to:
- Process digit presses
- Perform arithmetic operations
- Manage calculator state

### Async Taps
Asynchronous data fetching with caching and state management. The weather integration demonstrates:
- Geocoding API calls (location → coordinates)
- Weather API calls (coordinates → weather data)
- Dependency chaining (weather tap depends on geo tap)
- Automatic undefined propagation when dependencies aren't ready

### Context Hierarchy
Demonstrates how data resolution works through the context graph, with closer providers taking precedence.

## Example: Weather Integration

The weather feature shows a complete async tap workflow:

1. **Location Input** → User selects a location
2. **Geocoding Tap** → Converts location string to coordinates
3. **Weather Tap** → Fetches weather data using coordinates
4. **Automatic Propagation** → When geocoding fails or is loading, weather tap automatically outputs `undefined`

This demonstrates the default behavior where async taps output `undefined` when dependencies aren't ready, ensuring proper loading states throughout the dependency chain.

## Related Packages

- **`@owebeeone/grip-core`** - Framework-agnostic GRIP engine
- **`@owebeeone/grip-vue`** - Vue composables and components for GRIP
- **`grip-react-demo`** - React version of this demo

## License

MIT
