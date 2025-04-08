export const getCoordinates = async (city, country, village = '', quartier = '') => {
    if (!city || !country) {
        throw new Error("Veuillez entrer un pays et une ville.");
    }

    try {
        let searchQuery = `${city},${country}`;
        if (village) {
            searchQuery = `${village},${searchQuery}`;
        }
        if (quartier) {
            searchQuery = `${quartier},${searchQuery}`;
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
        );
        const data = await response.json();

        if (data.length === 0) {
            throw new Error("Lieu introuvable !");
        }

        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
        throw new Error("Erreur lors de la récupération des coordonnées.");
    }
};

export const getCountryBorders = async (country) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=geojson&country=${country}&polygon_geojson=1`
        );
        const data = await response.json();

        if (data.features.length === 0) {
            throw new Error("Impossible de charger les frontières du pays.");
        }

        const borders = data.features[0].geometry.coordinates;
        return borders.map((polygon) =>
            polygon.map((coord) => [coord[1], coord[0]]) // Inversion [lat, lon]
        );
    } catch (error) {
        throw new Error("Erreur lors de la récupération des frontières.");
    }
};
