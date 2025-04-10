import { api } from "./api";

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (passwordData) => {
    try {
        const response = await api.put('/password', passwordData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePhoto = async (formData) => {
    try {
        const response = await api.post('/profile/photo', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAccount = async (password) => {
    try {
        const response = await api.delete('/profile', { data: { password } });
        return response.data;
    } catch (error) {
        throw error;
    }
};
