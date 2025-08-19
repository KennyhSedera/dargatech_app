import FormulaireClient from "@/Components/clients/FormulaireClient";
import { addFavicon, logo } from "@/constant";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramClientFormulaire = () => {
    useEffect(() => {
        addFavicon();
    }, []);

    return (
        <div>
            <Head title="Formulaire Clent Telegram" />
            <FormulaireClient open={true} />
        </div>
    );
};

export default TelegramClientFormulaire;
