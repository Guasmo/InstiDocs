import React from 'react';
import { Trash2, Upload, ChevronRight } from 'lucide-react';

import { formatDate, formatFileSize, getDownloadUrl, getFileIcon, getFileIconColor } from '../../utils/formatters';
import type { Document } from '../../interfaces/Document';

interface DocumentItemProps {
    doc: Document;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const DocumentItem = React.memo(({ doc, onDelete }: DocumentItemProps) => {
    return (
        <div
            onClick={() => window.open(doc.url, '_blank')}
            className="flex items-center justify-between p-4 md:p-5 bg-white hover:bg-gray-50/80 rounded-2xl border border-transparent hover:border-gray-100 transition-all duration-300 group cursor-pointer hover:shadow-md hover:shadow-gray-200/40"
        >
            <div className="flex items-center space-x-4 md:space-x-6 min-w-0 flex-1">
                {/* Icon Container */}
                <div className={`w-12 h-12 md:w-14 md:h-14 ${getFileIconColor(doc.mimetype)} rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <span className="text-[10px] md:text-xs font-black tracking-tighter">
                        {getFileIcon(doc.mimetype)}
                    </span>
                </div>

                {/* Info Container */}
                <div className="min-w-0 flex-1">
                    <p className="text-base md:text-lg font-bold text-gray-900 truncate mb-0.5 md:mb-1 group-hover:text-blue-600 transition-colors">
                        {doc.name}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 font-medium gap-0.5 md:gap-2">
                        <span>{formatDate(doc.createdAt)}</span>
                        <span className="hidden md:inline text-gray-300">•</span>
                        <span>{formatFileSize(doc.size)}</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Actions */}
            <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={(e) => onDelete(doc.id, e)}
                    className="p-2.5 bg-gray-50 rounded-xl hover:bg-red-50 hover:shadow-sm transition-all group/delete"
                    title="Eliminar"
                >
                    <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600 transition-colors" />
                </button>

                {/* Download Button */}
                <a
                    href={getDownloadUrl(doc.url)}
                    download={doc.name}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all group/download"
                    title="Descargar"
                >
                    <Upload size={18} className="text-gray-400 group-hover/download:text-blue-600 transition-colors rotate-180" />
                </a>

                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>
            </div>
        </div>
    );
});

DocumentItem.displayName = 'DocumentItem';