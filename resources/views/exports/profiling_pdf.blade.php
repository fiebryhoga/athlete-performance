<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Profiling Report - {{ $athlete->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { max-width: 150px; }
    </style>
</head>
<body>
    <div class="header">
        @if($clubLogo)
            <img src="{{ $clubLogo }}" class="logo">
        @endif
        <h2>Laporan Profiling Atlet</h2>
        <p>Nama: {{ $athlete->name }}</p>
        <p>Olahraga: {{ $athlete->sport->name ?? '-' }}</p>
    </div>

    <div>
        <h3>Data Profiling</h3>
        <!-- TODO: Tambahkan tabel dan data profiling di sini -->
        <p>Data profiling untuk atlet ini sedang dalam pengembangan.</p>
    </div>
</body>
</html>
