import api from "./api.ts";

const apiService = {

    getAll: async <T>(endpoint: string): Promise<T> => {
        const response = await api.get<T>(endpoint);
        return response.data;
    },

    getById: async <T>(endpoint: string, id: string): Promise<T> => {
        const response = await api.get<T>(`${endpoint}/${id}`);
        return response.data;
    },

    create: async <T>(endpoint: string, data: T): Promise<T> => {
        const response = await api.post<T>(endpoint, data);
        return response.data;
    },

    createReqRes: async <T extends object, D>(
        endpoint: string,
        data: T
    ): Promise<D> => {
        const response = await api.post<D>(endpoint, data);
        return response.data;
    },

    update: async <T>(endpoint: string, id: string, data?: T): Promise<T> => {
        const response = await api.patch<T>(`${endpoint}/${id}`, data);
        return response.data;
    },

    delete: async (endpoint: string, id: string): Promise<void> => {
        await api.delete(`${endpoint}/${id}`);
    },

    patch: async <T>(endpoint: string, data?: any): Promise<T> => {
        const response = await api.patch<T>(endpoint, data);
        return response.data;
    },

    // Métodos específicos para upload de imágenes
    uploadImage: async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteImage: async (filename: string): Promise<void> => {
        await api.delete(`/upload/image/${filename}`);
    },
};

export default apiService;