import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../service/courseService';
import type { Course } from '../interfaces/Course';
import CourseCard from '../components/CourseCard';
import { useUserContext } from '../context/UserContext';
import LoadingFallback from '../components/shared/Loading';
import { RefreshButton } from '../components/shared/RefreshButton';
import { PageHeader } from '../components/shared/PageHeader';

import notificationService from '../service/notificationService';

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            try {
                await courseService.deleteCourse(id);
                notificationService.success('Curso eliminado correctamente');
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                notificationService.error('Error al eliminar el curso');
            }
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    if (loading) {
        return <LoadingFallback />;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <PageHeader
                    title="Mis Cursos"
                    description="Gestiona y accede a todos tus cursos institucionales."
                />
                <div className="flex items-center gap-3">
                    <RefreshButton onRefresh={fetchCourses} />
                    {user?.role === 'ADMIN' && (
                        <Link
                            to="/create-course"
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                        >
                            Crear Nuevo Curso
                        </Link>
                    )}
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-500 font-medium">No tienes cursos disponibles aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} onDelete={() => handleDeleteCourse(course.id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
