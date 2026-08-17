import React, { useEffect, useRef, useState, useCallback } from "react";
import { getServices } from "../api/services";
import Loading from "../components/Loading.jsx";
import "./Services.css";

const TABS = [
  { key: "veterinary", label: "Veterinary" },
  { key: "petcare", label: "Pet care" },
  { key: "pharmacy", label: "Pharmacy" },
  { key: "all", label: "All" },
];

const TYPE_LABEL = {
  veterinary: "Veterinary",
  vet: "Veterinary",
  petcare: "Pet Care",
  "pet-care": "Pet Care",
  "pet_care": "Pet Care",
  pharmacy: "Pharmacy",
};

const TYPE_CLASS = {
  veterinary: "svc-type-vet",
  vet: "svc-type-vet",
  petcare: "svc-type-petcare",
  "pet-care": "svc-type-petcare",
  "pet_care": "svc-type-petcare",
  pharmacy: "svc-type-pharmacy",
};

function getTypeInfo(item, tab) {
  const raw = (item.type || item.Type || item.category || item.Category || (tab !== "all" ? tab : ""))
    .toString().toLowerCase().trim();
  return {
    label: TYPE_LABEL[raw] || raw.charAt(0).toUpperCase() + raw.slice(1) || null,
    cls: TYPE_CLASS[raw] || "svc-type-other",
  };
}

/* ── Inline service map ─────────────────────────────────────────────────── */

function ServiceMap({ items, userCoords }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!userCoords && items.length === 0) return;

    // Load Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const init = async () => {
      const L = (await import("leaflet")).default;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!containerRef.current) return;

      // Destroy previous instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const centerLat = userCoords?.latitude ?? items[0]?.latitude ?? items[0]?.Latitude ?? 0;
      const centerLon = userCoords?.longitude ?? items[0]?.longitude ?? items[0]?.Longitude ?? 0;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([centerLat, centerLon], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // User location marker (blue dot)
      if (userCoords) {
        const youIcon = L.divIcon({
          className: "",
          html: '<div class="svc-map-you"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([userCoords.latitude, userCoords.longitude], { icon: youIcon })
          .addTo(map)
          .bindPopup("You are here");
      }

      // Service markers
      const bounds = [];
      if (userCoords) bounds.push([userCoords.latitude, userCoords.longitude]);

      items.forEach((it, idx) => {
        const lat = it.latitude ?? it.Latitude;
        const lon = it.longitude ?? it.Longitude;
        if (!lat || !lon) return;
        bounds.push([lat, lon]);
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<strong>${it.name}</strong><br/>${it.address || ""}`);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapRef.current = map;
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [items, userCoords]);

  return (
    <div className="svc-map-wrapper">
      <div ref={containerRef} className="svc-map-container" />
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */

export default function Services() {
  const [tab, setTab] = useState("veterinary");
  const [view, setView] = useState("list"); // "list" | "map"
  const [radius, setRadius] = useState(10);      // km — slider value (live)
  const [fetchRadius, setFetchRadius] = useState(10); // km — debounced, triggers API
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Location permission is needed to find nearby services.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }, []);

  // Debounce slider → only fire API 300 ms after user stops dragging
  const handleRadiusChange = useCallback((e) => {
    const val = Number(e.target.value);
    setRadius(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFetchRadius(val), 300);
  }, []);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    getServices(tab, coords.latitude, coords.longitude, fetchRadius)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [tab, coords, fetchRadius]);

  const hasResults = !locating && !locationError && items.length > 0;

  return (
    <div className="container">
      <div className="browse-hero">
        <h1>Nearby pet services</h1>
        <p>Vets, groomers, stores, and pharmacies close to you.</p>
      </div>

      {/* Category tabs + slider + view toggle — all one line */}
      <div className="svc-toolbar">
        <div className="svc-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`svc-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!locating && !locationError && (
          <div className="svc-slider-inline">
            <input
              id="svc-radius-slider"
              type="range"
              min="1"
              max="50"
              step="1"
              value={radius}
              onChange={handleRadiusChange}
              className="svc-slider"
            />
            <span className="svc-slider-value">{radius} km</span>
          </div>
        )}

        {hasResults && (
          <div className="svc-view-toggle">
            <button
              className={`svc-toggle-btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor" />
              </svg>
              List
            </button>
            <button
              className={`svc-toggle-btn${view === "map" ? " active" : ""}`}
              onClick={() => setView("map")}
              aria-pressed={view === "map"}
              title="Map view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2C5.79 2 4 3.79 4 6c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 8 4a1.5 1.5 0 0 1 0 3.5z" fill="currentColor" />
              </svg>
              Map
            </button>
          </div>
        )}
      </div>

      {locating ? (
        <Loading label="Getting your location" />
      ) : locationError ? (
        <div className="alert alert-info">{locationError}</div>
      ) : loading ? (
        <Loading label="Searching nearby" />
      ) : items.length === 0 ? (
        <div className="empty">
          <h3>Nothing found nearby</h3>
          <p>Try a different category.</p>
        </div>
      ) : view === "map" ? (
        <ServiceMap items={items} userCoords={coords} />
      ) : (
        items.map((it, i) => {
          const destLat = it.latitude ?? it.Latitude;
          const destLon = it.longitude ?? it.Longitude;
          const mapsUrl = destLat && destLon
            ? `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${destLat},${destLon}`
            : `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${encodeURIComponent(it.address || it.name)}`;

          const { label: typeLabel, cls: typeCls } = getTypeInfo(it, tab);

          return (
            <div className="card svc-item" key={it.id || i}>
              <div className="svc-info">
                <div className="svc-name">{it.name}</div>
                {typeLabel && (
                  <span className={`svc-type-pill ${typeCls}`}>{typeLabel}</span>
                )}
                <div className="svc-address">{it.address}</div>
              </div>
              <div className="svc-actions">
                <span className="svc-distance">{it.distanceKm} km</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svc-directions-btn"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1L15 8l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 8h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Directions
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
