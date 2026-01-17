import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
    onRefresh: () => Promise<void>;
    className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, className = "" }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            // Add a small delay for the animation to be visible
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm hover:shadow-md disabled:opacity-50 ${className}`}
            title="Actualizar documentos"
        >
            <RefreshCw
                size={20}
                className={`text-gray-500 group-hover:text-blue-600 transition-all duration-500 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
            />
        </button>
    );
};
