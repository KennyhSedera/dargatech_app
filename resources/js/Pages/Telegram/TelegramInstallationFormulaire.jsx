import FormulaireInstallation from "@/Components/installations/FormulaireInstallation";
import { addFavicon } from "@/constant";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const TelegramInstallationFormulaire = ({
    source,
    token_data,
    telegram_user_id,
}) => {
    useEffect(() => {
        addFavicon();
    }, []);

    const onCloseFormulaire = async (message) => {
        if (!message) {
            message = "❌ Enregistrement installation annulé";
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
                        message: "✅ " + message,
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
            <Head title="Formulaire Installation Telegram" />
            <FormulaireInstallation
                open={true}
                onCloseFormulaire={onCloseFormulaire}
                dataModify={{}}
                setOpen={() => {}}
                token_data={token_data}
            />
        </div>
    );
};

export default TelegramInstallationFormulaire;
