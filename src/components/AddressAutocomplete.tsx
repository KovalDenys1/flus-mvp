"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: (address: string, lat?: number, lng?: number, area?: string) => void;
}

interface Address {
  id: string;
  city: string;
  street_name: string;
  created_at?: string;
  updated_at?: string;
}

interface GeonorgeAddress {
  adressetekst: string;
  kommunenavn?: string;
  representasjonspunkt?: {
    lat: number;
    lon: number;
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Skriv adresse...",
  onSelect,
}: AddressAutocompleteProps) {
  const [kommune, setKommune] = useState("");
  const [streetInput, setStreetInput] = useState("");
  const [streets, setStreets] = useState<Address[]>([]);
  const [addresses, setAddresses] = useState<GeonorgeAddress[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Extract kommune and street from input value
  useEffect(() => {
    const parts = value.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      setKommune(parts[parts.length - 1]); // Last part is usually kommune
      setStreetInput(parts[0]); // First part is usually street
    } else if (parts.length === 1) {
      setStreetInput(parts[0]);
    }
  }, [value]);

  // Fetch streets from Supabase whenever kommune or streetInput changes
  useEffect(() => {
    if (!streetInput || streetInput.length < 2) {
      setStreets([]);
      setAddresses([]);
      return;
    }

    const fetchStreets = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowser();
        let query = supabase
          .from('addresses')
          .select('*')
          .ilike('street_name', `%${streetInput}%`)
          .limit(50);

        if (kommune) {
          const correctKommune = kommune.charAt(0).toUpperCase() + kommune.slice(1);
          query = query.ilike('city', correctKommune);
        }

        const { data, error } = await query;

        if (error) throw error;
        setStreets(data || []);
      } catch (err) {
        console.error("Error fetching streets:", err);
        setStreets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStreets();
  }, [streetInput, kommune]);

  // Fuse.js for fuzzy search on streets
  const streetFuse = useMemo(
    () => new Fuse(streets, { keys: ['street_name'], threshold: 0.4 }),
    [streets]
  );

  // Update street results and fetch addresses from Geonorge
  useEffect(() => {
    if (streetInput && streets.length > 0) {
      const results = streetFuse.search(streetInput).map(r => r.item);

      // Fetch full addresses from Geonorge API
      const fetchAddresses = async () => {
        setLoading(true);
        try {
          const allAddresses: GeonorgeAddress[] = [];
          for (const street of results.slice(0, 5)) {
            const searchQuery = kommune 
              ? `${street.street_name} ${kommune}`
              : `${street.street_name} ${street.city}`;
            
            const res = await fetch(
              `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(searchQuery)}`
            );
            const json = await res.json();
            if (json.adresser) {
              allAddresses.push(...json.adresser);
            }
          }
          setAddresses(allAddresses);
        } catch (err) {
          console.error("Error fetching addresses from Geonorge:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [streetInput, streetFuse, streets, kommune]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || addresses.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < addresses.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectAddress(addresses[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectAddress = (address: GeonorgeAddress) => {
    onChange(address.adressetekst);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onSelect) {
      const lat = address.representasjonspunkt?.lat;
      const lon = address.representasjonspunkt?.lon;
      const area = address.kommunenavn || kommune || 'Oslo';
      onSelect(address.adressetekst, lat, lon, area);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (addresses.length > 0) {
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
      {showSuggestions && addresses.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {addresses.slice(0, 10).map((address, index) => (
            <div
              key={`${address.adressetekst}-${index}`}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? "bg-secondary/10" : ""
              }`}
              onClick={() => selectAddress(address)}
            >
              <div className="text-sm">{address.adressetekst}</div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}