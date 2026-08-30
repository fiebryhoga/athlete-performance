<!DOCTYPE html>
<html lang="id" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Error') — OTS Performance</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="h-full bg-white text-slate-800 antialiased flex flex-col justify-between selection:bg-orange-500 selection:text-white">
    
    <!-- Header -->
    <header class="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <a href="/" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center p-1 group-hover:border-slate-300 transition-colors">
                <img src="/assets/images/otslogo.png" alt="OTS Logo" class="w-full h-full object-contain" onerror="this.src='/assets/images/app-logo.png'">
            </div>
            <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-900 leading-tight">OTS Performance</span>
                <span class="text-[10px] text-slate-400 font-medium">Athlete Management System</span>
            </div>
        </a>

        <div class="flex items-center gap-2">
            <a href="/dashboard" class="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-50">
                Dashboard
            </a>
            @auth
                <form method="POST" action="{{ route('logout') }}" class="inline">
                    @csrf
                    <button type="submit" class="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors px-3 py-1.5 rounded-md hover:bg-rose-50 cursor-pointer">
                        Keluar
                    </button>
                </form>
            @endauth
        </div>
    </header>

    <!-- Main Clean Card -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md text-center space-y-6">
            
            <!-- Large Minimalist Number -->
            <div class="text-7xl sm:text-8xl font-black tracking-tighter text-slate-200 select-none leading-none">
                @yield('code', '404')
            </div>

            <!-- Headings -->
            <div class="space-y-2">
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    @yield('heading')
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                    @yield('message')
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button onclick="window.history.length > 1 ? window.history.back() : window.location.href='/dashboard'" 
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span>Halaman Sebelumnya</span>
                </button>

                <a href="/dashboard" 
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>Kembali ke Dashboard</span>
                </a>
            </div>

        </div>
    </main>

    <!-- Footer -->
    <footer class="w-full max-w-5xl mx-auto px-6 py-5 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
        &copy; {{ date('Y') }} OTS Performance. All rights reserved.
    </footer>

</body>
</html>
