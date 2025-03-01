import { api } from "./api";

export const getTechniciens = async () => {
    try {
        const response = await api.get("/technicien");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des techniciens", error);
        throw error;
    }
};

export const createTechniciens = async (data) => {
    try {
        const response = await api.post("/technicien", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du technicien", error);
        throw error;
    }
};

export const getTechnicien = async (id) => {
    try {
        const response = await api.get("/technicien/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du technicien", error);
        throw error;
    }
};

export const getTechnicienbyUser = async (id) => {
    try {
        const response = await api.get("/technicien/by/user" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du technicien", error);
        throw error;
    }
};


export const updateTechniciens = async (id, data) => {
    try {
        const response = await api.put(`/technicien/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du technicien", error);
        throw error;
    }
};

export const deleteTechniciens = async (id) => {
    try {
        const response = await api.delete(`/technicien/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du technicien", error);
        throw error;
    }
};
