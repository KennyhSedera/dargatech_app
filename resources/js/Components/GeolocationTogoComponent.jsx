import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getinstallations } from "@/Services/installationService";
import { marker } from "@/constant";

// Icône personnalisée
const customIcon2 = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Icône personnalisée
const customIcon = new L.Icon({
  iconUrl: marker,
  iconSize: [45, 45],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
};

export const GeolocationTogoComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [clickedPosition, setClickedPosition] = useState(null);

  const findClient = async () => {
    const {data} = await getinstallations();
    
    const inst = data.map((el) => ({
      name: `${el.code_installation} (${el.numero_serie})`,
      lon: el.localisation.longitude,
      lat: el.localisation.latitude,
    }));
    setNeighborhoods(inst);
  };

  useEffect(() => {
    findClient();
  
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        const togo = data.features.find(
          (feature) => feature.properties.ADMIN === "Togo"
        );
        setGeoData(togo);
      })
      .catch((err) =>
        console.error("Erreur chargement des frontières du Togo :", err)
      );
  }, []);  

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="font-bold text-lg pb-2">Carte pour localisation des maraîchers (Togo)</h2>
      <MapContainer center={[8.6195, 0.8248]} zoom={7} style={{ height: "500px", width: "100%", borderRadius: 6 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            style={{
              weight: 2,
              color: "black",
              fillOpacity: 0,
              zIndex: 80,
            }}
          />
        )}

        {neighborhoods.map((q, index) => (
          <Marker key={index} position={[q.lat, q.lon]} icon={customIcon}>
            <Popup>{q.name}</Popup>
          </Marker>
        ))}

        {clickedPosition && (
          <Marker position={[clickedPosition.lat, clickedPosition.lng]} icon={customIcon2}>
            <Popup>Position sélectionnée : {clickedPosition.lat}, {clickedPosition.lng}</Popup>
          </Marker>
        )}

        <ClickHandler onClick={(lat, lng) => setClickedPosition({ lat, lng })} />
      </MapContainer>
    </div>
  );
};
