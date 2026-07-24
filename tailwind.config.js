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
                // Menggunakan font Plus Jakarta Sans yang sangat premium dan modern
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
                    800: '#00488b',
                    900: '#233b8a',
                },
                // Override default orange with the requested brand color #ed4e18
                orange: {
                    50: '#fdf4f1',
                    100: '#fce6df',
                    200: '#f7c8b8',
                    300: '#f2a38b',
                    400: '#eb7555',
                    500: '#ed4e18', // User's requested primary brand color
                    600: '#da3e0f',
                    700: '#b52f0a',
                    800: '#90260c',
                    900: '#73210d',
                    950: '#3e0e04',
                }
            }
        },
    },

    plugins: [forms],
};