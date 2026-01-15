import { useState, useEffect } from 'react';
import documentService from '../service/documentService';
import type { Document } from '../interfaces/Document';

export const useDocuments = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const docs = await documentService.getAllDocuments();
            setDocuments(docs);
        } catch (err: any) {
            setError(err.message || 'Error al cargar documentos');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file: File) => {
        try {
            setError(null);
            const response = await documentService.uploadDocument(file);
            // Refresh the documents list
            await fetchDocuments();
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al subir documento');
            throw err;
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            setError(null);
            await documentService.deleteDocument(id);
            // Remove from local state
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        } catch (err: any) {
            setError(err.message || 'Error al eliminar documento');
            throw err;
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
    };
};
