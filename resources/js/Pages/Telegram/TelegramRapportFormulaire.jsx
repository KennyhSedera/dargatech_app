import { addFavicon } from "@/constant";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramRapportFormulaire = () => {
    useEffect(() => {
        addFavicon();
    }, []);
    return (
        <div>
            <Head title="Formulaire Rapport Maintenance Telegram" />
        </div>
    );
};

export default TelegramRapportFormulaire;
