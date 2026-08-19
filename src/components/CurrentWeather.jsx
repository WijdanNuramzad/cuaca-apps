import * as LucideIcons from 'lucide-react';
import { getWeatherInfo } from '../services/api';
import './CurrentWeather.css';

/**
 * Displays the main current weather card with temperature,
 * condition description, humidity, wind speed, and feels-like temperature.
 */
export default function CurrentWeather({ data, location }) {
  if (!data || !data.current) return null;

  const current = data.current;
  const daily = data.daily;
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);

  // Dynamically select the icon from lucide-react
  const IconComponent = LucideIcons[weatherInfo.icon] || LucideIcons.HelpCircle;

  // Get today's sunrise / sunset
  const sunrise = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunset = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="current-weather">
      {/* Main temperature card */}
      <div className="weather-hero">
        <div className="weather-icon-wrapper">
          <IconComponent size={72} strokeWidth={1.5} />
        </div>
        <div className="weather-temp">
          <span className="temp-value">{Math.round(current.temperature_2m)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <p className="weather-desc">{weatherInfo.description}</p>
        <p className="weather-location">
          <LucideIcons.MapPin size={16} />
          {location?.name}
          {location?.admin1 ? `, ${location.admin1}` : ''}
          {location?.country ? ` — ${location.country}` : ''}
        </p>
      </div>

      {/* Info cards grid */}
      <div className="weather-details">
        <div className="detail-card">
          <LucideIcons.Thermometer size={22} />
          <div>
            <span className="detail-label">Terasa</span>
            <span className="detail-value">{Math.round(current.apparent_temperature)}°C</span>
          </div>
        </div>
        <div className="detail-card">
          <LucideIcons.Droplets size={22} />
          <div>
            <span className="detail-label">Kelembapan</span>
            <span className="detail-value">{current.relative_humidity_2m}%</span>
          </div>
        </div>
        <div className="detail-card">
          <LucideIcons.Wind size={22} />
          <div>
            <span className="detail-label">Angin</span>
            <span className="detail-value">{Math.round(current.wind_speed_10m)} km/j</span>
          </div>
        </div>
        <div className="detail-card">
          <LucideIcons.Sunrise size={22} />
          <div>
            <span className="detail-label">Terbit</span>
            <span className="detail-value">{sunrise}</span>
          </div>
        </div>
        <div className="detail-card">
          <LucideIcons.Sunset size={22} />
          <div>
            <span className="detail-label">Terbenam</span>
            <span className="detail-value">{sunset}</span>
          </div>
        </div>
        <div className="detail-card">
          <LucideIcons.Compass size={22} />
          <div>
            <span className="detail-label">Arah Angin</span>
            <span className="detail-value">{current.wind_direction_10m}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
