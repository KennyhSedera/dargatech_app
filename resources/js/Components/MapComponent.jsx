import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
    const position = [-21.4633161, 47.10792840348279]; // Latitude, Longitude (Ex: Fianarantsoa, Madagascar)

    return (
        <MapContainer center={position} zoom={13} className="leaflet-container mt-2">
            {/* Fond de carte OpenStreetMap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marqueur sur la position */}
            <Marker position={position}>
                <Popup>Campus Universitaire Andrainjato, Fianarantsoa</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
