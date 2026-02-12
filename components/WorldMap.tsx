
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface City {
    name: string;
    coordinates: [number, number];
    timezone: string;
}

interface WorldMapProps {
    cities: City[];
    theme: 'light' | 'dark';
}

const WorldMap: React.FC<WorldMapProps> = ({ cities, theme }) => {
    const isDark = theme === 'dark';

    // Projection configuration for consistent coordinate mapping
    const projectionConfig = { scale: 140, center: [0, 0] as [number, number] };

    return (
        <div className="w-full h-full relative pointer-events-none select-none overflow-visible">
            <ComposableMap projection="geoMercator" projectionConfig={projectionConfig}>
                <defs>
                    <pattern id="dotted-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="0.8" fill={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} />
                    </pattern>
                </defs>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="url(#dotted-pattern)"
                                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {/* Vertical Timeline Line - Positioned at UTC 0 (longitude 0) */}
                <Marker coordinates={[0, 0]}>
                    <line
                        x1="0"
                        y1="-300" // Extend above map
                        x2="0"
                        y2="300"  // Extend below map
                        stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                    <circle
                        cx="0"
                        cy="0"
                        r="3"
                        fill={isDark ? "#fff" : "#000"}
                        opacity="0.3"
                    />
                </Marker>

                {cities.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={2.5} fill={isDark ? "#fff" : "#000"} opacity={0.6} />
                    </Marker>
                ))}
            </ComposableMap>

            {/* Design accents - the small labels/circles from the design */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-dashed ${isDark ? 'border-white/20' : 'border-slate-300'}`}></div>
        </div>
    );
};

export default WorldMap;
