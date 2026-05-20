"use client";

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bus, MapPin, Wifi, X } from "lucide-react";

// --- Helpers ---
const haversineDistance = (a: L.LatLngTuple, b: L.LatLngTuple) => {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// --- Paths (Biskra city realistic routes, simplified) ---
const paths: L.LatLngTuple[][] = [
  // City center → Biskra Airport
  [
    [34.8506, 5.728], // Place des Martyrs
    [34.8449, 5.7412], // Cite 200 Logts
    [34.8395, 5.752], // Route de Tolga
    [34.8312, 5.7635],
    [34.823, 5.774], // Near airport
    [34.7938, 5.7383], // Biskra Airport
  ],
  // City center → University
  [
    [34.8506, 5.728],
    [34.846, 5.7335],
    [34.841, 5.7395],
    [34.835, 5.746],
    [34.8285, 5.7515],
    [34.8253, 5.759], // University
  ],
  // City center → El Kantara road
  [
    [34.8506, 5.728],
    [34.858, 5.722],
    [34.8655, 5.715],
    [34.873, 5.708],
    [34.8805, 5.7], // El Kantara direction
  ],
  // City center → Cité 500 Logts
  [
    [34.8506, 5.728],
    [34.847, 5.721],
    [34.842, 5.717],
    [34.8365, 5.714],
    [34.8315, 5.712], // 500 Logts
  ],
  // City center → Stadium
  [
    [34.8506, 5.728],
    [34.8545, 5.733],
    [34.8575, 5.739],
    [34.861, 5.7455],
    [34.864, 5.752], // Stadium
  ],
];

// --- Bus Icon ---
const createBusIcon = (isSelected = false) => {
  const animation = isSelected
    ? `<style>
        @keyframes pulse { 
          0%, 100% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(1.3); opacity: 0.7; } 
        }
        .pulse-ring { animation: pulse 2s infinite; transform-origin: center; }
      </style>`
    : "";

  const iconSvg = `
  <div style="position: relative; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
    ${animation}
    ${
      isSelected
        ? `<div class="pulse-ring" style="position: absolute; width: 50px; height: 50px; border-radius: 50%; background-color: rgba(139,92,246,0.3);"></div>`
        : ""
    }
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="filter: drop-shadow(0px 2px 6px rgba(0,0,0,0.5));">
      <circle cx="12" cy="12" r="8" fill="${
        isSelected ? "#a78bfa" : "#6366f1"
      }" />
    </svg>
  </div>`;

  return new L.DivIcon({
    html: iconSvg,
    className: "leaflet-div-icon-transparent",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};
const defaultIcon = createBusIcon(false);
const selectedIcon = createBusIcon(true);

// --- Bus Data ---
interface Bus {
  id: number;
  name: string;
  driver: string;
  online: boolean;
  position: L.LatLngTuple;
  path: L.LatLngTuple[];
  leg: number;
  progress: number;
  direction: number;
}

const drivers = [
  "Ali Ahmed",
  "Fatima Zahra",
  "Karim Belkacem",
  "Sofia Ait",
  "Yacine Boumediene",
];

const initialBuses: Bus[] = Array.from({ length: 5 }, (_, i) => {
  const path = paths[i % paths.length];
  return {
    id: i + 1,
    name: `Bus ${i + 1}`,
    driver: drivers[i],
    online: true,
    position: [...path[0]],
    path,
    leg: 0,
    progress: 0,
    direction: 1,
  };
});

// --- Map Component ---
const BusMap = ({
  onlineBuses,
  selectedBus,
  onMarkerClick,
}: {
  onlineBuses: Bus[];
  selectedBus: Bus | null;
  onMarkerClick: (bus: Bus | null) => void;
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([34.8506, 5.728], 13); // Biskra center
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      map.on("click", () => onMarkerClick(null));
    }
  }, [onMarkerClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const currentMarkers = markersRef.current;
    const onlineBusIds = new Set(onlineBuses.map((b) => b.id));

    // Update markers
    onlineBuses.forEach((bus) => {
      let marker = currentMarkers.get(bus.id);
      if (marker) {
        marker.setLatLng(bus.position);
        marker.setIcon(bus.id === selectedBus?.id ? selectedIcon : defaultIcon);
      } else {
        marker = L.marker(bus.position, {
          icon: bus.id === selectedBus?.id ? selectedIcon : defaultIcon,
        }).addTo(map);
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onMarkerClick(bus);
          map.flyTo(bus.position, 15, { duration: 1 });
        });
        currentMarkers.set(bus.id, marker);
      }
    });

    // Remove offline
    currentMarkers.forEach((marker, id) => {
      if (!onlineBusIds.has(id)) {
        map.removeLayer(marker);
        currentMarkers.delete(id);
      }
    });
  }, [onlineBuses, selectedBus, onMarkerClick]);

  return (
    <div ref={mapContainerRef} className="h-full w-full rounded-xl z-10" />
  );
};

