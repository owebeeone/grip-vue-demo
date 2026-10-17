# GRIP Vue demo

[Open the live demo on GitHub Pages](https://owebeeone.github.io/grip-vue-demo/)

Vue examples for published GRIP Core 0.3.0, matching the GRIP React demo's behavior with Vue components and composables.

## Run locally

The demo installs published GRIP Vue 0.3.0 and Core 0.3.x. No sibling checkout is required:

```sh
npm ci
npm run dev
```

For a production preview, run `npm run build` then `npm run preview`. The build includes the main demo, `/readme-counter.html`, and `/readme-weather.html`.

## Examples

- **Clock & Counter:** a shared integer controls a separate clock; incomplete edits stay in the focused input. The description editor publishes uppercase text while preserving the typed draft and caret. GRIP derives the slug and statistics.
- **Calculator:** buttons consume function grips from a calculator provider.
- **Weather:** independently scoped cities with a shared Meteo/Mock selector. The Meteo path uses Open-Meteo; the main demo's geocoder also uses the network. For a completely offline example, use the standalone README weather page.
- **Coins:** independent BTC and ETH columns; choose BTC, ETH, SOL or DOGE and MockCoin, Coinbase or Binance. MockCoin works offline. Live exchange availability depends on network and regional access. Binance uses USDT pairs for the USD display, matching the React example.
- **Inspection:** a resizable, live graph pane with fit/scroll and refresh; a JSON graph download; and syntax-highlighted source files for the selected example. Opening inspection does not remount the running demo. The source dialog closes with Escape.

Scope keys identify columns, not cities or products. Changing a selection updates its atom; it does not replace the scope. The display components consume state and mutation handles supplied by their enclosing scope.

## Small runnable examples

The counter is composed from `src/readme/counter.ts`, `src/readme/counterRuntime.ts`, and `src/readme/Counter.vue`:

<!-- source:src/readme/Counter.vue -->
```vue
<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { COUNT, COUNT_TAP } from './counterRuntime';
const count = useGrip(COUNT);
const handle = useGrip(COUNT_TAP);
</script>
<template>
  <main class="demo-content">
    <section class="demo-card">
      <h1>GRIP Vue counter</h1>
      <output aria-label="Count">{{ count }}</output>
      <button @click="handle?.update((value) => value + 1)">Increment</button>
    </section>
  </main>
</template>
```
<!-- /source -->

The weather page starts in `src/readme/weather.ts`. Its two columns share a provider selection while keeping their city atoms independent. Both providers are deterministic fixtures: Mock produces Sydney 20°C / Paris 12°C; Coordinates produces 22°C / 14°C by resolving the city → coordinates → temperature dependency chain without network requests.

<!-- source:src/readme/WeatherColumn.vue -->
```vue
<script setup lang="ts">
import { useGrip } from '@owebeeone/grip-vue';
import { LOCATION, LOCATION_TAP, TEMPERATURE, type City } from './grips';
defineProps<{ title: string }>();
const location = useGrip(LOCATION);
const handle = useGrip(LOCATION_TAP);
const temperature = useGrip(TEMPERATURE);
</script>
<template>
  <section class="demo-card" :aria-label="title">
    <h2>{{ title }}</h2>
    <label
      >City
      <select
        :value="location"
        @change="handle?.set(($event.target as HTMLSelectElement).value as City)"
      >
        <option>Sydney</option>
        <option>Paris</option>
      </select></label
    >
    <p>
      Temperature: <output>{{ temperature ?? '…' }}</output> °C
    </p>
  </section>
</template>
```
<!-- /source -->

## Validation

```sh
npm run check
```

This checks explicit control-flow boundaries, README excerpt alignment, integration tests against published Core and Vue adapter, TypeScript, and all three production entry points. Tests exercise caret preservation, independent scopes, stream provider switching/cancellation, calculator actions, graph updates and dump contents, source selection, and offline samples. Live exchange tests use an in-process WebSocket fixture; they do not require exchange access.

See `docs/parity.md` for scope, verification results and separate findings. No React or Core source changes are required.

## GitHub Pages

[Open the live demo](https://owebeeone.github.io/grip-vue-demo/) · [Counter](https://owebeeone.github.io/grip-vue-demo/readme-counter.html) · [Offline weather introduction](https://owebeeone.github.io/grip-vue-demo/readme-weather.html)

The Pages workflow installs locked, published dependencies, runs the tests, and
builds all three entry points under the repository's URL prefix. Pushes to
`main` deploy automatically; pull requests build and test without deploying.
Manual deployments are available through the workflow's **Run workflow** action.

To inspect the same output locally:

```sh
npm run build:pages
npm run preview -- --base=/grip-vue-demo/
```

Open `/grip-vue-demo/` on the preview server. Ordinary `npm run dev` and
`npm run build` keep the root URL for local development. GitHub Pages hosts the
static application; live weather and exchange data are requested directly by
the browser and depend on those services' availability. The offline README
weather example does not need external services.
