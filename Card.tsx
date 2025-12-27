
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-[3rem] p-10 transition-all relative overflow-hidden backdrop-blur-3xl ${hover ? 'hover:bg-white/10' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
