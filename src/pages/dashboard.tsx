import React, { useCallback, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useUser } from '../hooks/useUser';
import { useDocuments } from '../hooks/useDocuments';
import { UploadSection } from '../components/dashboard/UploadSection';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionCard } from '../components/shared/SectionCard';
import { DocumentList } from '../components/dashboard/DocumentList';
import { RefreshButton } from '../components/shared/RefreshButton';

const Dashboard: React.FC = () => {
    const { user } = useUser();
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

    const recentDocuments = useMemo(() => documents.slice(0, 4), [documents]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            <PageHeader
                title={`Bienvenido de nuevo, ${user?.fullName || 'Usuario'}!`}
                description="Aquí tienes un resumen de tus documentos institucionales."
            />

            {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                    {uploadError}
                </div>
            )}

            <SectionCard
                title="Documentos Recientes"
                rightElement={
                    <div className="flex items-center gap-3">
                        <RefreshButton onRefresh={fetchDocuments} />
                        <UploadSection onUpload={handleUpload} uploading={uploading} />
                    </div>
                }
            >
                <DocumentList
                    documents={recentDocuments}
                    loading={loading}
                    error={error}
                    onDelete={handleDelete}
                    emptyMessage="Haz clic en 'Nuevo' para subir tu primer documento"
                />

                {documents.length > 4 && (
                    <div className="mt-7 flex justify-center">
                        <Link
                            to="/mis-documentos"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-10 py-3 rounded-2xl transition-all flex items-center gap-2 group"
                        >
                            <span>Ver todos los documentos ({documents.length})</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

export default Dashboard;
