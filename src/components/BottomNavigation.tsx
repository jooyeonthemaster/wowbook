'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: '홈',
    path: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    activeIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'programs',
    label: '프로그램',
    path: '/programs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    activeIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    ),
  },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const activeTab = navItems.find((item) => item.path === pathname)?.id || 'home';

  const handleTabChange = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS Safe Area 대응
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)', // iOS Safari 호환
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2" style={{ height: '56px' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isPressed = pressedTab === item.id;

          return (
            <motion.button
              key={item.id}
              className={`relative flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl min-w-[50px] transition-all duration-300 ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              onTouchStart={() => setPressedTab(item.id)}
              onTouchEnd={() => setPressedTab(null)}
              onMouseDown={() => setPressedTab(item.id)}
              onMouseUp={() => setPressedTab(null)}
              onMouseLeave={() => setPressedTab(null)}
              onClick={() => handleTabChange(item.path)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              {/* 활성 상태 배경 */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* 아이콘 */}
              <motion.div
                className="relative z-10 w-5 h-5"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {isActive ? item.activeIcon : item.icon}
                </div>
              </motion.div>

              {/* 라벨 */}
              <motion.span
                className={`text-[10px] font-semibold relative z-10 transition-all ${
                  isActive ? 'text-white' : 'text-white/50'
                }`}
                animate={{
                  scale: isActive ? 1.0 : 0.95,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {item.label}
              </motion.span>

              {/* 눌림 효과 */}
              {isPressed && (
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
