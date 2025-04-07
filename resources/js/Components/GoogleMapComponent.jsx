import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React from "react";

export const GoogleMapComponent = ({ latitude, longitude }) => {
    const VOTRE_CLE_API = '';
    const mapContainerStyle = { width: "100%", height: "400px" };
    const center = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    return (
        <LoadScript googleMapsApiKey={VOTRE_CLE_API}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};