import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import FormulairePaiement from "../Paiement/FormulairePaiement";
import { addFavicon } from "@/constant";

const TelegramPaimentFormulaire = ({
    token_data,
    telegram_user_id,
    telegram_bot_username,
}) => {
    useEffect(() => {
        addFavicon();
    }, []);

    const handleTelegramGoback = async (message) => {
        if (!message) {
            message = "❌ Enregistrement paiement annulé";
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
            console.error("Error sending Telegram message:", error);
        }
    };

    return (
        <div>
            <Head title="Formulaire de paiement Telegram" />
            <FormulairePaiement
                token_data={token_data}
                telegramback={handleTelegramGoback}
            />
        </div>
    );
};

export default TelegramPaimentFormulaire;
