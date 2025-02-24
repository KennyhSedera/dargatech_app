import { api } from "./api";

export const getmaintenances = async () => {
    try {
        const response = await api.get("/maintenance");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des maintenances", error);
        throw error;
    }
};

export const createmaintenances = async (data) => {
    try {
        const response = await api.post("/maintenance", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du maintenance", error);
        throw error;
    }
};

export const getmaintenance = async (id) => {
    try {
        const response = await api.get("/maintenance/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du maintenance", error);
        throw error;
    }
};

export const updatemaintenances = async (id, data) => {
    try {
        const response = await api.put(`/maintenance/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du maintenance", error);
        throw error;
    }
};

export const deletemaintenances = async (id) => {
    try {
        const response = await api.delete(`/maintenance/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du maintenance", error);
        throw error;
    }
};
