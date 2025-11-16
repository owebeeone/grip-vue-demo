import { type Tap, createAtomValueTap, BaseTap, Grip, type TapFactory, withOneOf, createAsyncValueTap } from '@owebeeone/grip-core';
import { grok } from './runtime';
import { CURRENT_TIME, COUNT, CURRENT_TAB, COUNT_TAP, CURRENT_TAB_TAP, WEATHER_PROVIDER_NAME, WEATHER_PROVIDER_NAME_TAP } from './grips';
import { WEATHER_TEMP_C, WEATHER_HUMIDITY, WEATHER_WIND_SPEED, WEATHER_WIND_DIR, WEATHER_RAIN_PCT, WEATHER_SUNNY_PCT, WEATHER_UV_INDEX, WEATHER_LOCATION, WEATHER_SUMMARY, type WeatherSummary } from './grips.weather';
import { createLocationToGeoTap, METEO_TAP_FACTORY, createOpenMeteoWeatherSummaryTap } from './openmeteo_taps';
import { CalculatorTap } from './taps_calculator';

// Calculator tap factory - just because we can. This would work fine as a tap instance
// but as a tap factory in theory we could add it in multiple places and it would
// be instantiated as needed.
class CalcTapFactory implements TapFactory {
  readonly kind: 'TapFactory' = 'TapFactory';
  readonly provides = CalculatorTap.outputs;
  readonly key: TapFactory = this;

  build() {
    return new CalculatorTap();
  }
}
export const CalcTap = new CalcTapFactory();

// Time tick: publish current time every second
class TimeTap extends BaseTap implements Tap {
  private timer: any | null = null;
  constructor() { super({ provides: [CURRENT_TIME] }); }
  private start() {
    if (this.timer) return;
    const tick = () => {
      const updates = new Map([[CURRENT_TIME as any, new Date()]]);
      this.publish(updates);
    };
    tick();
    this.timer = setInterval(tick, 1000);
  }
  private stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
  onAttach(home: any): void {
    super.onAttach(home);
    // Do not start here; wait for first destination connect
  }
  onDetach(): void {
    this.stop();
    super.onDetach();
  }
  onConnect(dest: any, grip: any): void {
    super.onConnect(dest, grip);
    this.start();
  }
  onDisconnect(dest: any, grip: any): void {
    super.onDisconnect(dest, grip);
    const hasAny = (this.producer?.getDestinations().size ?? 0) > 0;
    if (!hasAny) this.stop();
  }
  produce(): void {}
  produceOnParams(): void {}
  produceOnDestParams(): void {}
}
export const TickTap: Tap = new TimeTap() as unknown as Tap;

// Counter & Tab taps via simple taps
export const CounterTap: Tap = createAtomValueTap(
  COUNT, 
  { initial: COUNT.defaultValue ?? 0, handleGrip: COUNT_TAP }) as unknown as Tap;
export const TabTap: Tap = createAtomValueTap(
    CURRENT_TAB, 
    { initial: CURRENT_TAB.defaultValue ?? 'clock', handleGrip: CURRENT_TAB_TAP });
export const WeatherProviderTap: Tap = createAtomValueTap(
  WEATHER_PROVIDER_NAME, 
  { initial: WEATHER_PROVIDER_NAME.defaultValue ?? 'meteo', handleGrip: WEATHER_PROVIDER_NAME_TAP });


// Weather tap driven by BaseTap. Reads WEATHER_LOCATION per-destination and publishes derived values.
function computeMockSummary(loc: string, now: number): WeatherSummary {
  const lower = loc.toLowerCase();
  let offset = 0;
  for (let i = 0; i < lower.length; i++) offset = (offset + lower.charCodeAt(i)) % 10;
  const t = (Math.floor(now / 2000) + offset) % 10;
  const temp = 20 + offset + t;
  const humidity = 50 + ((t + offset) % 20);
  const wind = 10 + ((t + offset) % 5);
  const dir = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][(t + offset) % 8];
  const rain = ((t * 7 + offset * 3) % 100);
  const sunny = 100 - rain;
  const uv = (t + offset) % 11;
  return {
    locationLabel: loc,
    tempC: temp,
    humidityPct: humidity,
    windSpeedKph: wind,
    windDirection: dir,
    rainChancePct: rain,
    sunnyChancePct: sunny,
    uvIndex: uv
  };
}

