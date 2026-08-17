import React, { useEffect, useRef, useState } from "react";
import { getPets } from "../api/pets";
import PetCard from "../components/PetCard.jsx";
import Loading from "../components/Loading.jsx";
import LocationAutocomplete from "../components/LocationAutocomplete.jsx";
import "./Browse.css";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"];
const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

/** Haversine distance in km between two lat/lon pairs */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Browse() {
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [breedInput, setBreedInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);

  const breedRef = useRef(null);

  // Fetch pets when species changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getPets({ species: species || undefined })
      .then((data) => active && setAllPets(data))
      .catch(() => active && setError("Couldn't load listings. Is the API running?"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [species]);

  function toggleMyLocation() {
    if (coords) { setCoords(null); return; }
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let label = "";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          label = [
            addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city,
            addr.city || addr.state_district,
            addr.state,
          ].filter(Boolean).slice(0, 3).join(", ");
        } catch { /* coords still work */ }
        setCoords({ latitude, longitude, label });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  // Breed suggestions derived from loaded pets
  const breedSuggestions = breedInput.trim()
    ? [...new Set(
        allPets
          .map((p) => p.breed || p.Breed)
          .filter(Boolean)
          .filter((b) => b.toLowerCase().includes(breedInput.toLowerCase()))
      )].slice(0, 8)
    : [];

  function selectBreed(b) {
    setBreed(b);
    setBreedInput(b);
    setShowSuggestions(false);
  }

  function clearAll() {
    setSpecies("");
    setBreed("");
    setBreedInput("");
    setCoords(null);
    setRadiusKm(25);
    setShowSuggestions(false);
  }

  const hasActiveFilters = species || breed || coords;

  // Client-side filters
  const pets = allPets.filter((pet) => {
    if (coords) {
      const lat = pet.latitude ?? pet.Latitude;
      const lon = pet.longitude ?? pet.Longitude;
      if (lat == null || lon == null) return false;
      if (haversineKm(coords.latitude, coords.longitude, lat, lon) > radiusKm) return false;
    }
    if (breed) {
      const petBreed = (pet.breed || pet.Breed || "").toLowerCase();
      if (!petBreed.includes(breed.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="browse-layout container">

      {/* ── Filters sidebar ─────────────────────────────── */}
      <aside className="filters-panel">
        <div className="filters-head">
          <span className="filters-title">Filters</span>
          {hasActiveFilters && (
            <button className="filters-clear" onClick={clearAll}>Clear all</button>
          )}
        </div>

        {/* Species */}
        <div className="filter-group">
          <div className="filter-group-label">Species</div>
          <div className="filter-chips">
            {SPECIES.map((s) => (
              <button
                key={s}
                className={`filter-chip${species === s ? " active" : ""}`}
                onClick={() => setSpecies(species === s ? "" : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div className="filter-group">
          <div className="filter-group-label">Breed</div>
          <div className="breed-search" ref={breedRef}>
            <div className="breed-input-wrap">
              <input
                type="text"
                placeholder="e.g. Labrador, Persian…"
                value={breedInput}
                onChange={(e) => {
                  setBreedInput(e.target.value);
                  setBreed(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="filter-text-input"
              />
              {breedInput && (
                <button className="input-clear" onClick={() => { setBreed(""); setBreedInput(""); }} tabIndex={-1}>✕</button>
              )}
            </div>
            {showSuggestions && breedSuggestions.length > 0 && (
              <ul className="breed-suggestions">
                {breedSuggestions.map((b) => (
                  <li key={b} onMouseDown={() => selectBreed(b)}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="filter-group">
          <div className="filter-group-label">Location</div>
          <div className="filter-location-wrap">
            <LocationAutocomplete
              value={coords?.label || ""}
              placeholder="City or area…"
              onChange={(label, lat, lon) =>
                lat && lon ? setCoords({ latitude: lat, longitude: lon, label }) : setCoords(null)
              }
            />
            <button
              className={`locate-btn${coords ? " active" : ""}`}
              onClick={toggleMyLocation}
              title={coords ? "Clear location" : "Use my GPS"}
            >
              {locating ? "…" : "📍"}
            </button>
          </div>
        </div>

        {/* Radius — only when location is set */}
        {coords && (
          <div className="filter-group">
            <div className="filter-group-label">
              Radius
              <span className="filter-group-value">{radiusKm} km</span>
            </div>
            <div className="filter-chips">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  className={`filter-chip${radiusKm === r ? " active" : ""}`}
                  onClick={() => setRadiusKm(r)}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Results ─────────────────────────────────────── */}
      <div className="browse-results">
        <div className="browse-results-head">
          <h1>Find your next companion</h1>
          {!loading && (
            <span className="browse-count">
              {pets.length} {pets.length === 1 ? "pet" : "pets"} found
            </span>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Loading label="Fetching pets" />
        ) : pets.length === 0 ? (
          <div className="empty">
            <h3>No pets match</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="pet-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
