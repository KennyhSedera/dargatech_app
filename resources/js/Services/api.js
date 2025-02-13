import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api" || "https://3a0f-102-68-193-202.ngrok-free.app/api",
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

export default api;
