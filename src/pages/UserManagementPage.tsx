import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import userService from '../service/userService';
import type { UserInterface, CreateUserData, UpdateUserData } from '../interfaces/User';
import { Search, Plus, Edit2, X, Save } from 'lucide-react';
import LoadingFallback from '../components/shared/Loading';
import notificationService from '../service/notificationService';
import { useNavigate } from 'react-router-dom';

const UserManagementPage: React.FC = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserInterface | null>(null);

    // Form states
    const [formData, setFormData] = useState<CreateUserData & { isActive?: boolean }>({
        email: '',
        fullName: '',
        password: '',
        role: 'STUDENT',
        isActive: true
    });

    useEffect(() => {
        if (user) {
            if (user.role !== 'ADMIN') {
                navigate('/');
            } else {
                fetchUsers();
            }
        }
    }, [user, navigate]);

    // Cleanup debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async (searchTerm?: string) => {
        try {
            const data = await userService.getAllUsers(searchTerm);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let updatedUser: UserInterface;

            if (editingUser) {
                // Update
                const updateData: UpdateUserData = {
                    email: formData.email,
                    fullName: formData.fullName,
                    role: formData.role,
                    isActive: formData.isActive
                };
                // Only send password if it's changed (not empty)
                if (formData.password) {
                    updateData.password = formData.password;
                }

                updatedUser = await userService.updateUser(editingUser.id, updateData);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else {
                // Create
                updatedUser = await userService.createUser(formData);
                setUsers(prev => [updatedUser, ...prev]);
            }

            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ email: '', fullName: '', password: '', role: 'STUDENT', isActive: true });

            notificationService.success(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');

        } catch (error: any) {
            console.error('Error saving user:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar el usuario';
            notificationService.error(errorMessage);
        }
    };

    const handleEditClick = (userToEdit: UserInterface) => {
        setEditingUser(userToEdit);
        setFormData({
            email: userToEdit.email,
            fullName: userToEdit.fullName,
            password: '', // Don't show password
            role: userToEdit.role,
            isActive: userToEdit.isActive ?? true
        });
        setIsModalOpen(true);
    };



    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ email: '', fullName: '', password: '', role: 'STUDENT', isActive: true });
        setIsModalOpen(true);
    };

    if (loading && !users.length) return <LoadingFallback />;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-500 mt-2">Administra los usuarios de la plataforma</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200"
                >
                    <Plus size={20} />
                    <span>Crear Usuario</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {u.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{u.fullName}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                            ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'TEACHER' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-sm font-medium
                                            ${u.isActive !== false ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`w-2 h-2 rounded-full ${u.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {u.isActive !== false ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {editingUser ? 'Contraseña (Dejar en blanco para mantener)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    >
                                        <option value="STUDENT">Estudiante</option>
                                        <option value="TEACHER">Profesor</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>

                                {editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                                        <select
                                            value={formData.isActive ? 'true' : 'false'}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 outline-none font-medium
                                                ${formData.isActive
                                                    ? 'border-green-200 text-green-700 bg-green-50 focus:border-green-500 focus:ring-green-100'
                                                    : 'border-red-200 text-red-700 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                                }`}
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex justify-center items-center gap-2"
                                >
                                    <Save size={18} />
                                    <span>{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
