import { useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    // 1. Get Global Settings (Dynamic Branding)
    const { app_settings } = usePage().props;
    
    // Default values if settings are missing
    const appName = app_settings?.name || 'Performance Dashboard';
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
        <div className="min-h-screen flex flex-col justify-center items-center font-sans p-6 relative overflow-hidden bg-slate-50">
            {/* Dynamic Browser Title */}
            <Head title={`Log in - ${appName}`} />

            {/* Background Accent (Soft Blobs) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-[420px] z-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-8 flex flex-col justify-center items-center">
                    <div className='flex justify-center items-center mb-4 h-20 w-20'>
                        {appLogo ? (
                            // Display Uploaded Logo
                            <img 
                                src={appLogo} 
                                alt="App Logo" 
                                className="w-full h-full object-contain drop-shadow-sm" 
                            />
                        ) : (
                            // Fallback Initial Logo
                            <div className="w-16 h-16 bg-[#00488b] text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-900/20">
                                {appName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {appName}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Sports Analytics System
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 backdrop-blur-sm relative">
                    
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Input: Athlete ID / Username */}
                        <div className="space-y-1.5">
                            <label htmlFor="athlete_id" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                                User ID / Athlete
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="athlete_id"
                                    type="text"
                                    value={data.athlete_id}
                                    onChange={(e) => setData('athlete_id', e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:bg-white focus:border-[#00488b] focus:ring-[#00488b] focus:ring-1 transition-all duration-200"
                                    placeholder="Enter your ID"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.athlete_id && (
                                <p className="text-red-500 text-xs mt-1 ml-1 font-medium animate-pulse">{errors.athlete_id}</p>
                            )}
                        </div>

                        {/* Input: Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:bg-white focus:border-[#00488b] focus:ring-[#00488b] focus:ring-1 transition-all duration-200"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 ml-1 font-medium animate-pulse">{errors.password}</p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-[#00488b] border-slate-300 rounded focus:ring-[#00488b] cursor-pointer"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                                </div>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#00488b] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#003666] transform active:scale-[0.98] transition-all duration-200 flex justify-center items-center text-sm tracking-wide"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Sign In to Dashboard"
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-100">
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Contact Admin if you have trouble logging in.
                        </p>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-400 tracking-wider opacity-70 uppercase">
                        {appName} &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}