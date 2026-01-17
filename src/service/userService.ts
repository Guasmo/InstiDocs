import api from './api';
import { updateUserApi, getUserByIdApi } from '../constants/endpoints';
import type { UserInterface, UpdateUserData } from '../interfaces/User';

const userService = {
    /**
     * Get user by ID
     */
    getUserById: async (id: string): Promise<UserInterface> => {
        const response = await api.get<UserInterface>(`${getUserByIdApi}/${id}`);
        return response.data;
    },

    /**
     * Update user data
     */
    updateUser: async (id: string, data: UpdateUserData): Promise<UserInterface> => {
        const response = await api.patch<UserInterface>(`${updateUserApi}/${id}`, data);
        return response.data;
    },
};

export default userService;
