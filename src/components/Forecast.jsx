import * as LucideIcons from 'lucide-react';
import { getWeatherInfo } from '../services/api';
import './Forecast.css';

/**
 * Displays 7-day weather forecast in horizontal scrollable cards.
 */
export default function Forecast({ data }) {
  if (!data || !data.daily) return null;

  const { daily } = data;

  const days = daily.time.map((dateStr, i) => {
    const date = new Date(dateStr);
    const isToday = i === 0;
    const dayName = isToday
      ? 'Hari Ini'
      : date.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    const weatherInfo = getWeatherInfo(daily.weather_code[i], 1);
    const Icon = LucideIcons[weatherInfo.icon] || LucideIcons.HelpCircle;

    return {
      key: dateStr,
      dayName,
      dayDate,
      icon: Icon,
      description: weatherInfo.description,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      precipProb: daily.precipitation_probability_max[i],
      isToday,
    };
  });

  return (
    <div className="forecast-section">
      <h2 className="forecast-title">
        <LucideIcons.CalendarDays size={20} />
        Prakiraan 7 Hari
      </h2>
      <div className="forecast-grid">
        {days.map((day) => (
          <div
            className={`forecast-card ${day.isToday ? 'forecast-card--today' : ''}`}
            key={day.key}
          >
            <span className="forecast-day">{day.dayName}</span>
            <span className="forecast-date">{day.dayDate}</span>
            <div className="forecast-icon">
              <day.icon size={32} strokeWidth={1.5} />
            </div>
            <span className="forecast-desc">{day.description}</span>
            <div className="forecast-temps">
              <span className="forecast-max">{day.tempMax}°</span>
              <span className="forecast-min">{day.tempMin}°</span>
            </div>
            {day.precipProb != null && (
              <div className="forecast-precip">
                <LucideIcons.Droplets size={12} />
                {day.precipProb}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
