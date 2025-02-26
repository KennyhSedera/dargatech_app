import { api } from "./api";

export const getClients = async () => {
    try {
        const response = await api.get("/clients");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        throw error;
    }
};

export const getClientInstalations = async () => {
    try {
        const response = await api.get("/clients/avec/installation");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        throw error;
    }
};

export const createClients = async (data) => {
    try {
        const response = await api.post("/clients", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du client", error);
        throw error;
    }
};

export const getClient = async (id) => {
    try {
        const response = await api.get("/clients/" + id);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du client", error);
        throw error;
    }
};

export const updateClients = async (id, data) => {
    try {
        const response = await api.put(`/clients/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du client", error);
        throw error;
    }
};

export const deleteClients = async (id) => {
    try {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du client", error);
        throw error;
    }
};
