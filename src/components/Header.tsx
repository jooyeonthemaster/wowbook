'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${className}`}
      style={{
        height: '48px',
        background: scrolled
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px)',
        borderBottom: scrolled
          ? '1px solid rgba(255, 255, 255, 0.15)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled
          ? '0 4px 16px rgba(0, 0, 0, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
        {/* 로고 */}
        <motion.div
          className="flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="text-xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ☀️
          </motion.div>
          <h1 className="font-bold text-base text-white text-glow tracking-tight">맑음</h1>
        </motion.div>
      </div>
    </motion.header>
  );
}
