export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${datePart} • ${timePart}`;
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

export const normalizeText = (text: string | null | undefined): string => {
    if (!text) return '';

    // Diccionario de reemplazos para limpiar codificación dañada
    // Priorizamos secuencias de 2 bytes (UTF-8 común)
    const patterns = [
        { regex: /Ã¡/g, replacement: 'á' },
        { regex: /Ã©/g, replacement: 'é' },
        { regex: /Ã\u00ad/g, replacement: 'í' },
        { regex: /Ã³/g, replacement: 'ó' },
        { regex: /Ãº/g, replacement: 'ú' },
        { regex: /Ã±/g, replacement: 'ñ' },

        // Caracteres "huérfanos" (restos de UTF-8 cuando se pierde el lead byte)
        { regex: /³/g, replacement: 'ó' },
        { regex: /\u00BA/g, replacement: 'ú' },
        { regex: /\u00A9/g, replacement: 'é' },
        { regex: /\u00A1/g, replacement: 'á' },
    ];

    let result = text;
    patterns.forEach(({ regex, replacement }) => {
        result = result.replace(regex, replacement);
    });

    // Limpieza final: normalizar a NFC y quitar espacios extra
    return result.normalize('NFC').replace(/\s+/g, ' ').trim();
};


