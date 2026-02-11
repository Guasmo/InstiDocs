export interface Document {
    id: string;
    name: string;
    filename: string;
    url: string;
    mimetype: string;
    size: number;
    description?: string;
    authors?: string;
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
    description?: string;
    authors?: string;
}

export interface UploadDocumentResponse {
    success: boolean;
    message: string;
    data: Document;
}
