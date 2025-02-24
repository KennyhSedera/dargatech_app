import { api } from "./api";

export const getType_paiements = async () => {
    try {
        const response = await api.get("/type_paiement");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des type paiements", error);
        throw error;
    }
};

export const createType_paiement = async (data) => {
    try {
        const response = await api.post("/type_paiement", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du type paiement", error);
        throw error;
    }
};

export const getType_paiement = async (id) => {
    try {
        const response = await api.get("/type_paiement/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du type paiement", error);
        throw error;
    }
};

export const updateType_paiement = async (id, data) => {
    try {
        const response = await api.put(`/type_paiement/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du type paiement", error);
        throw error;
    }
};

export const deleteType_paiement = async (id) => {
    try {
        const response = await api.delete(`/type_paiement/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du type paiement", error);
        throw error;
    }
};