// --- Main Component ---
const BusTracking: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (!bus.online) return bus;

          let newProgress = bus.progress + 0.05; // progress step
          let newLeg = bus.leg;
          let newDirection = bus.direction;

          const start = bus.path[newLeg];
          const end = bus.path[newLeg + newDirection];

          if (!end) {
            newDirection *= -1;
            newLeg += newDirection;
            newProgress = 0;
          } else if (newProgress >= 1) {
            newLeg += newDirection;
            newProgress = 0;
            if (!bus.path[newLeg + newDirection]) {
              newDirection *= -1;
            }
          }

          const legStart = bus.path[newLeg];
          const legEnd =
            bus.path[newLeg + (newDirection > 0 ? 1 : -1)] || legStart;

          const newLat = legStart[0] + (legEnd[0] - legStart[0]) * newProgress;
          const newLng = legStart[1] + (legEnd[1] - legStart[1]) * newProgress;

          return {
            ...bus,
            position: [newLat, newLng],
            leg: newLeg,
            progress: newProgress,
            direction: newDirection,
          };
        })
      );
    }, 2000); // update every 2s
    return () => clearInterval(interval);
  }, []);

  const onlineBuses = buses.filter((b) => b.online);

  return (
    <div className="h-full min-h-[80vh] w-full flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 h-64 lg:h-full p-4 bg-white/40 backdrop-blur-lg border-r border-white/30">
        <header className="pb-2 border-b border-white/40">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bus className="w-6 h-6 text-indigo-600" />
            Bus Tracking - Biskra
          </h1>
          <p className="text-xs text-gray-600">
            {onlineBuses.length} of {buses.length} active
          </p>
        </header>

        <div className="flex-grow overflow-y-auto space-y-2 pt-2">
          {buses.map((bus) => (
            <div
              key={bus.id}
              onClick={() =>
                bus.online ? setSelectedBus(bus) : setSelectedBus(null)
              }
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedBus?.id === bus.id
                  ? "bg-indigo-100/60 border-indigo-400"
                  : "bg-white/50 border-white/30 hover:bg-white/70"
              } ${bus.online ? "" : "opacity-50 cursor-not-allowed"}`}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{bus.name}</p>
                <div
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    bus.online
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <Wifi className="w-3 h-3" />
                  {bus.online ? "Online" : "Offline"}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Driver: {bus.driver}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <BusMap
          onlineBuses={onlineBuses}
          selectedBus={selectedBus}
          onMarkerClick={setSelectedBus}
        />

        {/* Info card */}
        {selectedBus && (
          <div className="absolute z-50 bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/70 backdrop-blur-xl rounded-xl shadow-xl p-3 flex items-center gap-3 border border-white/30">
            <MapPin className="w-6 h-6 text-indigo-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-gray-800">
                {selectedBus.name}
              </h3>
              <p className="text-xs text-gray-600">
                Driver:{" "}
                <span className="font-medium">{selectedBus.driver}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {selectedBus.position[0].toFixed(4)}, Lng:{" "}
                {selectedBus.position[1].toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Line: Dev School - Cité 1000
              </p>
            </div>
            <button
              onClick={() => setSelectedBus(null)}
              className="ml-auto text-gray-500 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusTracking;
