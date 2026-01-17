import React, { useCallback, useState } from 'react';

import { useDocuments } from '../hooks/useDocuments';
import { UploadSection } from '../components/dashboard/UploadSection';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionCard } from '../components/shared/SectionCard';
import { DocumentList } from '../components/dashboard/DocumentList';
import { RefreshButton } from '../components/shared/RefreshButton';

export const MisDocumentos = React.memo(() => {
    const { documents, loading, error, uploadDocument, deleteDocument, fetchDocuments } = useDocuments();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleUpload = useCallback(async (file: File) => {
        try {
            setUploading(true);
            setUploadError(null);
            await uploadDocument(file);
        } catch (err: any) {
            setUploadError(err.message || 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    }, [uploadDocument]);

    const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            try {
                await deleteDocument(id);
            } catch (err) {
                console.error('Error deleting document:', err);
            }
        }
    }, [deleteDocument]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            <PageHeader
                title="Mis Documentos"
                description="Gestiona todos tus archivos institucionales en un solo lugar."
            />

            {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                    {uploadError}
                </div>
            )}

            <SectionCard
                title={`Todos los Documentos (${documents.length})`}
                rightElement={
                    <div className="flex items-center gap-3">
                        <RefreshButton onRefresh={fetchDocuments} />
                        <UploadSection onUpload={handleUpload} uploading={uploading} />
                    </div>
                }
            >
                <DocumentList
                    documents={documents}
                    loading={loading}
                    error={error}
                    onDelete={handleDelete}
                />
            </SectionCard>
        </div>
    );
});

MisDocumentos.displayName = 'MisDocumentos';
