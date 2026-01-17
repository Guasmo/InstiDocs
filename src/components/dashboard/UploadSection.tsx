import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadSectionProps {
    onUpload: (file: File) => Promise<void>;
    uploading: boolean;
}

export const UploadSection = ({ onUpload, uploading }: UploadSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
            // Reset input so the same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleNewClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
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
                        <span>Nuevo</span>
                    </>
                )}
            </button>
        </>
    );
};
