export interface UserInterface {
    id: string;
    email: string;
    password?: string;
    fullName: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    isActive?: boolean;
}

export interface UpdateUserData {
    email?: string;
    fullName?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
    isActive?: boolean;
    password?: string;
}

export interface CreateUserData {
    email: string;
    password: string;
    fullName: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}