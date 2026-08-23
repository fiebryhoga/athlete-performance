import React from 'react';

export default function PageFooter({
    brand = "Olympus Training Surabaya",
    description = "Pusat Pengembangan Atlet & Analisis Performa Olahraga",
    className = "",
}) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`pt-3 pb-1 mt-2 text-center font-semibold ${className}`}>
            <p className="text-[11px] text-slate-400 leading-relaxed">
                © {currentYear} <span className="text-slate-600">{brand}</span>. {description}
            </p>
        </footer>
    );
}
