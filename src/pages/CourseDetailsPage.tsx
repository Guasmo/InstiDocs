import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { courseService } from '../service/courseService';
import documentService from '../service/documentService';
import type { Course } from '../interfaces/Course';
import { useUserContext } from '../context/UserContext';
import { UploadSection } from '../components/dashboard/UploadSection';
import LoadingFallback from '../components/shared/Loading';
import { RefreshButton } from '../components/shared/RefreshButton';
import { formatDate, normalizeText } from '../utils/formatters';
import notificationService from '../service/notificationService';


const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useUserContext();
    const [emailToAdd, setEmailToAdd] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'documents' | 'students'>('documents');

    const [showAddStudent, setShowAddStudent] = useState(false);

    const [viewMode, setViewMode] = useState<'subject' | 'user'>('subject');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        section: '',
        startYear: 2025,
        endYear: 2026
    });

    const fetchCourse = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await courseService.getCourseById(id);
            setCourse(data);
            setEditForm({
                name: data.name,
                description: data.description || '',
                section: data.section,
                startYear: data.startYear,
                endYear: data.endYear
            });
        } catch (error) {
            console.error('Error fetching course:', error);
            notificationService.error('Error al cargar detalles del curso');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCourse();
    }, [id]);

    const handleUpdateCourse = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!id) return;

        try {
            await courseService.updateCourse(id, editForm as any);
            notificationService.success('Curso actualizado correctamente');
            setIsEditing(false);
            fetchCourse();
        } catch (error) {
            console.error('Error updating course:', error);
            notificationService.error('Error al actualizar el curso');
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!id || !emailToAdd) return;

        try {
            setAddingStudent(true);
            await courseService.addStudentToCourse(id, emailToAdd);
            notificationService.success('Estudiante agregado correctamente');
            setEmailToAdd('');
            fetchCourse(); // Refresh to update student count
        } catch (error) {
            console.error('Error adding student:', error);
            notificationService.error('Error al agregar estudiante');
        } finally {
            setAddingStudent(false);
        }
    };

    const handleUpload = async (file: File, title: string, description: string, authors: string) => {
        if (!id) return;
        try {
            setUploading(true);
            await courseService.uploadFile(id, file, title, description, authors);
            await fetchCourse(); // Refresh to show new file
            notificationService.success('Archivo subido correctamente');
        } catch (error) {
            console.error('Error uploading file:', error);
            notificationService.error('Error al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este documento?')) return;

        try {
            await documentService.deleteDocument(docId);
            notificationService.success('Documento eliminado');
            fetchCourse();
        } catch (error) {
            console.error('Error deleting document:', error);
            notificationService.error('No tienes permisos para eliminar este documento');
        }
    };


    if (loading) return <LoadingFallback />;
    if (!course) return <div className="text-center py-12">Course not found</div>;

    const documentsByUser = course.documents?.reduce((acc, doc) => {
        const email = doc.user?.email || 'Unknown';
        if (!acc[email]) {
            acc[email] = [];
        }
        acc[email].push(doc);
        return acc;
    }, {} as Record<string, Course['documents']>);

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-4 max-w-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight w-full bg-blue-50/50 border-b-2 border-blue-500 focus:outline-none px-2 rounded-t-lg"
                                placeholder="Nombre del curso"
                                autoFocus
                            />
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Sección:</span>
                                    <select
                                        value={editForm.section}
                                        onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                                        className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer appearance-none"
                                    >
                                        <option value="MATUTINA">MATUTINA</option>
                                        <option value="VESPERTINA">VESPERTINA</option>
                                        <option value="NOCTURNA">NOCTURNA</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Periodo:</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={editForm.startYear}
                                            onChange={(e) => setEditForm({ ...editForm, startYear: parseInt(e.target.value) || 0 })}
                                            className="bg-green-100 text-green-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg w-16 focus:ring-2 focus:ring-green-400 outline-none"
                                        />
                                        <span className="text-gray-400 text-xs">-</span>
                                        <input
                                            type="number"
                                            value={editForm.endYear}
                                            onChange={(e) => setEditForm({ ...editForm, endYear: parseInt(e.target.value) || 0 })}
                                            className="bg-green-100 text-green-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg w-16 focus:ring-2 focus:ring-green-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="text-gray-600 text-lg mb-4 w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                placeholder="Descripción del curso..."
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{course.name}</h1>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                                    {course.section}
                                </span>
                                {course.startYear && course.endYear && (
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        Periodo: {course.startYear} - {course.endYear}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-lg mb-4 max-w-2xl">{course.description}</p>
                        </>
                    )}

                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profesor: <span className="text-gray-900">{course.teacher?.fullName}</span></span>
                    </div>
                </div>


                <div className="flex items-center gap-3 shrink-0">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleUpdateCourse(null as any)}
                                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
                            >
                                Guardar
                            </button>
                        </div>
                    ) : (
                        <>
                            <RefreshButton onRefresh={fetchCourse} />

                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-gray-200 shadow-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Editar</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-8 px-2">
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'documents'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Documentos
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {course.documents?.length || 0}
                    </span>
                    {activeTab === 'documents' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'students'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Estudiantes
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {course.students?.length || 0}
                    </span>
                    {activeTab === 'students' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                </button>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {activeTab === 'documents' ? (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Documentos del Curso</h2>
                                <p className="text-gray-500 text-sm mt-1">Gestiona y visualiza los archivos compartidos.</p>
                            </div>
                            <UploadSection onUpload={handleUpload} uploading={uploading} defaultAuthor={user?.fullName || ''} />
                        </div>

                        {((user?.role === 'TEACHER' && course.teacherId === user.id) || user?.role === 'ADMIN') && (
                            <div className="flex gap-3 mb-8 p-1 bg-gray-50 rounded-xl w-fit">
                                <button
                                    onClick={() => setViewMode('subject')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'subject'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Vista General
                                </button>
                                <button
                                    onClick={() => setViewMode('user')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'user'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Por Usuario
                                </button>
                            </div>
                        )}

                        {viewMode === 'user' && documentsByUser ? (
                            <div className="space-y-8">
                                {Object.entries(documentsByUser).map(([email, docs]) => (
                                    <div key={email} className="bg-gray-50 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-xs">{email[0].toUpperCase()}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-900">{email}</h3>
                                        </div>
                                        <div className="grid gap-3">
                                            {docs?.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    onClick={() => window.open(doc.url, '_blank')}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer gap-4"
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                        <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg shrink-0">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{normalizeText(doc.name)}</h4>
                                                            {doc.authors && (
                                                                <p className="text-[10px] text-blue-600 font-bold italic">
                                                                    Por: {normalizeText(doc.authors)}
                                                                </p>
                                                            )}
                                                            {doc.description && (
                                                                <div className="mt-1 mb-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100/50">
                                                                    <p className="text-[10px] text-gray-500 italic line-clamp-2 leading-relaxed">
                                                                        {normalizeText(doc.description)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <p className="text-[10px] text-gray-400">{formatDate(doc.createdAt)}</p>
                                                        </div>

                                                    </div>
                                                    <div className="flex items-center gap-2 justify-start sm:justify-end shrink-0 sm:pl-0 pl-[44px]">
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-blue-600 hover:text-white hover:bg-blue-600 text-[10px] font-bold bg-blue-50 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap"
                                                        >
                                                            Descargar
                                                        </a>
                                                        {(user?.role === 'ADMIN' || (user?.role === 'TEACHER' && course.teacherId === user.id) || user?.id === doc.userId) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteDocument(doc.id);
                                                                }}
                                                                className="p-1 px-2 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 rounded-lg transition-all"
                                                                title="Eliminar documento"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            course.documents && course.documents.length > 0 ? (
                                <div className="grid gap-4">
                                    {course.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => window.open(doc.url, '_blank')}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer gap-6"
                                        >
                                            <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                                                <div className="p-2 sm:p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors shrink-0">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate text-sm md:text-lg">{normalizeText(doc.name)}</h3>
                                                    {doc.authors && (
                                                        <p className="text-[10px] md:text-sm text-blue-600 font-bold italic">
                                                            Escrito por: {normalizeText(doc.authors)}
                                                        </p>
                                                    )}
                                                    {doc.description && (
                                                        <div className="mt-1 mb-1 bg-blue-50/50 p-2 rounded-xl border border-blue-100/30 overflow-hidden max-h-20 overflow-y-auto custom-scrollbar">
                                                            <p className="text-[10px] md:text-xs text-gray-600 font-medium italic leading-relaxed">
                                                                {normalizeText(doc.description)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <p className="text-[10px] md:text-sm text-gray-500 mt-0.5">
                                                        Subido por: <span className="text-gray-700 font-medium">{doc.user?.fullName || doc.user?.email}</span> • {formatDate(doc.createdAt)}
                                                    </p>
                                                </div>

                                            </div>
                                            <div className="flex items-center gap-2 justify-start md:justify-end shrink-0 md:pl-0 pl-[52px]">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 md:px-5 md:py-2.5 rounded-xl font-bold text-[10px] md:text-sm transition-all shadow-sm whitespace-nowrap"
                                                >
                                                    Descargar
                                                </a>
                                                {(user?.role === 'ADMIN' || (user?.role === 'TEACHER' && course.teacherId === user.id) || user?.id === doc.userId) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteDocument(doc.id);
                                                        }}
                                                        className="p-1.5 md:p-2.5 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 rounded-xl transition-all"
                                                        title="Eliminar documento"
                                                    >
                                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No hay documentos subidos todavía.</p>
                                </div>
                            )
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Estudiantes Inscritos</h2>
                                <p className="text-gray-500 text-sm mt-1">Lista de alumnos que tienen acceso a este curso.</p>
                            </div>

                            {((user?.role === 'TEACHER' && course.teacherId === user.id) || user?.role === 'ADMIN') && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAddStudent(!showAddStudent)}
                                        className={`p-3 rounded-xl transition-all shadow-sm ${showAddStudent
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        title={showAddStudent ? "Cancelar" : "Añadir Estudiante"}
                                    >
                                        {showAddStudent ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        )}
                                    </button>

                                    {showAddStudent && (
                                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <h3 className="font-bold text-gray-900 mb-3">Añadir Estudiante</h3>
                                            <form onSubmit={handleAddStudent} className="space-y-3">
                                                <input
                                                    type="email"
                                                    value={emailToAdd}
                                                    onChange={(e) => setEmailToAdd(e.target.value)}
                                                    placeholder="Correo del estudiante"
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={addingStudent}
                                                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm"
                                                >
                                                    {addingStudent ? 'Añadiendo...' : 'Confirmar'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {course.students && course.students.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.students.map((student) => (
                                    <div key={student.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-50 transition-colors">
                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{student.fullName}</h4>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No hay estudiantes inscritos todavía.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseDetailsPage;
