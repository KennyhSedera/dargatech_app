import { api } from "./api";

export const getPaiements = async () => {
    try {
        const response = await api.get("/paiement");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des paiements", error);
        throw error;
    }
};

export const getLastPaiements = async () => {
    try {
        const response = await api.get("/paiement/last/id");
        return response.data;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du dernier paiement",
            error
        );
        throw error;
    }
};

export const createPaiement = async (data) => {
    try {
        const response = await api.post("/paiement", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du paiement", error);
        throw error;
    }
};

export const getPaiement = async (id) => {
    try {
        const response = await api.get("/paiement/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du paiement", error);
        throw error;
    }
};

export const updatePaiement = async (id, data) => {
    try {
        const response = await api.put(`/paiement/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du paiement", error);
        throw error;
    }
};

export const deletePaiement = async (id) => {
    try {
        const response = await api.delete(`/paiement/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du paiement", error);
        throw error;
    }
};

export const getLastEcheanceClient = async (id) => {
    try {
        const response = await api.get(`/paiement/echeance/client/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du paiement", error);
        throw error;
    }
};