class WeatherTapImpl extends BaseTap implements Tap {
  private timer: any | null = null;
  constructor() {
    super({
      provides: [
        WEATHER_TEMP_C,
        WEATHER_HUMIDITY,
        WEATHER_WIND_SPEED,
        WEATHER_WIND_DIR,
        WEATHER_RAIN_PCT,
        WEATHER_SUNNY_PCT,
        WEATHER_UV_INDEX
      ],
      destinationParamGrips: [WEATHER_LOCATION]
    });
  }
  onAttach(home: any): void {
    super.onAttach(home);
    const tick = () => {
      const now = Date.now();
      const destNodes = Array.from(this.producer?.getDestinations().keys() ?? []);
      const groups = new Map<string, any[]>();
      for (const destNode of destNodes) {
        const dest = destNode.get_context();
        if (!dest) continue;
        const loc =
          this.getDestParamValue(dest, WEATHER_LOCATION) ?? (WEATHER_LOCATION.defaultValue ?? 'Default');
        const key = String(loc);
        let arr = groups.get(key);
        if (!arr) {
          arr = [];
          groups.set(key, arr);
        }
        arr.push(dest);
      }
      for (const [loc, dests] of groups) {
        const summary = computeMockSummary(loc, now);
        const updates = new Map<Grip<any>, any>([
          [WEATHER_TEMP_C as any, summary.tempC],
          [WEATHER_HUMIDITY as any, summary.humidityPct],
          [WEATHER_WIND_SPEED as any, summary.windSpeedKph],
          [WEATHER_WIND_DIR as any, summary.windDirection],
          [WEATHER_RAIN_PCT as any, summary.rainChancePct],
          [WEATHER_SUNNY_PCT as any, summary.sunnyChancePct],
          [WEATHER_UV_INDEX as any, summary.uvIndex]
        ]);
        for (const dest of dests) this.publish(updates, dest);
      }
    };
    tick();
    this.timer = setInterval(tick, 2000);
  }
  onDetach(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    super.onDetach();
  }
  produce(): void {}
  produceOnParams(): void {
    this.produce();
  }
  produceOnDestParams(): void {}
}
export const WeatherTap: Tap = new WeatherTapImpl() as unknown as Tap;

export function createMockWeatherSummaryTap(): Tap {
  return createAsyncValueTap<WeatherSummary | undefined>({
    provides: WEATHER_SUMMARY,
    destinationParamGrips: [WEATHER_LOCATION],
    cacheTtlMs: 2 * 1000,
    deadlineMs: 1000,
    requestKeyOf: (params) => {
      const raw = params.get(WEATHER_LOCATION);
      const loc = raw ? String(raw).trim() : '';
      if (!loc) {
        console.log('[MockWeatherSummary] requestKeyOf waiting for location', { ctx: params.destContext.id });
        return undefined;
      }
      const key = loc.toLowerCase();
      console.log('[MockWeatherSummary] requestKeyOf', key);
      return key;
    },
    fetcher: async (params, signal) => {
      const loc = ((params.get(WEATHER_LOCATION) ?? 'Default') as string).trim() || 'Default';
      console.log('[MockWeatherSummary] fetcher start', { loc, ctx: params.destContext.id });
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 300);
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true }
        );
      });
      const result = computeMockSummary(loc, Date.now());
      console.log('[MockWeatherSummary] result', result);
      return result;
    }
  });
}

// Registration helper
export function registerAllTaps() {
  grok.registerTap(TickTap);
  grok.registerTap(CounterTap);
  grok.registerTap(TabTap);
  grok.registerTap(CalcTap);
  grok.registerTap(WeatherProviderTap);
  // Register live OpenMeteo taps at main so any context can resolve live data
  grok.registerTap(createLocationToGeoTap());
  // grok.registerTap(createOpenMeteoWeatherTap());
  // Keep simulated tap as a fallback at the root (lower proximity than main)
  //grok.registerTapAt(grok.rootContext, WeatherTap);

  const mockSummaryTap = createMockWeatherSummaryTap();
  const liveSummaryTap = createOpenMeteoWeatherSummaryTap();

  const mockQuery = withOneOf(WEATHER_PROVIDER_NAME, 'mock', 10).build();
  grok.addBinding({ id: 'mock-weather-binding', query: mockQuery, tap: WeatherTap, baseScore: 5 });
  grok.addBinding({ id: 'mock-weather-summary', query: mockQuery, tap: mockSummaryTap, baseScore: 5 });

  const meteoQuery = withOneOf(WEATHER_PROVIDER_NAME, 'meteo', 10).build();
  grok.addBinding({ id: 'meteo-weather-binding', query: meteoQuery, tap: METEO_TAP_FACTORY, baseScore: 5 });
  grok.addBinding({ id: 'meteo-weather-summary', query: meteoQuery, tap: liveSummaryTap, baseScore: 5 });
}
