  import { useState, useCallback, useEffect } from 'react';
import { searchCities, fetchWeather } from '../services/api';

const STORAGE_KEY = 'cuaca_last_location';

/**
 * Custom hook that encapsulates all weather-related state and logic.
 * This separates business logic from UI components (industry best practice).
 */
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const city = JSON.parse(saved);
        selectCity(city, false); // pass false to avoid double saving if not needed, but here we can just use it
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
  }, []); // Run once on mount

  /**
   * Search for cities by name
   */
  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchCities(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Fetch weather for a selected city
   */
  const selectCity = useCallback(async (city, save = true) => {
    setLoading(true);
    setError(null);
    setSearchResults([]);
    
    const newLocation = {
      name: city.name,
      country: city.country || '',
      admin1: city.admin1 || '',
      latitude: city.latitude,
      longitude: city.longitude,
    };
    
    setLocation(newLocation);

    if (save) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
    }

    try {
      const data = await fetchWeather(city.latitude, city.longitude);
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Use the browser's Geolocation API to get weather for the user's current position
   */
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser ini.');
      return;
    }

    setLoading(true);
    setError(null);
    setLocation({ name: 'Lokasi Saya', country: '', admin1: '' });

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get city name
      const cities = await searchCities(`${latitude},${longitude}`);
      if (cities.length > 0) {
        setLocation({
          name: cities[0].name,
          country: cities[0].country || '',
          admin1: cities[0].admin1 || '',
        });
      }

      const data = await fetchWeather(latitude, longitude);
      setWeather(data);
    } catch (err) {
      if (err.code === 1) {
        setError('Akses lokasi ditolak. Silakan cari kota secara manual.');
      } else {
        setError('Gagal mendapatkan lokasi. Silakan cari kota secara manual.');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
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
  };
}
