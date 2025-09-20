import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'soft' | 'medium' | 'strong';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'soft'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    strong: 'shadow-strong'
  };

  return (
    <div className={`
      bg-white rounded-xl border border-gray-100 
      ${shadowClasses[shadow]} 
      ${paddingClasses[padding]} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
