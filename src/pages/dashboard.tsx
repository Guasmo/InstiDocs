import React, { useRef, useState } from 'react';
import { ChevronRight, FileText, Upload, Loader2, Trash2 } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useDocuments } from '../hooks/useDocuments';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        try {
            setUploading(true);
            setUploadError(null);
            await uploadDocument(file);
        } catch (err: any) {
            setUploadError(err.message || 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleNewClick = () => {
        fileInputRef.current?.click();
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            try {
                await deleteDocument(id);
            } catch (err) {
                console.error('Error deleting document:', err);
            }
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getFileIcon = (mimetype: string): string => {
        if (mimetype.includes('pdf')) return 'PDF';
        if (mimetype.includes('word') || mimetype.includes('document')) return 'DOC';
        if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'XLS';
        if (mimetype.includes('image')) return 'IMG';
        return 'FILE';
    };

    const getFileIconColor = (mimetype: string): string => {
        if (mimetype.includes('pdf')) return 'bg-red-50 text-red-600';
        if (mimetype.includes('word') || mimetype.includes('document')) return 'bg-blue-50 text-blue-600';
        if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'bg-green-50 text-green-600';
        if (mimetype.includes('image')) return 'bg-purple-50 text-purple-600';
        return 'bg-gray-50 text-gray-600';
    };

    const recentDocuments = documents.slice(0, 4);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
            />


            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Bienvenido de nuevo, {user?.fullName || 'Usuario'}!
                </h1>
                <p className="text-gray-500 text-lg">Aquí tienes un resumen de tus documentos institucionales.</p>
            </div>

            {/* Upload Error */}
            {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                    {uploadError}
                </div>
            )}

            {/* Recent Documents Section */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Documentos Recientes</h3>
                    {/* Green "New" Button */}
                    <button
                        onClick={handleNewClick}
                        disabled={uploading}
                        className="bg-[#2D9F50] hover:bg-[#258a44] text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Subiendo...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                <span>Nuevo</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="px-8 pb-8 pt-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-gray-400" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            {error}
                        </div>
                    ) : recentDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No hay documentos aún</p>
                            <p className="text-gray-400 text-sm mt-2">Haz clic en "Nuevo" para subir tu primer documento</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 rounded-2xl border-[1px] border-gray-400 border-transparent hover:border-gray-100 transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center space-x-4 md:space-x-6 min-w-0 flex-1">
                                        {/* Icon Container */}
                                        <div className={`w-12 h-12 md:w-14 md:h-14 ${getFileIconColor(doc.mimetype)} rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
                                            <span className="text-[10px] md:text-xs font-black">
                                                {getFileIcon(doc.mimetype)}
                                            </span>
                                        </div>

                                        {/* Info Container */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-base md:text-lg font-bold text-gray-900 truncate mb-0.5 md:mb-1">
                                                {doc.name}
                                            </p>
                                            <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 font-medium gap-0.5 md:gap-2">
                                                <span>{formatDate(doc.createdAt)}</span>
                                                <span className="hidden md:inline text-gray-300">•</span>
                                                <span>{formatFileSize(doc.size)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Actions */}
                                    <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => handleDelete(doc.id, e)}
                                            className="p-2 bg-gray-50 rounded-xl hover:bg-red-50 hover:shadow-sm transition-all group/delete"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} className="text-gray-300 group-hover/delete:text-red-600 transition-colors" />
                                        </button>

                                        {/* Download Button */}
                                        <a
                                            href={doc.url}
                                            download
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all group/download"
                                            title="Descargar"
                                        >
                                            <Upload size={18} className="text-gray-300 group-hover/download:text-blue-600 transition-colors rotate-180" />
                                        </a>

                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                                            title="Ver documento"
                                        >
                                            <ChevronRight size={20} className="text-gray-300 hover:text-blue-600 transition-colors" />
                                        </a>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                    {/* "Ver todos" at the bottom */}
                    {documents.length > 4 && (
                        <div className="mt-7 flex justify-center">
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-10 py-3 rounded-2xl transition-all flex items-center gap-2 group">
                                <span>Ver todos los documentos ({documents.length})</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

