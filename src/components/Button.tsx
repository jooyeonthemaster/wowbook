'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 relative overflow-hidden';
  
  const variantClasses = {
    primary: 'text-white shadow-2xl',
    secondary: 'glass text-white border-2 border-white/30',
    outline: 'border-2 border-white text-white bg-transparent',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.8) 0%, rgba(147, 197, 253, 0.8) 50%, rgba(125, 211, 252, 0.8) 100%)',
      boxShadow: `
        0 8px 32px rgba(147, 197, 253, 0.4),
        0 0 60px rgba(186, 230, 253, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.5)
      `,
    },
    secondary: {},
    outline: {},
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: variant === 'primary' ? `
          0 12px 48px rgba(147, 197, 253, 0.5),
          0 0 80px rgba(186, 230, 253, 0.4),
          inset 0 2px 0 rgba(255, 255, 255, 0.6)
        ` : undefined
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={variantStyles[variant]}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

