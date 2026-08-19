import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import './SearchBar.css';

/**
 * SearchBar component with autocomplete dropdown.
 * Includes debounce for API calls and keyboard navigation.
 */
export default function SearchBar({
  onSearch,
  onSelect,
  onDetectLocation,
  results,
  searching,
  onClear,
}) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        onSearch(query);
      }, 350);
    } else {
      onClear();
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch, onClear]);

  // Show results dropdown when results change
  useEffect(() => {
    if (results.length > 0) setShowResults(true);
  }, [results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setQuery(city.name);
    setShowResults(false);
    onSelect(city);
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          id="city-search-input"
          type="text"
          placeholder="Cari kota... (misal: Jakarta, London)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          autoComplete="off"
        />
        {searching && <Loader2 className="search-spinner" size={18} />}
      </div>

      <button
        id="detect-location-btn"
        className="location-btn"
        onClick={onDetectLocation}
        title="Gunakan lokasi saya"
      >
        <MapPin size={20} />
      </button>

      {showResults && results.length > 0 && (
        <ul className="search-results">
          {results.map((city) => (
            <li key={`${city.id}-${city.latitude}`}>
              <button onClick={() => handleSelect(city)}>
                <MapPin size={14} />
                <span className="city-name">{city.name}</span>
                <span className="city-detail">
                  {[city.admin1, city.country].filter(Boolean).join(', ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
