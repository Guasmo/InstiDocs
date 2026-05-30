import React, { useRef, useState } from 'react';
<<<<<<< HEAD
import { Upload, Loader2, X, Send } from 'lucide-react';

interface UploadSectionProps {
    onUpload: (file: File, title: string, description: string, authors: string) => Promise<void>;
=======
import { Upload, Loader2, X, FileText } from 'lucide-react';

interface UploadSectionProps {
    onUpload: (file: File, description: string) => Promise<void>;
>>>>>>> b8e2143 (feat(dashboard): improve document item and upload section components)
    uploading: boolean;
    defaultAuthor?: string;
}

export const UploadSection = ({ onUpload, uploading, defaultAuthor }: UploadSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [authors, setAuthors] = useState(defaultAuthor || '');

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const handleCancel = () => {
                setIsOpen(false);
                setSelectedFile(null);
                setTitle('');
                setDescription('');
                setAuthors(defaultAuthor || '');
                if (fileInputRef.current) fileInputRef.current.value = '';
            };

            const handleInitialClick = () => {
                setIsOpen(true);
            };

            const handleUploadClick = async (e: React.FormEvent) => {
                e.preventDefault();
                if (selectedFile) {
                    await onUpload(selectedFile, title, description, authors);
                    handleCancel();
                }
            };

            return (
                <>
                    <button
                        onClick={handleInitialClick}
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

                    {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h3 className="text-lg font-bold text-gray-900">Subir Documento</h3>
                                    <button
                                        onClick={handleCancel}
                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        disabled={uploading}
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleUploadClick} className="p-4 space-y-4">
                                    {/* File Selection */}
                                    <div
                                        onClick={() => !uploading && fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileInputChange}
                                            disabled={uploading}
                                            accept=".pdf"
                                        />
                                        {selectedFile ? (
                                            <>
                                                <FileText size={32} className="text-green-600 mb-2" />
                                                <p className="text-sm font-medium text-green-700 text-center break-all">{selectedFile.name}</p>
                                                <p className="text-xs text-green-600 mt-1">Clic para cambiar</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-gray-400 mb-2" />
                                                <p className="text-sm font-medium text-gray-600">Seleccionar archivo PDF</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Título del documento..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                                                disabled={uploading}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                                            <input
                                                type="text"
                                                value={authors}
                                                onChange={(e) => setAuthors(e.target.value)}
                                                placeholder="Nombre del autor..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                                                disabled={uploading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Añade una descripción (opcional)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm"
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            disabled={uploading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!selectedFile || !title.trim() || uploading}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2D9F50] rounded-lg hover:bg-[#258a44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Publicar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            );
        };
