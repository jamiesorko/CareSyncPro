
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center';
  
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    danger: 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-500',
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500',
    ghost: 'text-slate-500 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[8px]',
    md: 'px-6 py-3 text-[9px]',
    lg: 'px-8 py-4 text-[10px]',
    xl: 'px-12 py-6 text-xs tracking-[0.2em]'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
