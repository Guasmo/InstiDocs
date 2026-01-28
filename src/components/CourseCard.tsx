import React from 'react';
import type { Course } from '../interfaces/Course';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full">
            {/* Header with Image and Badge */}
            <div className="relative h-32 overflow-hidden">
                <img
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Badge/Tag */}
                <div className="absolute top-3 left-3">
                    <span className="bg-teal-700/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {course.name.split(' ')[0]} NIVEL
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-4">
                    <Link to={`/courses/${course.id}`} className="hover:underline decoration-blue-600 underline-offset-4">
                        <h3 className="text-base font-bold text-teal-800 line-clamp-2 leading-tight uppercase">
                            {course.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-400">
                                {course.teacher?.fullName?.[0] || 'T'}
                            </span>
                        </div>
                        <span className="font-medium truncate max-w-[120px]">
                            {course.teacher?.fullName || 'Profesor'}
                        </span>
                    </div>

                    {/* Options Button */}
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
