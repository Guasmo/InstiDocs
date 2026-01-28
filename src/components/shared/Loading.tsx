interface LoadingProp {
    fullscreen?: boolean;
}

const LoadingFallback = ({ fullscreen = false }: LoadingProp) => {
    return (
        <div className={`flex items-center justify-center w-full ${fullscreen ? 'h-screen fixed inset-0 bg-white/50 backdrop-blur-sm z-50' : 'flex-1 min-h-[400px]'
            }`}>
            <div className="flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-lg mt-6 text-gray-500 font-bold tracking-tight animate-pulse">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;