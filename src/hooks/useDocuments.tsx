import { useState, useEffect } from 'react';
import { useDocumentContext } from '../context/DocumentContext';

export const useDocuments = () => {
    const context = useDocumentContext();
    const [simulatedLoading, setSimulatedLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSimulatedLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return {
        documents: context.documents,
        loading: context.loading || simulatedLoading,
        error: context.error,
        fetchDocuments: context.fetchDocuments,
        uploadDocument: context.uploadDocument,
        deleteDocument: context.deleteDocument,
    };
};
