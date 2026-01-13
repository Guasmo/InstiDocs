import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import { LogOut, LayoutDashboard, FileText, Settings, User, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { logout } = useAuthContext();
    const { isMobile } = useWindowSize();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
        { icon: <FileText size={20} />, label: 'Mis Documentos', active: false },
        { icon: <User size={20} />, label: 'Perfil', active: false },
        { icon: <Settings size={20} />, label: 'Configuración', active: false },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close sidebar when switching to desktop
    useEffect(() => {
        if (!isMobile) setIsSidebarOpen(false);
    }, [isMobile]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar - Conditional Rendering Logic via Classes */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
                ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'relative translate-x-0'}
            `}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                                <path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">InstiDocs</span>
                    </div>
                    {isMobile && (
                        <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${item.active
                                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header - Conditional Rendering */}
                {isMobile && (
                    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                                    <path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-900">InstiDocs</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </header>
                )}

                {/* Content Area - Wider container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
