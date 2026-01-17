import React from 'react';
import { FileText } from 'lucide-react';

import type { Document } from '../../interfaces/Document';
import { DocumentItem } from './DocumentItem';

interface DocumentListProps {
    documents: Document[];
    loading: boolean;
    error: string | null;
    onDelete: (id: string, e: React.MouseEvent) => void;
    emptyMessage?: string;
}

export const DocumentList = React.memo(({
    documents,
    loading,
    error,
    onDelete,
    emptyMessage
}: DocumentListProps) => {

    // Estado de Carga
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando documentos...</p>
        </div>
    );

    // Estado de Error
    if (error) return (
        <div className="text-center py-12 bg-red-50 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-300">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-red-500 underline hover:text-red-700"
            >
                Reintentar
            </button>
        </div>
    );

    // Estado Vacío
    if (documents.length === 0) return (
        <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} className="text-gray-300" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">No hay documentos aún</h4>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                {emptyMessage || "Tu colección está vacía. Sube tu primer archivo institucional para comenzar."}
            </p>
        </div>
    );

    // Lista de Documentos
    return (
        <div className="grid gap-3 animate-in fade-in duration-500">
            {documents.map((doc) => (
                <DocumentItem
                    key={doc.id}
                    doc={doc}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
});

DocumentList.displayName = 'DocumentList'; 