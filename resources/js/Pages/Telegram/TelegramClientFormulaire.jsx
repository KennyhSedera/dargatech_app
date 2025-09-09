import FormulaireClient from "@/Components/clients/FormulaireClient";
import { addFavicon, logo } from "@/constant";
import { Head, router } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramClientFormulaire = ({ source, token_data, telegram_user_id }) => {
    useEffect(() => {
        addFavicon();
    }, []);

    const onCloseFormulaire = async (message) => {
        if (!message) {
            message = "❌ Enregistrement client annulé";
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
                        message: "✅ Maraicher ou" + message,
                    }),
                }
            );

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "https://t.me/dargatech_bot";
                }, 500);
            } else {
                const errorText = await response.text();
                console.error(
                    "Erreur HTTP:",
                    response.status,
                    response.statusText,
                    errorText
                );

                alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert(
                "Erreur de connexion. Veuillez vérifier votre connexion internet."
            );
        }
    };

    return (
        <div>
            <Head title="Formulaire Clent Telegram" />
            <FormulaireClient
                onCloseFormulaire={onCloseFormulaire}
                open={true}
                dataModify={{}}
                setOpen={() => {}}
                token_data={token_data}
            />
        </div>
    );
};

export default TelegramClientFormulaire;
