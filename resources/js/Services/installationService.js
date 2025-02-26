import { api } from "./api";

export const getinstallations = async () => {
    try {
        const response = await api.get("/installation");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des installations", error);
        throw error;
    }
};

export const getinstallationsenpanne = async () => {
    try {
        const response = await api.get("/installation/en/panne");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des installations", error);
        throw error;
    }
};

export const createinstallations = async (data) => {
    try {
        const response = await api.post("/installation", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du installation", error);
        throw error;
    }
};

export const getinstallation = async (id) => {
    try {
        const response = await api.get("/installation/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du installation", error);
        throw error;
    }
};

export const updateinstallations = async (id, data) => {
    try {
        const response = await api.put(`/installation/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du installation", error);
        throw error;
    }
};

export const deleteinstallations = async (id) => {
    try {
        const response = await api.delete(`/installation/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du installation", error);
        throw error;
    }
};
