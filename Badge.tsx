
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    outline: 'bg-transparent text-slate-500 border-white/5'
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border tracking-tighter ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
