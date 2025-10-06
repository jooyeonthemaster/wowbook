'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export default function MobileLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  className = '',
}: MobileLayoutProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* 헤더 */}
      {showHeader && <Header />}

      {/* 메인 콘텐츠 */}
      <main
        className="relative z-10 min-h-screen"
        style={{
          paddingTop: showHeader ? '48px' : 0,
          paddingBottom: showBottomNav ? '70px' : 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 하단 네비게이션 */}
      {showBottomNav && <BottomNavigation />}

      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-purple-500/20 to-transparent opacity-50" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-pink-500/20 to-transparent opacity-30" />
      </div>

      {/* 데코레이션 요소들 - 정적 */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-40 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl opacity-30" />
      </div>
    </div>
  );
}
