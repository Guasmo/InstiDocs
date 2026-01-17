import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuthContext } from "../hooks/useAuthContext";

export const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login, isAuthenticated, loading } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            // Navigation is handled by useEffect
        } else {
            alert("Error al iniciar sesión. Por favor verifica tus credenciales.");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
            {/* Logo */}
            <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                        <path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z" />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Inicia sesión en tu cuenta</h1>
            <p className="text-gray-500 mb-10 text-center">Ingresa tu correo y contraseña para entrar</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        placeholder="tu_correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
                        required
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            {rememberMe && (
                                <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 20 20">
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                </svg>
                            )}
                        </div>
                        <span className="text-gray-500 text-sm">Recuérdame</span>
                    </label>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>

            {/* Divider */}
            <div className="w-full max-w-md flex items-center my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-4 text-gray-400 text-sm">O</span>
                <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Logins */}
            <div className="w-full max-w-md space-y-4">
                <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    <span className="text-gray-700 font-semibold">Continuar con Google</span>
                </button>
                <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-6 h-6" />
                    <span className="text-gray-700 font-semibold">Continuar con Facebook</span>
                </button>
            </div>

            {/* Footer */}
            <p className="mt-12 text-gray-500">
                ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Regístrate</Link>
            </p>
        </div>
    );
};
