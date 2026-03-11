import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Ganti figtree dengan Plus Jakarta Sans
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Opsional: Kita definisikan warna brand biar konsisten
                primary: {
                    50: '#f0f6fe',
                    100: '#dde9fc',
                    200: '#c2dbfa',
                    300: '#9ac4f6',
                    400: '#6ca4f0',
                    500: '#4882e8',
                    600: '#3266db',
                    700: '#2a52c7',
                    800: '#00488b', // Warna Utama Anda
                    900: '#233b8a',
                }
            }
        },
    },

    plugins: [forms],
};