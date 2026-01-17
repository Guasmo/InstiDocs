import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import userService from '../service/userService';
import type { UserInterface, UpdateUserData } from '../interfaces/User';

interface UserContextType {
    user: UserInterface | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    updateUser: (data: UpdateUserData) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userId, isAuthenticated } = useAuthContext();
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserById(userId);
            setUser(response);
            setFetched(true);
        } catch (err: any) {
            setError(err.message || 'Error al obtener el usuario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateUser = useCallback(async (data: UpdateUserData) => {
        if (!userId) return { success: false, error: 'No user ID found' };

        try {
            setLoading(true);
            const response = await userService.updateUser(userId, data);
            setUser(response);
            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || 'Error al actualizar el usuario';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Reset state on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setUser(null);
            setFetched(false);
        }
    }, [isAuthenticated]);

    // Initial fetch
    useEffect(() => {
        if (isAuthenticated && userId && !fetched) {
            fetchUser();
        }
    }, [isAuthenticated, userId, fetched, fetchUser]);

    return (
        <UserContext.Provider value={{ user, loading, error, fetchUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
