import React, { useRef, useState } from 'react';
import { Upload, Loader2, X, Send } from 'lucide-react';

interface UploadSectionProps {
    onUpload: (file: File, title: string, description: string, authors: string) => Promise<void>;
    uploading: boolean;
    defaultAuthor?: string;
}

export const UploadSection = ({ onUpload, uploading, defaultAuthor }: UploadSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [authors, setAuthors] = useState(defaultAuthor || '');

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Solo se permiten archivos PDF');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            setSelectedFile(file);
            setTitle(file.name.replace(/\.pdf$/i, ''));
            setAuthors(defaultAuthor || '');
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setAuthors(defaultAuthor || '');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUploadClick = async () => {
        if (selectedFile) {
            await onUpload(selectedFile, title, description, authors);
            handleCancel();
        }
    };

    const handleNewClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileInputChange}
            />

            <button
                onClick={handleNewClick}
                disabled={uploading}
                className="bg-[#2D9F50] hover:bg-[#258a44] text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Subiendo...</span>
                    </>
                ) : (
                    <>
                        <Upload size={16} />
                        <span>Nuevo PDF</span>
                    </>
                )}
            </button>

            {/* Absolute Dropdown Form */}
            {selectedFile && (
                <>
                    {/* Invisible Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-[40]" onClick={handleCancel} />

                    <div
                        className="absolute top-full right-0 mt-3 z-[50] w-full min-w-[320px] max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-blue-900/10 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Nuevo Documento</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Subida de PDF</p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-1.5 hover:bg-white hover:text-red-500 text-gray-400 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* File Card Mini */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                <div className="p-2 bg-blue-600 text-white rounded-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">Archivo PDF</p>
                                    <p className="text-xs font-bold text-gray-700 truncate">{selectedFile.name}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">Título</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Título del documento..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">Autor</label>
                                    <input
                                        type="text"
                                        value={authors}
                                        onChange={(e) => setAuthors(e.target.value)}
                                        placeholder="Nombre del autor..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Resumen opcional..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none h-24 resize-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUploadClick}
                                disabled={uploading || !title.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-200"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Subiendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Publicar Documento</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
