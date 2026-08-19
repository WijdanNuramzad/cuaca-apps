import { useState, useEffect } from 'react';
import { CloudSun, Loader2, AlertTriangle, MapPin, Moon, Sun } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import Forecast from './components/Forecast';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('cuaca_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('cuaca_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const {
    weather,
    location,
    loading,
    error,
    searchResults,
    searching,
    handleSearch,
    selectCity,
    detectLocation,
    clearSearch,
  } = useWeather();

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="app-logo" style={{ marginBottom: 0 }}>
            <CloudSun size={32} strokeWidth={1.8} />
            <h1>Cuaca</h1>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="theme-toggle"
            title="Toggle Tema"
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--border)', 
              padding: '0.5rem', 
              borderRadius: '50%',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <p className="app-subtitle">Prakiraan cuaca real-time untuk seluruh dunia</p>
      </header>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        onSelect={selectCity}
        onDetectLocation={detectLocation}
        results={searchResults}
        searching={searching}
        onClear={clearSearch}
      />

      {/* Error */}
      {error && (
        <div className="error-state" role="alert">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <Loader2 size={40} />
          <p>Mengambil data cuaca...</p>
        </div>
      )}

      {/* Content */}
      {!loading && weather && (
        <>
          <div style={{ marginTop: '1.5rem' }}>
            <CurrentWeather data={weather} location={location} />
          </div>
          <HourlyForecast data={weather} />
          <Forecast data={weather} />
        </>
      )}

      {/* Welcome (empty state) */}
      {!loading && !weather && !error && (
        <div className="welcome-state">
          <div className="welcome-icon">
            <MapPin size={48} strokeWidth={1.5} />
          </div>
          <h2>Selamat Datang!</h2>
          <p>Cari kota di atas atau klik ikon lokasi untuk melihat cuaca di tempatmu saat ini.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Dibuat dengan ❤️ menggunakan React &{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
