"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: (address: string, lat?: number, lng?: number, area?: string) => void;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const cleanAddress = (displayName: string): string => {
  // Split by comma and clean up parts
  const parts = displayName.split(',').map(part => part.trim());
  
  // Remove duplicates (case insensitive)
  const uniqueParts: string[] = [];
  const seen = new Set<string>();
  
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (!seen.has(lower) && part.length > 0) {
      seen.add(lower);
      uniqueParts.push(part);
    }
  }
  
  // Take only first 4 meaningful parts, skip country if it's Norway
  const filteredParts = uniqueParts
    .filter(part => !part.toLowerCase().includes('norway'))
    .slice(0, 4);
  
  return filteredParts.join(', ');
};

const extractAreaFromAddress = (displayName: string): string => {
  const parts = displayName.split(',').map(part => part.trim());
  
  // Look for known cities/areas
  const norwegianCities = [
    'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Tromsø', 
    'Bodø', 'Ålesund', 'Tønsberg', 'Moss', 'Sandefjord', 'Arendal', 
    'Haugesund', 'Molde', 'Kristiansund'
  ];
  
  for (const part of parts) {
    const city = norwegianCities.find(city => 
      part.toLowerCase().includes(city.toLowerCase())
    );
    if (city) return city;
  }
  
  // Default to Oslo if no city found
  return 'Oslo';
};

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Skriv adresse...",
  onSelect,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        // Using Nominatim (OpenStreetMap) for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=no&limit=5&addressdetails=1`
        );
        const data: Suggestion[] = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Feil ved henting av adresseforslag:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    const cleanAddr = cleanAddress(suggestion.display_name);
    const area = extractAreaFromAddress(suggestion.display_name);
    onChange(cleanAddr);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(cleanAddr, parseFloat(suggestion.lat), parseFloat(suggestion.lon), area);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="text-sm">{cleanAddress(suggestion.display_name)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}