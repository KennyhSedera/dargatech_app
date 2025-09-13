import axios from "axios";

export const sendPdfByEmail = async (pdfData, email, telegram_chat_id) => {
    try {
        const response = await axios.post(
            "/api/paiement/generate-and-send-pdf",
            {
                email,
                data: pdfData,
                telegram_chat_id,
            }
        );

        if (response.data.success) {
            return response.data;
        }

        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'envoi du PDF:", error);
        alert(
            "Erreur lors de l'envoi du PDF: " +
                (error.response?.data?.message || error.message)
        );
        throw error;
    }
};
