import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { useUser } from '../hooks/useUser';

const Dashboard: React.FC = () => {
    const { user } = useUser();

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Bienvenido de nuevo, {user?.fullName || 'Usuario'}!
                </h1>
                <p className="text-gray-500 text-lg">Aquí tienes un resumen de tus documentos institucionales.</p>
            </div>

            {/* Recent Documents Section */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Documentos Recientes</h3>
                    {/* Green "New" Button Style */}
                    <button className="bg-[#2D9F50] hover:bg-[#258a44] text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-sm">
                        <FileText size={16} />
                        <span>New</span>
                    </button>
                </div>

                <div className="px-8 pb-8 pt-0">
                    <div className="space-y-3 ">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 rounded-2xl border-[1px] border-gray-400 border-transparent hover:border-gray-100 transition-all group cursor-pointer">
                                <div className="flex items-center space-x-4 md:space-x-6 min-w-0 flex-1">
                                    {/* Icon Container */}
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                        <span className="text-[10px] md:text-xs font-black text-red-600">PDF</span>
                                    </div>

                                    {/* Info Container - Stacked as per sketch */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base md:text-lg font-bold text-gray-900 truncate mb-0.5 md:mb-1">
                                            Certificado_Matricula_2024_{i}.pdf
                                        </p>
                                        <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 font-medium gap-0.5 md:gap-2">
                                            <span>12 Ene, 2026</span>
                                            <span className="hidden md:inline text-gray-300">•</span>
                                            <span>3.2 MB</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Just the Chevron */}
                                <div className="ml-4 flex-shrink-0">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* "Ver todos" at the bottom */}
                    <div className="mt-7 flex justify-center">
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-10 py-3 rounded-2xl transition-all flex items-center gap-2 group">
                            <span>Ver todos los documentos</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
