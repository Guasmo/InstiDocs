import api from './api';
import type { Course, CreateCourseDto } from '../interfaces/Course';
import { coursesApi } from '../constants/endpoints';

export const courseService = {
    getAllCourses: async (): Promise<Course[]> => {
        const response = await api.get<Course[]>(coursesApi);
        return response.data;
    },

    getCourseById: async (id: string): Promise<Course> => {
        const response = await api.get<Course>(`${coursesApi}/${id}`);
        return response.data;
    },

    createCourse: async (courseData: CreateCourseDto): Promise<Course> => {
        const response = await api.post<Course>(coursesApi, courseData);
        return response.data;
    },

    addStudentToCourse: async (courseId: string, email: string): Promise<void> => {
        await api.post(`${coursesApi}/${courseId}/students`, { email });
    },

    uploadFile: async (courseId: string, file: File, title: string, description: string, authors: string): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', title);
        formData.append('description', description);
        formData.append('authors', authors);
        await api.post(`${coursesApi}/${courseId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteCourse: async (id: string): Promise<void> => {
        await api.delete(`${coursesApi}/${id}`);
    },

    updateCourse: async (id: string, courseData: Partial<CreateCourseDto>): Promise<Course> => {
        const response = await api.patch<Course>(`${coursesApi}/${id}`, courseData);
        return response.data;
    },
};
