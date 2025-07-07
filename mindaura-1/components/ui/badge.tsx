import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-white bg-indigo-600 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;