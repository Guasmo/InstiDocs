import { useEffect, useState } from "react";

import { useAuthContext } from "./useAuthContext";
import apiService from "../service/apiService";
import type { UpdateUserData, UserInterface } from "../interfaces/User";
import { getUserByIdApi, updateUserApi } from "../constants/endpoints";


export const useUser = () => {
    const { userId } = useAuthContext();

    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUser = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!userId) {
                console.warn("No user ID found");
                return;
            }

            const response = await apiService.getById<UserInterface>(getUserByIdApi, userId);

            setUser(response);

        } catch (err: any) {
            const errorMessage = err.message || "Error al obtener el usuario";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data: UpdateUserData): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!userId) {
                return { success: false, error: 'No user ID found' };
            }

            const response = await apiService.patch<UserInterface>(updateUserApi + `/${userId}`, data);

            setUser(response);
            return { success: true };

        } catch (err: any) {
            const errorMessage = err.message || "Error al actualizar el usuario";
            return { success: false, error: errorMessage };
        }
    };



    useEffect(() => {
        if (userId) {
            getUser();
        }
    }, [userId]);

    return {
        user,
        loading,
        error,
        getUser,
        updateUser,
    };
};