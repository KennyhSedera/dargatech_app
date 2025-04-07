import { useState, useEffect } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapUpdater = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom);
    }, [position, zoom, map]);
    return null;
};

const RoutingMachine = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(start), L.latLng(end)],
            routeWhileDragging: true,
            show: false,
            lineOptions: {
                styles: [{ color: "blue", weight: 4 }],
            },
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [start, end, map]);

    return null;
};

export const GeolocationComponent = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        city: "Chargement...",
    });
    const [error, setError] = useState(null);
    const [position, setPosition] = useState([48.8566, 2.3522]);
    const [zoom, setZoom] = useState(13);
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        if ("geolocation" in navigator) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    setZoom(18);
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const cityName = data.address?.city || data.address?.town || data.address?.village || "Ville inconnue";
                        setLocation({ latitude, longitude, city: cityName });
                    } catch (error) {
                        console.error("Erreur récupération ville :", error);
                        setError("Impossible de récupérer le nom de la ville.");
                    }
                    setLoading(false);
                },
                (error) => {
                    setError("Impossible de récupérer votre position.");
                    console.error(error);
                    setLoading(false);
                }
            );
        } else {
            setError("La géolocalisation n'est pas prise en charge par votre navigateur.");
        }
    };

    return (
        <div>
            <h2>Votre position</h2>
            {location.latitude && location.longitude ? (
                <p>
                    <strong>Latitude :</strong> {location.latitude} <br />
                    <strong>Longitude :</strong> {location.longitude} <br />
                    <strong>Ville :</strong> {loading ? "Chargement..." : location.city}
                </p>
            ) : (
                <p>Aucune donnée disponible</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={getLocation}>{loading ? "Chargement..." : "Obtenir ma position"}</button>

            <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <MapUpdater position={position} zoom={zoom} />
                <Marker position={position}>
                    <Popup>{location.city}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

const countriesGeoJSON = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

export const GeolocationMultipleComponents = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState([
        { lat: 48.8566, lon: 2.3522, city: "Paris", country: "France" },
        { lat: 45.764, lon: 4.8357, city: "Lyon", country: "France" },
        { lat: 43.6043, lon: 1.4437, city: "Toulouse", country: "France" },
    ]);
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch(countriesGeoJSON)
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Erreur chargement des frontières:", err));
    }, []);

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    const addCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const cityName = data.address?.city || data.address?.town || data.address?.village || "Lieu inconnu";
                        const countryName = data.address?.country || "Pays inconnu";

                        setPositions([...positions, { lat: latitude, lon: longitude, city: cityName, country: countryName }]);
                    } catch (error) {
                        console.error("Erreur récupération ville :", error);
                        setError("Impossible de récupérer le nom de la ville.");
                    }
                    setLoading(false);
                },
                (error) => {
                    setError("Impossible de récupérer votre position.");
                    console.error(error);
                    setLoading(false);
                }
            );
        } else {
            setError("La géolocalisation n'est pas prise en charge par votre navigateur.");
        }
    };

    return (
        <div>
            <h2>Carte des Pays et Villes</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={addCurrentLocation}>{loading ? "Chargement..." : "Ajouter ma position"}</button>

            <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={() => ({
                            fillColor: getRandomColor(),
                            weight: 1,
                            opacity: 1,
                            color: "black",
                            fillOpacity: 0.3,
                        })}
                    />
                )}

                {positions.map(({ lat, lon, city, country }, index) => (
                    <Marker key={index} position={[lat, lon]}>
                        <Popup>
                            <strong>{city}</strong>, {country}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};


export const GeolocationSearchComponent = () => {
    const [destination, setDestination] = useState("");
    const [route, setRoute] = useState(null);
    const [position] = useState([48.8566, 2.3522]);

    const calculateRoute = async () => {
        if (!destination) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destination}`);
            const data = await response.json();

            if (data.length === 0) {
                alert("Adresse introuvable !");
                return;
            }

            setRoute([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } catch (error) {
            console.error("Erreur lors de la recherche d'adresse :", error);
            alert("Erreur lors de la récupération des coordonnées.");
        }
    };

    return (
        <div>
            <h2>Itinéraire</h2>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Entrer une adresse..." />
            <button onClick={calculateRoute}>Tracer l'itinéraire</button>

            <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                {route && <RoutingMachine start={position} end={route} />}
            </MapContainer>
        </div>
    );
};
