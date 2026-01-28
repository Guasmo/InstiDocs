import React, { useState, useEffect } from 'react';

import { useUser } from '../hooks/useUser';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionCard } from '../components/shared/SectionCard';
import { courseService } from '../service/courseService';
import type { Course } from '../interfaces/Course';
import CourseCard from '../components/CourseCard';
import LoadingFallback from '../components/shared/Loading';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            <PageHeader
                title={`Bienvenido de nuevo, ${user?.fullName || 'Usuario'}!`}
                description="Aquí tienes un resumen de tus documentos institucionales."
            />

            {/* Courses Section */}
            <SectionCard title="Mis Cursos">
                {coursesLoading ? (
                    <LoadingFallback />
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Cursos no disponibles
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

export default Dashboard;
