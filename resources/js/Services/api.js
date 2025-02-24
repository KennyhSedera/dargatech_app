import axios from "axios";

const url = "http://localhost:8000/api" || "https://dargatech.crm.railway.app/api" || "https://53ae-102-68-193-112.ngrok-free.app/api";

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
        return config;
    },
    (error) => Promise.reject(error)
);

export { api, url };
