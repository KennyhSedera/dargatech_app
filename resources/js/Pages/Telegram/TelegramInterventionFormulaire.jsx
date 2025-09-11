import FormulaireMaintenance from "@/Components/maintenances/FormulaireMaintenance";
import { addFavicon } from "@/constant";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramInterventionFormulaire = ({
    token_data,
    telegram_user_id,
    telegram_bot_username,
}) => {
    useEffect(() => {
        addFavicon();
    }, []);

    const onCloseFormulaire = async (message) => {
        if (!message) {
            message = "❌ Enregistrement maintenance annulé";
        } else {
            message = "✅ " + message;
        }

        try {
            const response = await fetch(
                `/api/telegram/send-message/${telegram_user_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: message,
                    }),
                }
            );

            if (response.ok) {
                setTimeout(() => {
                    window.location.href =
                        "https://t.me/" + telegram_bot_username;
                }, 500);
            } else {
                const errorText = await response.text();
                console.error("Erreur HTTP:", response.status, errorText);
            }
        } catch (error) {
            if (error.response) {
                const errorText = await error.response.text();
                console.error("Erreur HTTP:", error.response.status, errorText);
            } else {
                console.error("Erreur:", error);
            }
        }
    };
    return (
        <div>
            <Head title="Formulaire Maintenance Telegram" />
            <FormulaireMaintenance
                open={true}
                onCloseFormulaire={onCloseFormulaire}
                dataModify={{}}
                setOpen={() => {}}
                token_data={token_data}
            />
        </div>
    );
};

export default TelegramInterventionFormulaire;
