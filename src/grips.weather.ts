import type { AtomValueTap } from '@owebeeone/grip-core';
import { defineGrip } from './runtime';

// Generic weather grips (legacy individual metrics)
export const WEATHER_TEMP_C = defineGrip<number | undefined>('Weather.TempC', undefined);
export const WEATHER_HUMIDITY = defineGrip<number | undefined>('Weather.HumidityPct', undefined);
export const WEATHER_WIND_SPEED = defineGrip<number | undefined>('Weather.WindSpeedKph', undefined);
export const WEATHER_WIND_DIR = defineGrip<string>('Weather.WindDir', '');
export const WEATHER_RAIN_PCT = defineGrip<number | undefined>('Weather.RainPct', undefined);
export const WEATHER_SUNNY_PCT = defineGrip<number | undefined>('Weather.SunnyPct', undefined);
export const WEATHER_UV_INDEX = defineGrip<number | undefined>('Weather.UV', undefined);

export interface WeatherSummary {
  locationLabel: string;
  tempC?: number;
  humidityPct?: number;
  windSpeedKph?: number;
  windDirection?: string;
  rainChancePct?: number;
  sunnyChancePct?: number;
  uvIndex?: number;
}

export const WEATHER_SUMMARY = defineGrip<WeatherSummary | undefined>('Weather.Summary', undefined);

// Location input and its handle: unset by default so geocoding waits for a real selection
export const WEATHER_LOCATION = defineGrip<string | undefined>('Weather.Location', undefined);
export const WEATHER_LOCATION_TAP = defineGrip<AtomValueTap<string | undefined>>('Weather.LocationTap', undefined);

// Geocoding outputs
export const GEO_LAT = defineGrip<number | undefined>('Geo.Lat', undefined);
export const GEO_LNG = defineGrip<number | undefined>('Geo.Lng', undefined);
export const GEO_LABEL = defineGrip<string>('Geo.Label', '');
