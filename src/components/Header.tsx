'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

        {/* 사용자 영역 */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <motion.button
                className="flex items-center gap-1 p-1.5 rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.08, background: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 1), rgba(168, 85, 247, 1))',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <span className="text-xs">👤</span>
                </div>
              </motion.button>

              {/* 사이드 메뉴 */}
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    {/* 배경 오버레이 */}
                    <motion.div
                      className="fixed inset-0 bg-black/20 z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* 사이드바 */}
                    <motion.div
                      className="fixed right-0 top-0 h-full w-64 shadow-2xl z-50 bg-white"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="p-6 border-b border-gray-200">
                        <p className="font-medium text-gray-900 text-base">
                          {user.displayName || '사용자'}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">{user.email}</p>
                      </div>

                      <div className="p-4">
                        <motion.button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all flex items-center gap-3"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>🚪</span>
                          <span>로그아웃</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}
