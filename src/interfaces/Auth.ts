import type { UUID } from "../types/authTypes";

export interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean }>;
    register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

export interface AuthResponse {
    email: string;
    password: string;
    userId: UUID;
    accessToken: string;
    refreshToken: string;
}