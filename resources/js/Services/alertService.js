import { api } from "./api";

export const getAlerts = async () => {
    try {
        const response = await api.get("/alert");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des alert", error);
        throw error;
    }
};

export const createAlert = async (data) => {
    try {
        const response = await api.post("/alert", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du alert", error);
        throw error;
    }
};

export const getAlert = async (id) => {
    try {
        const response = await api.get("/alert/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du alert", error);
        throw error;
    }
};

export const updateAlert = async (id, data) => {
    try {
        const response = await api.put(`/alert/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du alert", error);
        throw error;
    }
};

export const deleteAlert = async (id) => {
    try {
        const response = await api.delete(`/alert/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du alert", error);
        throw error;
    }
};
