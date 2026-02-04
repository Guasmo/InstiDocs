import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { courseService } from '../service/courseService';
import userService from '../service/userService';
import { useNavigate } from 'react-router-dom';
import type { UserInterface } from '../interfaces/User';

const CreateCoursePage: React.FC = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState<'MATUTINA' | 'VESPERTINA' | 'NOCTURNA'>('MATUTINA');
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 1);
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState<UserInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not admin
    useEffect(() => {
        if (user) {
            if (user.role !== 'ADMIN') {
                navigate('/');
            } else {
                fetchTeachers();
            }
        }
    }, [user, navigate]);

    const fetchTeachers = async () => {
        try {
            const data = await userService.getTeachers();
            setTeachers(data);
        } catch (err: any) {
            console.error('Error fetching teachers:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const finalTeacherId = user.role === 'ADMIN' ? teacherId : user.id;

            if (!finalTeacherId) {
                setError('Please select a teacher');
                setLoading(false);
                return;
            }

            await courseService.createCourse({
                name,
                description,
                section,
                startYear,
                endYear,
                teacherId: finalTeacherId
            });
            navigate('/courses');
        } catch (err: any) {
            setError(err.message || 'Error creating course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Course</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="section" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                            Sección
                        </label>
                        <select
                            id="section"
                            value={section}
                            onChange={(e) => setSection(e.target.value as any)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium cursor-pointer"
                            required
                        >
                            <option value="MATUTINA">Matutina</option>
                            <option value="VESPERTINA">Vespertina</option>
                            <option value="NOCTURNA">Nocturna</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Año Inicio
                        </label>
                        <input
                            type="number"
                            id="startYear"
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value))}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Año Fin
                        </label>
                        <input
                            type="number"
                            id="endYear"
                            value={endYear}
                            onChange={(e) => setEndYear(parseInt(e.target.value))}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                    />
                </div>

                {user?.role === 'ADMIN' && (
                    <div>
                        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Teacher
                        </label>
                        <select
                            id="teacherId"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select a teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.fullName} ({teacher.email})
                                </option>
                            ))}
                        </select>
                    </div>
                )}


                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/courses')}
                        className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm shadow-blue-200"
                    >
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCoursePage;
