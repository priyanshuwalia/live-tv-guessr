import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register the English dictionary for translations
isoCountries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  onCountrySelect: (countryCode: string, countryName: string) => void;
  selectedCountryCode?: string | null;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onCountrySelect, selectedCountryCode }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl select-none">
      <div className="text-sm font-medium text-gray-400 mb-2 h-5">
        {hoveredCountry ? `Targeting: ${hoveredCountry}` : 'Select a country on the map...'}
      </div>
      
      <div className="bg-gray-950 rounded-lg overflow-hidden border border-gray-800/50">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // 1. Extract the numeric ID (e.g. "792" for Turkey)
                const numericId = geo.id;
                const countryName = geo.properties.name;
                
                // 2. Safely translate "792" -> "TR"
                // We provide a fallback to geo.properties.iso_a2 for edge cases like Kosovo
                const alpha2Code = isoCountries.numericToAlpha2(numericId) || geo.properties.iso_a2; 
                
                const isSelected = selectedCountryCode === alpha2Code;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      // Only allow selection if we successfully mapped the code
                      if (alpha2Code) {
                        onCountrySelect(alpha2Code, countryName);
                      }
                    }}
                    style={{
                      default: {
                        fill: isSelected ? "#3B82F6" : "#374151",
                        stroke: "#1F2937",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "fill 0.2s ease",
                      },
                      hover: {
                        fill: isSelected ? "#2563EB" : "#4B5563",
                        stroke: "#9CA3AF",
                        strokeWidth: 0.8,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#1D4ED8",
                        stroke: "#F3F4F6",
                        strokeWidth: 1,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};