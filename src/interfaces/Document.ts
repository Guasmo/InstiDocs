export interface Document {
    id: string;
    name: string;
    filename: string;
    url: string;
    mimetype: string;
    size: number;
    userId: string;
    user?: {
        email: string;
        fullName: string | null;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentDto {
    name: string;
    filename: string;
    url: string;
    mimetype: string;
    size: number;
}

export interface UploadDocumentResponse {
    success: boolean;
    message: string;
    data: Document;
}
