import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, Lock, User, UserCog 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Index({ admins, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [editUser, setEditUser] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        athlete_id: '', 
        password: '',
    });

    
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('manage-admins.index'), { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    
    const openCreateModal = () => {
        setModalMode('create');
        setEditUser(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setEditUser(user);
        clearErrors();
        setData({
            name: user.name,
            athlete_id: user.athlete_id,
            password: '', 
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('manage-admins.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            put(route('manage-admins.update', editUser.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this admin account?')) {
            router.delete(route('manage-admins.destroy', id));
        }
    };

    return (
        <AdminLayout title="Admin Management">
            <Head title="Admin Management" />

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage accounts with administrative privileges.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#00488b] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-[#003666] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} /> Add Admin
                </button>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by name or ID..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-[#00488b] focus:ring-[#00488b] text-sm shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* RESPONSIVE TABLE */}
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full text-left text-sm text-slate-600 divide-y divide-slate-100">
                        <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Admin Name</th>
                                <th className="px-6 py-4">Login ID (Username)</th>
                                <th className="px-6 py-4 text-center">Role Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {admins.data.length > 0 ? (
                                admins.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-100">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                                            {user.athlete_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wide">
                                                <Shield size={10}/> Administrator
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => openEditModal(user)} 
                                                    className="p-2 text-slate-400 hover:text-[#00488b] hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Admin"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)} 
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Admin"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                                        No admin accounts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <UserCog className="w-5 h-5 text-[#00488b]" />
                                {modalMode === 'create' ? 'Add New Admin' : 'Edit Admin'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                            
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] text-sm placeholder:text-slate-400"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                        autoFocus
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.name}</p>}
                            </div>

                            {/* Username ID */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Login ID (Username)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] text-sm font-mono placeholder:text-slate-400"
                                    value={data.athlete_id}
                                    onChange={e => setData('athlete_id', e.target.value)}
                                    placeholder="e.g. admin_01"
                                />
                                {errors.athlete_id && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.athlete_id}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1 flex justify-between">
                                    Password
                                    {modalMode === 'edit' && <span className="text-slate-400 font-normal   normal-case text-[10px]">(leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input 
                                        type="password" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] text-sm placeholder:text-slate-400"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.password}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 mt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-[2] px-4 py-2.5 bg-[#00488b] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/10 hover:bg-[#003666] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                >
                                    {processing ? 'Saving...' : (modalMode === 'create' ? 'Create Account' : 'Update Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}