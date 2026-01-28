import { useState } from "react";
import { FileText, LayoutDashboard, LogOut, User, X, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useWindowSize } from "../../hooks/useWindowSize";

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
    const { logout } = useAuthContext();
    const { isMobile } = useWindowSize();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <FileText size={20} />, label: 'Mis Documentos', path: '/mis-documentos' },
        { icon: <BookOpen size={20} />, label: 'Cursos', path: '/courses' },
        { icon: <User size={20} />, label: 'Perfil', path: '/perfil' }
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Pequeño delay para que la animación se aprecie y el usuario sienta la transición
        await new Promise(resolve => setTimeout(resolve, 900));
        logout();
    };

    return (
        <>
            {/* Overlay de salida con desenfoque premium */}
            {isLoggingOut && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[100] flex flex-col items-center justify-center animate-in fade-in duration-700">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-6 text-gray-900 font-bold text-xl tracking-tight animate-pulse">
                        Cerrando sesión...
                    </p>
                </div>
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
                ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'relative translate-x-0'}
                ${isLoggingOut ? 'opacity-50 pointer-events-none scale-95 blur-sm' : ''}
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
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-2">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={() => isMobile && onClose()}
                            className={({ isActive }) => `
                                w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all group disabled:opacity-50"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default SideBar;