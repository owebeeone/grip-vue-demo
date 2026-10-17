# Vue demo parity task

Scope: local changes to `grip-vue` and `grip-vue-demo`. The React demo and adapter are reference-only; Core is consumed from its published 0.3.0 release. The user subsequently authorized a Gearu adapter release and inclusion of the reusable graph and dump tools; demo changes remain local. No workspace membership changes.

Deliverables:
- Keyed scopes and buffered text/number inputs in the Vue adapter, with lifecycle coverage.
- Clock/counter, derived description editor, calculator, independent weather and coin columns with the same behavior as the React examples.
- Live graph with fit/scroll, resizing and refresh, graph JSON download, and actual source code inspection without remounting the demo.
- Runnable counter and deterministic weather README examples.
- Integration tests, builds, source checks and browser verification.

Reference: React demo commit `1cbd5726e9c7914f6b8aac9a7b419662e64b7a28`. Shared provider logic is adapted into this repository, not imported from the React adapter.

## Verification

- Adapter: nine tests covering scope reuse/replacement, sibling isolation, caret preservation, invalid input, blur-only updates, IME, and lifecycle cleanup.
- Demo: nine integration tests covering examples, coin streams with controlled sockets/time, retries and cancellation, graph/source workspace retention, graph dump content and standalone examples. Graph layout and inspector lifecycle coverage now live in the adapter.
- Production build emits all three HTML entry points. Adapter emits ESM, CommonJS and TypeScript declarations.
- Source checks inspect TypeScript syntax, including Vue script blocks, without compiling alternate branches. Both repositories pass their `npm run check` commands; CommonJS exports were smoke-tested too. The adapter's unchanged `useGripQuery.ts` remains excluded, with four legacy unbraced branches explicitly deferred.
- Browser review: counter/clock, live and mock weather with independent cities, mock cryptocurrency streams and selection retention, graph pane, source viewer, and both standalone pages.
- Live exchange integration is covered using deterministic WebSocket fixtures. Browser verification also received live Coinbase BTC and Binance ETH prices independently. The preview remains open locally.

## Separate findings

The earlier dependency update reported npm audit findings in existing demo dependencies (including Vue, nanoid, postcss and source-map-js). Applicability to this demo is not established. Review and update that dependency/toolchain baseline separately; it does not prevent this parity implementation. No dependency repository changes are required.

The Vue adapter README also contains older examples for child context and parameter binding that do not match its API. The touched child-context and parameter-binding examples have been corrected; a broader documentation audit remains a separate follow-up.


## GitHub Pages deployment

The user authorized publishing both demo sites on GitHub Pages after the adapter release. This includes committing the Vue parity implementation, consuming the published Vue adapter, and adding the Pages workflow and repository subpath build. Core and adapter repositories remain reference-only for this deployment. The companion React demo receives the corresponding dependency and hosting changes.
