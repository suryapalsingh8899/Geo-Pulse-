import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ onSelectLocation, placeholder = "Search city, landmark, or place..." }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search via OpenStreetMap Nominatim API
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&limit=6&addressdetails=1`;
        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Geocoding search error:", err);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  const handleSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      const parts = (item.display_name || "").split(",").map((s) => s.trim());
      const shortName = parts[0] || item.name || "Selected Location";
      setQuery(shortName);
      setIsOpen(false);
      setResults([]);

      if (onSelectLocation) {
        onSelectLocation({
          lat,
          lng: lon,
          name: shortName,
          fullName: item.display_name,
          type: item.type,
          boundingBox: item.boundingbox,
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        if (results.length > 0) {
          handleSelect(results[0]);
        }
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const getPlaceIcon = (item) => {
    const type = (item.type || "").toLowerCase();
    const cls = (item.class || "").toLowerCase();
    if (type === "city" || type === "town" || cls === "place") return "🏙️";
    if (type === "country" || type === "state" || type === "administrative") return "📍";
    if (type === "island" || type === "natural" || type === "water") return "🏝️";
    if (type === "aeroway" || type === "airport") return "✈️";
    if (type === "mountain" || type === "peak") return "⛰️";
    if (type === "historic" || type === "tourism") return "🏛️";
    return "📍";
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">
          {isLoading ? (
            <span className="search-spinner" />
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search map location"
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown glass-card">
          <div className="search-dropdown-header">
            <span>Locations</span>
            <span className="search-attribution">OpenStreetMap</span>
          </div>
          <ul className="search-results-list" role="listbox">
            {results.map((item, index) => {
              const parts = (item.display_name || "")
                .split(",")
                .map((s) => s.trim());
              const primary = parts[0] || item.name || "Location";
              const secondary = parts.slice(1, 4).join(", ");
              const isSelected = index === selectedIndex;

              return (
                <li
                  key={item.place_id || index}
                  className={`search-result-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="search-result-icon">{getPlaceIcon(item)}</span>
                  <div className="search-result-text">
                    <span className="search-result-primary">{primary}</span>
                    {secondary && (
                      <span className="search-result-secondary">{secondary}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
