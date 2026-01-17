export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export const getFileIcon = (mimetype: string): string => {
    if (mimetype.includes('pdf')) return 'PDF';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'DOC';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'XLS';
    if (mimetype.includes('image')) return 'IMG';
    return 'FILE';
};

export const getFileIconColor = (mimetype: string): string => {
    if (mimetype.includes('pdf')) return 'bg-red-50 text-red-600';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'bg-blue-50 text-blue-600';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'bg-green-50 text-green-600';
    if (mimetype.includes('image')) return 'bg-purple-50 text-purple-600';
    return 'bg-gray-50 text-gray-600';
};

export const getDownloadUrl = (url: string): string => {
    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
};
