import React from 'react';
import { FileText } from 'lucide-react';

interface StatsProps {
    totalDocs: number;
}

export const Stats = React.memo(({ totalDocs }: StatsProps) => {
    const stats = [
        { label: 'Documentos', value: totalDocs, icon: <FileText className="text-blue-600" />, bg: 'bg-blue-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        </div>
    );
});