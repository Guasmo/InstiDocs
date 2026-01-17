import { type FC, type ReactNode, useState, useEffect } from 'react';

import Cookie from 'js-cookie';

import apiService from "../service/apiService.ts";
import type { LoginParams } from '../types/authTypes.ts';
import { loginApi, registerApi } from '../constants/endpoints.ts';
import { AuthContext } from '../hooks/useAuthContext.ts';
import type { AuthResponse } from '../interfaces/Auth.ts';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookie.get('accessToken');
            const id = Cookie.get('userId');
            if (token && id) {
                setIsAuthenticated(true);
                setAccessToken(token);
                setUserId(id);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const data = { email: email, password: password }
            const responseData = await apiService.createReqRes<LoginParams, AuthResponse>(loginApi, data)
            const { accessToken, refreshToken, userId } = responseData;
            const accessExpirationDate = new Date();
            const refreshExpirationDate = new Date();
            accessExpirationDate.setDate(accessExpirationDate.getDate() + 2);
            refreshExpirationDate.setDate(refreshExpirationDate.getDate() + 7);

            Cookie.set('accessToken', accessToken, { expires: accessExpirationDate });
            Cookie.set('refreshToken', refreshToken, { expires: refreshExpirationDate });
            Cookie.set('userId', userId, { expires: refreshExpirationDate });

            setIsAuthenticated(true);
            setUserId(userId);
            setAccessToken(accessToken);

            return { success: true };

        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Error in server response:', error.response.data);
            } else if (error.request) {
                console.error('No response from server:', error.request);
            } else {
                console.error('Error while setting up the request', error.message);
            }

            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        try {
            setLoading(true);
            const data = { fullName, email, password };
            await apiService.createReqRes(registerApi, data);
            return { success: true };
        } catch (error: any) {
            console.error('Register error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al registrarse';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            setLoading(true);
            Cookie.remove('accessToken');
            Cookie.remove('refreshToken');
            Cookie.remove('userId');
            setIsAuthenticated(false);
            setUserId(null);
            setAccessToken(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, accessToken, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};