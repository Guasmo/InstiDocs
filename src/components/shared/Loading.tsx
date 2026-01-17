interface LoadingProp {
    fullscreen?: boolean;
}

const LoadingFallback = ({ fullscreen = false }: LoadingProp) => {
    return (
        <div className={`flex items-center justify-center w-full ${fullscreen ? 'h-screen fixed inset-0 bg-white/50 backdrop-blur-sm z-50' : 'h-64'
            }`}>
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-lg mt-4 text-gray-600 font-medium">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;