import { api } from "./api";

export const getPartenaires = async () => {
    const response = await api.get("/partenaire");
    return response.data;
};

export const createPartenaire = async (data) => {
    const response = await api.post("/partenaire", data);
    return response.data;
};

export const getPartenaire = async (id) => {
    const response = await api.get(`/partenaire/${id}`);
    return response.data;
};

export const updatePartenaire = async (id, data) => {
    const response = await api.put(`/partenaire/${id}`, data);
    return response.data;
};

export const deletePartenaire = async (id) => {
    const response = await api.delete(`/partenaire/${id}`);
    return response.data;
};
