export interface UserInterface {
    id: string;
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateUserData {
    email?: string;
    fullName?: string;
}