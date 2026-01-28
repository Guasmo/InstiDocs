import type { UserInterface as User } from './User';
import type { Document } from './Document';

export interface Course {
    id: string;
    name: string;
    description?: string;
    teacherId: string;
    teacher?: User;
    students?: User[];
    documents?: Document[];
    createdAt: string;
    updatedAt: string;
    _count?: {
        students: number;
        documents: number;
    };
}

export interface CreateCourseDto {
    name: string;
    description?: string;
    teacherId: string;
}

export interface AddStudentDto {
    email: string;
}
