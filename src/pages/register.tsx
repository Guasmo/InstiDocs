import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";

export const Register: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState<{ type: 'error' | null; message: string | null }>({
        type: null,
        message: null
    });

    const { register, loading } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatus({ type: null, message: null });

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        const result = await register(fullName, email, password);

        if (result.success) {
            navigate("/login", { state: { message: 'Registro exitoso. Por favor inicia sesión.' } });
        } else {
            setStatus({ type: 'error', message: result.error || 'Error al registrarse' });
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

            {/* Title Section */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Crea tu cuenta</h1>
            <p className="text-gray-500 mb-10 text-center">Regístrate para empezar a gestionar tus documentos</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                {/* Full Name */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                        <User size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
                        required
                    />
                </div>

                {/* Email */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                        <Mail size={20} />
                    </div>
                    <input
                        type="email"
                        placeholder="tu_correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
                        required
                    />
                </div>

                {/* Password */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                        <Lock size={20} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
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

                {/* Repeat Password */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                        <Lock size={20} />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 bg-white border rounded-2xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-700 placeholder-gray-400 ${confirmPassword && password !== confirmPassword
                                ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-100 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-xs ml-1 animate-in fade-in slide-in-from-top-1">
                        Las contraseñas no coinciden
                    </p>
                )}

                {status.message && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                        {status.message}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || (confirmPassword !== "" && password !== confirmPassword)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Creando cuenta...</span>
                        </>
                    ) : (
                        "Registrarse"
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
                <p className="text-gray-500">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};
