import React, { useCallback, useState } from 'react';
import notificationService from '../service/notificationService';

import { useDocuments } from '../hooks/useDocuments';
import { UploadSection } from '../components/dashboard/UploadSection';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionCard } from '../components/shared/SectionCard';
import { DocumentList } from '../components/dashboard/DocumentList';
import { RefreshButton } from '../components/shared/RefreshButton';
import { useUserContext } from '../context/UserContext';

export const MisDocumentos = React.memo(() => {
    const { documents, loading, error, uploadDocument, deleteDocument, fetchDocuments } = useDocuments();
    const { user } = useUserContext();
    const [uploading, setUploading] = useState(false);

    const handleUpload = useCallback(async (file: File, title: string, description: string, authors: string) => {
        try {
            setUploading(true);
            await uploadDocument(file, title, description, authors);
            notificationService.success('Archivo subido correctamente');
        } catch (err: any) {
            notificationService.error(err.message || 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    }, [uploadDocument]);

    const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            try {
                await deleteDocument(id);
                notificationService.success('Documento eliminado correctamente');
            } catch (err) {
                console.error('Error deleting document:', err);
                notificationService.error('Error al eliminar el documento');
            }
        }
    }, [deleteDocument]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <PageHeader
                    title="Mis Documentos"
                    description="Gestiona todos tus archivos institucionales en un solo lugar."
                />
                <div className="flex items-center gap-3">
                    <RefreshButton onRefresh={fetchDocuments} />
                    <UploadSection onUpload={handleUpload} uploading={uploading} defaultAuthor={user?.fullName || ''} />
                </div>
            </div>

            <SectionCard title={`Todos los Documentos (${documents.length})`}>
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
