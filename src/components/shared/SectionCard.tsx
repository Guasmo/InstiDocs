import React from 'react';

interface SectionCardProps {
    title: string;
    rightElement?: React.ReactNode;
    children: React.ReactNode;
}

export const SectionCard = ({ title, rightElement, children }: SectionCardProps) => (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {rightElement}
        </div>
        <div className="px-8 pb-8 pt-0">
            {children}
        </div>
    </div>
);
