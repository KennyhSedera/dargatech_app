import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCoordinates, getCountryBorders } from "./localisation";

const MapUpdater = ({ position, zoom }) => {
    const map = useMap();
    map.setView(position, zoom);
    return null;
};

const LocationSearch = () => {
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [position, setPosition] = useState([48.8566, 2.3522]); // Paris par défaut
    const [zoom, setZoom] = useState(5);
    const [error, setError] = useState(null);
    const [countryBorders, setCountryBorders] = useState(null);

    const handleSearch = async () => {
        try {
            const { lat, lon } = await getCoordinates(city, country);
            setPosition([lat, lon]);
            setZoom(6);
            setError(null);

            const borders = await getCountryBorders(country);
            setCountryBorders(borders);
        } catch (err) {
            setError(err.message);
            setCountryBorders(null);
        }
    };

    return (
        <div>
            <h2>Recherche de localisation</h2>
            <input
                type="text"
                placeholder="Nom du pays"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
                className="bg-transparent"
            />
            <input
                type="text"
                placeholder="Nom de la ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
                className="bg-transparent"
            />
            <button onClick={handleSearch}>Rechercher</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <MapContainer center={position} zoom={zoom} className="leaflet-container" style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapUpdater position={position} zoom={zoom} />

                <Marker position={position}>
                    <Popup>{city ? `${city}, ${country}` : "Lieu inconnu"}</Popup>
                </Marker>

                {countryBorders && (
                    <Polygon
                        positions={countryBorders}
                        pathOptions={{ color: "red", weight: 2, fillOpacity: 0.2 }}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LocationSearch;
