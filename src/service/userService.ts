import api from './api';
import { updateUserApi, getUserByIdApi, getTeachersApi, createAdminUserApi, getAllUsersApi, deleteUserApi } from '../constants/endpoints';
import type { UserInterface, UpdateUserData, CreateUserData } from '../interfaces/User';

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

    /**
     * Get all users (Admin)
     */
    getAllUsers: async (search?: string): Promise<UserInterface[]> => {
        const response = await api.get<UserInterface[]>(getAllUsersApi, {
            params: { search }
        });
        return response.data;
    },

    /**
     * Create user (Admin)
     */
    createUser: async (data: CreateUserData): Promise<UserInterface> => {
        const response = await api.post<UserInterface>(createAdminUserApi, data);
        return response.data;
    },

    /**
     * Delete user (Soft delete)
     */
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`${deleteUserApi}/${id}`);
    }
};

export default userService;
