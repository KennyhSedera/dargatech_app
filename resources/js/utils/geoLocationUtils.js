export async function getLocationDetails(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
                headers: {
                    "Accept-Language": "fr",
                },
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const address = data.address;

        if (!address) {
            throw new Error("Adresse introuvable");
        }

        const displayParts = data.display_name?.split(",") || [];
        const adresseSansPays = displayParts.slice(0, -1).join(",").trim();

        return {
            village:
                address.village ||
                address.town ||
                address.city ||
                address.hamlet ||
                "Non trouvé",
            adresse: adresseSansPays || "Adresse non trouvée",
            pays: address.country || "Pays non trouvé",
            region: address.state || address.region || "Région non trouvée",
            code_postal: address.postcode || "Code postal non trouvé",
            rue: address.road || address.street || "Rue non trouvée",
            code_pays: address.country_code
                ? address.country_code.toUpperCase()
                : "Code pays non trouvé",
        };
    } catch (error) {
        console.error("Erreur getLocationDetails:", error.message);
        return {
            village: "Erreur",
            adresse: "Erreur lors de la récupération",
            pays: "Erreur",
            region: "Erreur",
            code_postal: "Erreur",
            rue: "Erreur",
            code_pays: "Erreur",
        };
    }
}
