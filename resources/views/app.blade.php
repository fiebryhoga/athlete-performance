<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Primary Meta SEO Tags -->
        <title inertia>{{ config('app.name', 'Olympus Training Surabaya') }}</title>
        <meta name="description" content="Platform terpadu pemantauan performa atlet, tes fisik, komposisi tubuh, analisis DPA, program latihan, nutrisi, dan manajemen sesi Olympus Training Surabaya.">
        <meta name="keywords" content="Olympus Training Surabaya, OTS, Athlete Performance, Gym Management, Tes Fisik, Analisis DPA, Surabaya Fitness, Personal Training">
        <meta name="author" content="Olympus Training Surabaya">
        <meta name="robots" content="index, follow">

        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:title" content="Olympus Training Surabaya — Athlete Performance & Management System">
        <meta property="og:description" content="Platform terpadu pemantauan performa atlet, tes fisik, komposisi tubuh, analisis DPA, program latihan, nutrisi, dan manajemen sesi Olympus Training Surabaya.">
        <meta property="og:image" content="{{ asset('assets/images/otslogo.png') }}">
        <meta property="og:site_name" content="Olympus Training Surabaya">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Olympus Training Surabaya — Athlete Performance & Management System">
        <meta name="twitter:description" content="Platform terpadu pemantauan performa atlet, tes fisik, komposisi tubuh, analisis DPA, program latihan, nutrisi, dan manajemen sesi Olympus Training Surabaya.">
        <meta name="twitter:image" content="{{ asset('assets/images/otslogo.png') }}">

        <link rel="icon" type="image/png" href="{{ asset('favicon-96x96.png') }}" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}" />
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}" />
        <link rel="manifest" href="{{ asset('site.webmanifest') }}" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-white text-slate-600">
        @inertia
    </body>
</html>