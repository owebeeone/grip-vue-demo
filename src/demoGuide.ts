export const examples = {
  clock: {
    title: 'Clock & Counter',
    summary: 'Shared state, conditional subscriptions, and derived values.',
    tryIt: 'Change the count to an even number, then edit the description in the middle of a sentence.',
    notice: 'The clock runs only while it is visible. The stored text, slug, and statistics follow your edits while the caret stays where you put it.',
  },
  calc: {
    title: 'Calculator',
    summary: 'Actions supplied through GRIP alongside the values they update.',
    tryIt: 'Enter two numbers and an operation, then press equals or clear.',
    notice: 'Buttons request action functions from the context. The display observes the resulting value without owning the calculator logic.',
  },
  weather: {
    title: 'Weather',
    summary: 'Independent scopes and interchangeable asynchronous providers.',
    tryIt: 'Choose different cities in the two columns, then switch between mock weather and Open-Meteo.',
    notice: 'Each column keeps its own location while the shared provider choice changes how both resolve weather. Mock data works without the weather service.',
  },
  coins: {
    title: 'Coins',
    summary: 'Streaming values, independent subscriptions, and provider cleanup.',
    tryIt: 'Start with mock data, choose different products in each column, then try a live exchange or switch providers.',
    notice: 'Each column follows its own market. Changing providers or leaving the page releases its subscriptions. Live feeds depend on exchange availability.',
  },
} as const;
export type ExampleTab = keyof typeof examples;
export type DemoTab = 'overview' | ExampleTab;
