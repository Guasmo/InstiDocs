import api from './api';
import type { Document, UploadDocumentResponse } from '../interfaces/Document';
import { documentsApi, uploadDocumentApi } from '../constants/endpoints';


const documentService = {
    /**
     * Upload a document file
     */
    uploadDocument: async (file: File): Promise<UploadDocumentResponse> => {
        const formData = new FormData();
        formData.append('document', file);

        // Use api instance directly but let axios set the Content-Type automatically
        const response = await api.post<UploadDocumentResponse>(
            uploadDocumentApi,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Get all documents for the authenticated user
     */
    getAllDocuments: async (): Promise<Document[]> => {
        return api.get<Document[]>(documentsApi).then(res => res.data);
    },

    /**
     * Get a single document by ID
     */
    getDocumentById: async (id: string): Promise<Document> => {
        return api.get<Document>(`${documentsApi}/${id}`).then(res => res.data);
    },

    /**
     * Delete a document
     */
    deleteDocument: async (id: string): Promise<void> => {
        return api.delete(`${documentsApi}/${id}`).then(() => undefined);
    },
};

export default documentService;
