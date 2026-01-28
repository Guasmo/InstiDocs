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
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
});