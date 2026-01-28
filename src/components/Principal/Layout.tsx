import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { useWindowSize } from '../../hooks/useWindowSize';
import SiderBar from './SideBar';

const Layout: React.FC = () => {
    const { isMobile } = useWindowSize();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close sidebar when switching to desktop
    useEffect(() => {
        if (!isMobile) setIsSidebarOpen(false);
    }, [isMobile]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            <SiderBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={toggleSidebar}
                />
            )}


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
                    <div className="max-w-8xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
