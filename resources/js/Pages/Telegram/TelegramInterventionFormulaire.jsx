import { addFavicon } from "@/constant";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramInterventionFormulaire = () => {
    useEffect(() => {
        addFavicon();
    }, []);
    return (
        <div>
            <Head title="Formulaire Maintenance Telegram" />
        </div>
    );
};

export default TelegramInterventionFormulaire;
