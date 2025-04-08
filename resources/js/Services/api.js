import axios from "axios";

const url = "/api";

const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Si les données sont un FormData, supprimer le Content-Type pour laisser le navigateur le définir automatiquement
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

export { api, url };
