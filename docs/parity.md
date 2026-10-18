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

## Guided demos and graph change highlights

Authorized scope: Overview landing tabs and per-example guidance in the React and
Vue demos, plus changed-value highlights in both reusable adapter graph viewers.
Core remains reference-only. The user subsequently authorized direct commits,
a workspace-wide push, and deployment of the updated GitHub Pages sites.

The viewers compare copied display values, preserve row identity, and animate
only changes after the initial snapshot. High-contrast blue highlights with white text and a gold edge hold briefly and
fade over 1.5 seconds;
reduced-motion users receive a static temporary highlight. Replaced runtimes
start a fresh baseline. Animations are canceled on replacement or unmount.

Local integration uses packed adapter builds without changing either demo's
published dependency declarations. Pages builds the exact committed adapter source and installs its packed artifact
before testing and building each demo. This deploys the highlights without a new
npm release; the source-build steps can be removed after published dependencies
include the highlights.

Validation: 26 React adapter tests, 11 Vue adapter tests, 18 React demo tests,
and 10 Vue demo tests pass. Both adapter builds and both Pages builds pass.
Browser checks confirmed the default Overview pages, per-example guidance,
changed-value highlights, and clearing of highlights without further changes.
React's stale local Core installation initially failed an existing lifetime test
even with the unchanged viewer; restoring its frozen registry dependencies
resolved it without any Core source changes. New and touched control-flow bodies
are braced; broader legacy React control-flow migration remains outside scope.

Contrast revision: solid blue with white text and a gold outline replaces pale
amber in both adapters. Text contrast during the solid phase is approximately
6.44:1. The highlight holds before switching to dark text on a pale fill and
fading out, avoiding unreadable text during the fade. Targeted graph tests and
both package/demo builds pass; local browser previews were rebuilt and reviewed.

Separate existing limitation: React graph cards use an internally scrolling drip
list. With enough consumers, a changed row can be below its visible area until
scrolled. The browser confirmed this for the count row while additional consumers
were present. A future card-level change indicator could expose activity in hidden
rows; this does not block the requested contrast correction.
