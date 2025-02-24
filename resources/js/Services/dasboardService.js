import { api } from "./api";

export const getCount = async () => {
    try {
        const response = await api.get("/dashboard/count");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des counts", error);
        throw error;
    }
}
