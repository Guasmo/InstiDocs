import React from 'react';
import { Trash2, Upload, ChevronRight } from 'lucide-react';

import { formatDate, formatFileSize, getDownloadUrl, getFileIcon, getFileIconColor, normalizeText } from '../../utils/formatters';
import type { Document } from '../../interfaces/Document';

interface DocumentItemProps {
    doc: Document;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const DocumentItem = React.memo(({ doc, onDelete }: DocumentItemProps) => {
    return (
        <div
            onClick={() => window.open(doc.url, '_blank')}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-transparent hover:border-gray-100 transition-all duration-300 group cursor-pointer hover:shadow-md hover:shadow-gray-200/40 gap-3"
        >
            <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                {/* Icon Container */}
                <div className={`w-10 h-10 md:w-12 md:h-12 ${getFileIconColor(doc.mimetype)} rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                    <span className="text-[10px] md:text-xs font-black tracking-tighter">
                        {getFileIcon(doc.mimetype)}
                    </span>
                </div>

                {/* Info Container */}
                <div className="min-w-0 flex-1">
                    <p className="text-sm md:text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {normalizeText(doc.name)}
                    </p>
                    <div className="flex items-center text-[10px] md:text-xs text-gray-400 font-medium gap-2">
                        <span>{formatDate(doc.createdAt).split('•')[0].trim()}</span>
                        <span className="text-gray-300">•</span>
                        <span>{formatFileSize(doc.size)}</span>
                    </div>
                </div>
            </div>


            {/* Right Side - Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 justify-start sm:justify-end sm:ml-4 sm:pl-0 pl-[52px]">
                {/* Download Button */}
                <a
                    href={getDownloadUrl(doc.url)}
                    download={doc.name}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 md:p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all group/download flex items-center gap-1.5"
                    title="Descargar"
                >
                    <Upload size={14} className="md:w-4 md:h-4 rotate-180" />
                    <span className="text-[10px] sm:hidden font-bold">Descargar</span>
                </a>

                <button
                    onClick={(e) => onDelete(doc.id, e)}
                    className="p-1.5 md:p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-red-600 hover:text-white transition-all group/delete"
                    title="Eliminar"
                >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
                </button>

                <div className="hidden sm:flex p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>
            </div>
        </div>
    );
});



DocumentItem.displayName = 'DocumentItem';