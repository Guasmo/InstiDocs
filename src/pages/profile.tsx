import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "../components/shared/PageHeader";
import { useUser } from "../hooks/useUser";
import { User, Mail, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const ProfilePage = React.memo(() => {
    const { user, loading, updateUser } = useUser();
    const [formData, setFormData] = useState({
        fullName: '',
        email: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string | null }>({
        type: null,
        message: null
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: null });

        const result = await updateUser(formData);

        if (result.success) {
            setStatus({ type: 'success', message: 'Perfil actualizado correctamente' });
            setTimeout(() => setStatus({ type: null, message: null }), 3000);
        } else {
            setStatus({ type: 'error', message: result.error || 'Error al actualizar el perfil' });
        }
    }, [formData, updateUser]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 w-full pb-10">
            <PageHeader
                title="Mi Perfil"
                description="Gestiona tu información personal y mantén tu cuenta al día."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-blue-100/50">
                            <User size={40} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{user?.fullName || 'Usuario'}</h3>
                        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

                        <div className="mt-6 pt-6 border-t border-gray-50 w-full">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">ID de Usuario</span>
                                <span className="text-gray-900 font-mono text-xs">{user?.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Estado</span>
                                <span className="text-green-500 font-medium flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    Activo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Información Personal
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 ml-1">
                                        Nombre Completo
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Tu nombre completo"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu@correo.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {status.message && (
                                <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <p className="text-sm font-medium">{status.message}</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                                            <span>Guardar Cambios</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
