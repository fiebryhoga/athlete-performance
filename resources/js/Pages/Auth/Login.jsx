import { useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { KeyRound, User, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    
    const { app_settings } = usePage().props;
    
    const appName = app_settings?.name || 'Sistem Performa';
    const appLogo = app_settings?.logo; 

    const { data, setData, post, processing, errors, reset } = useForm({
        athlete_id: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-sans p-4 sm:p-6 relative overflow-hidden bg-slate-50">
            
            <Head title={`Masuk - ${appName}`} />

            {/* Decorative Background Blobs */}
            <div className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-orange-200/60 sm:bg-orange-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob pointer-events-none"></div>
            <div className="absolute bottom-[-5%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-amber-200/60 sm:bg-amber-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header App */}
                <div className="text-center mb-8 flex flex-col justify-center items-center">
                    <div className='flex justify-center items-center mb-5 h-20 w-20'>
                        {appLogo ? (
                            <img 
                                src={appLogo} 
                                alt="Logo Aplikasi" 
                                className="w-full h-full object-contain drop-shadow-sm" 
                            />
                        ) : (
                            <div className="w-16 h-16 bg-[#ff4d00] text-white rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-orange-500/20">
                                {appName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {appName}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Manajemen Performa & Operasional Olahraga
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/90 sm:bg-white backdrop-blur-xl sm:backdrop-blur-none rounded-3xl sm:rounded-xl shadow-2xl shadow-orange-500/10 sm:shadow-xl sm:shadow-slate-200/50 border border-white/60 sm:border-slate-100 p-6 sm:p-10 relative">
                    
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* ID Pengguna */}
                        <div className="space-y-2">
                            <label htmlFor="athlete_id" className="text-sm font-semibold text-slate-700 ml-1">
                                ID Pengguna
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                </div>
                                <input
                                    id="athlete_id"
                                    type="text"
                                    value={data.athlete_id}
                                    onChange={(e) => setData('athlete_id', e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg text-sm focus:bg-white focus:border-[#ff4d00] focus:ring-[#ff4d00]/20 focus:ring-4 transition-all duration-200 outline-none font-medium"
                                    placeholder="Masukkan ID Anda"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.athlete_id && (
                                <p className="text-rose-500 text-sm mt-1.5 ml-1 font-medium">{errors.athlete_id}</p>
                            )}
                        </div>

                        {/* Kata Sandi */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg text-sm focus:bg-white focus:border-[#ff4d00] focus:ring-[#ff4d00]/20 focus:ring-4 transition-all duration-200 outline-none font-medium"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-rose-500 text-sm mt-1.5 ml-1 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Ingat Saya */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-[#ff4d00] border-slate-300 rounded focus:ring-[#ff4d00] cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Ingat Saya</span>
                                </div>
                            </label>
                        </div>

                        {/* Tombol Masuk */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#ff4d00] text-white font-bold py-3.5 mt-2 rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:bg-[#e64500] transform active:scale-[0.98] transition-all duration-200 flex justify-center items-center text-sm disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                "Masuk ke Sistem"
                            )}
                        </button>
                    </form>

                    {/* Bantuan */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-100">
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Hubungi Administrator jika Anda mengalami kesulitan saat masuk.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-slate-400 opacity-80">
                        {appName} &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}