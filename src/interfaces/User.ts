export interface UserInterface {
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface UpdateUserData {
    email?: string;
    fullName?: string;
}