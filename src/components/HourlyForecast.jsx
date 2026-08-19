import * as LucideIcons from 'lucide-react';
import { getWeatherInfo } from '../services/api';
import './HourlyForecast.css';

/**
 * Displays 24-hour weather forecast in a scrollable horizontal list.
 */
export default function HourlyForecast({ data }) {
  if (!data || !data.hourly) return null;

  const { hourly } = data;
  
  // Get current hour index
  const now = new Date();
  now.setMinutes(0, 0, 0); // truncate to start of hour
  const nowTime = now.getTime();
  
  // Find index of current hour in data
  let startIndex = hourly.time.findIndex(timeStr => new Date(timeStr).getTime() >= nowTime);
  if (startIndex === -1) startIndex = 0;
  
  // Get next 24 hours
  const next24Hours = [];
  for (let i = startIndex; i < startIndex + 24 && i < hourly.time.length; i++) {
    const date = new Date(hourly.time[i]);
    const isNow = i === startIndex;
    const timeLabel = isNow ? 'Sekarang' : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // Determine if it's day or night for icon
    const hour = date.getHours();
    const isDay = hour >= 6 && hour < 18 ? 1 : 0;
    
    const weatherInfo = getWeatherInfo(hourly.weather_code[i], isDay);
    const Icon = LucideIcons[weatherInfo.icon] || LucideIcons.HelpCircle;

    next24Hours.push({
      key: hourly.time[i],
      timeLabel,
      icon: Icon,
      temp: Math.round(hourly.temperature_2m[i]),
      isNow
    });
  }

  return (
    <div className="hourly-section">
      <h2 className="hourly-title">
        <LucideIcons.Clock size={20} />
        Prakiraan Per Jam (24 Jam)
      </h2>
      <div className="hourly-container">
        {next24Hours.map((hour) => (
          <div className={`hourly-card ${hour.isNow ? 'hourly-card--now' : ''}`} key={hour.key}>
            <span className="hourly-time">{hour.timeLabel}</span>
            <div className="hourly-icon">
              <hour.icon size={24} strokeWidth={1.5} />
            </div>
            <span className="hourly-temp">{hour.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
