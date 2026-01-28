import api from './api';
import { updateUserApi, getUserByIdApi, getTeachersApi } from '../constants/endpoints';
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

    /**
     * Get all teachers
     */
    getTeachers: async (): Promise<UserInterface[]> => {
        const response = await api.get<UserInterface[]>(getTeachersApi);
        return response.data;
    },
};

export default userService;
