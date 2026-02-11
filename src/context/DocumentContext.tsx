import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import documentService from '../service/documentService';
import type { Document } from '../interfaces/Document';
import { useAuthContext } from '../hooks/useAuthContext';

interface DocumentContextType {
    documents: Document[];
    loading: boolean;
    error: string | null;
    fetchDocuments: () => Promise<void>;
    uploadDocument: (file: File, title: string, description: string, authors: string) => Promise<any>;
    deleteDocument: (id: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, userId } = useAuthContext();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (!isAuthenticated) return;

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
    }, [isAuthenticated]);

    const uploadDocument = useCallback(async (file: File, title: string, description: string, authors: string) => {
        try {
            setError(null);
            const response = await documentService.uploadDocument(file, title, description, authors);
            await fetchDocuments();
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al subir documento');
            throw err;
        }
    }, [fetchDocuments]);

    const deleteDocument = useCallback(async (id: string) => {
        try {
            setError(null);
            await documentService.deleteDocument(id);
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        } catch (err: any) {
            setError(err.message || 'Error al eliminar documento');
            throw err;
        }
    }, []);

    // Reset state on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setDocuments([]);
            setError(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Initial fetch on login or user change
    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchDocuments();
        }
    }, [isAuthenticated, userId, fetchDocuments]);

    return (
        <DocumentContext.Provider value={{
            documents,
            loading,
            error,
            fetchDocuments,
            uploadDocument,
            deleteDocument
        }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error('useDocumentContext must be used within a DocumentProvider');
    }
    return context;
};
