import React, { useState } from 'react';
import type { Course } from '../interfaces/Course';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

interface CourseCardProps {
    course: Course;
    onDelete?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete }) => {
    const { user } = useUserContext();
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking on menu or button or link
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
            return;
        }
        navigate(`/courses/${course.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full relative cursor-pointer"
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Header with Image and Badge */}
            <div className="relative h-32 overflow-hidden">
                <img
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Badge/Tag */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-teal-700/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider w-fit">
                        {course.name.split(' ')[0]} NIVEL
                    </span>
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider w-fit">
                        {course.section}
                    </span>
                </div>

            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-4">
                    <div className="hover:underline decoration-blue-600 underline-offset-4">
                        <h3 className="text-base font-bold text-teal-800 line-clamp-2 leading-tight uppercase">
                            {course.name}
                        </h3>
                    </div>
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
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {showMenu && user?.role === 'ADMIN' && onDelete && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        onDelete(course.id);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    <span>Eliminar Curso</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
