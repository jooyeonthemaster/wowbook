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
          paddingBottom: showBottomNav
            ? 'calc(56px + env(safe-area-inset-bottom))' // iOS Safe Area 고려
            : 0,
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
    </div>
  );
}
