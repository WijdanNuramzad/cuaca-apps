const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for cities matching the given query string.
 * Uses the Open-Meteo Geocoding API.
 * @param {string} query - City name to search for
 * @returns {Promise<Array>} Array of location results
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: '6',
    language: 'id',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_API}?${params}`);
  if (!response.ok) throw new Error('Gagal mencari kota.');

  const data = await response.json();
  return data.results || [];
}

/**
 * Fetches current weather and 7-day forecast for given coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code'].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  if (!response.ok) throw new Error('Gagal mengambil data cuaca.');

  return response.json();
}

/**
 * Maps WMO weather code to human-readable description and icon name.
 * @param {number} code - WMO weather code
 * @param {number} isDay - 1 for day, 0 for night
 * @returns {{ description: string, icon: string }}
 */
export function getWeatherInfo(code, isDay = 1) {
  const weatherMap = {
    0: { description: 'Cerah', icon: isDay ? 'Sun' : 'Moon' },
    1: { description: 'Cerah Berawan', icon: isDay ? 'SunDim' : 'Moon' },
    2: { description: 'Berawan Sebagian', icon: 'CloudSun' },
    3: { description: 'Mendung', icon: 'Cloud' },
    45: { description: 'Berkabut', icon: 'CloudFog' },
    48: { description: 'Kabut Tebal', icon: 'CloudFog' },
    51: { description: 'Gerimis Ringan', icon: 'CloudDrizzle' },
    53: { description: 'Gerimis', icon: 'CloudDrizzle' },
    55: { description: 'Gerimis Lebat', icon: 'CloudDrizzle' },
    61: { description: 'Hujan Ringan', icon: 'CloudRain' },
    63: { description: 'Hujan', icon: 'CloudRain' },
    65: { description: 'Hujan Lebat', icon: 'CloudRainWind' },
    71: { description: 'Salju Ringan', icon: 'Snowflake' },
    73: { description: 'Salju', icon: 'Snowflake' },
    75: { description: 'Salju Lebat', icon: 'Snowflake' },
    80: { description: 'Hujan Singkat', icon: 'CloudRain' },
    81: { description: 'Hujan Lebat Singkat', icon: 'CloudRainWind' },
    82: { description: 'Hujan Sangat Lebat', icon: 'CloudRainWind' },
    95: { description: 'Badai Petir', icon: 'CloudLightning' },
    96: { description: 'Badai Petir + Hujan Es', icon: 'CloudLightning' },
    99: { description: 'Badai Petir Hebat', icon: 'CloudLightning' },
  };

  return weatherMap[code] || { description: 'Tidak Diketahui', icon: 'HelpCircle' };
}
