import React from 'react';

export default function PageHeader({ 
    title, 
    description, 
    badge,
    icon: Icon,
    actions,
    className = "",
}) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs border border-orange-100/60">
                            <Icon size={14} />
                        </div>
                    )}
                    <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200/60">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
