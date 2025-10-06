'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import WeatherIcon from '@/components/WeatherIcon';

export default function Home() {
  const router = useRouter();

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center px-6 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* 메인 대시보드 카드 */}
        <GlassCard className="mb-6">
          {/* 헤더 정보 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/90 font-medium">📍 마음 날씨</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70">21회 와우북페스티벌</span>
            </div>
          </div>

          {/* 대형 날씨 디스플레이 */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <div className="flex-1">
              <p className="text-sm text-white/80 font-medium mb-1 whitespace-nowrap">
                당신의 마음은?
              </p>
              <motion.div
                className="text-6xl font-bold text-white text-glow mb-1"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                    '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,255,255,0.7)',
                    '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                맑음
              </motion.div>
            </div>
            <div className="flex-shrink-0">
              <WeatherIcon type="partly-cloudy" size="lg" />
            </div>
          </div>

          {/* 정보 그리드 */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="text-2xl mb-1">🌤️</div>
              <div className="text-xs text-white font-bold">오늘</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="text-2xl mb-1">☀️</div>
              <div className="text-xs text-white font-bold">내일</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="text-2xl mb-1">🌈</div>
              <div className="text-xs text-white font-bold">모레</div>
            </motion.div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-white/20 pt-5 mb-5" />

          {/* 설명 */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center glass">
                <span className="text-lg">📖</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-semibold">
                  21회 서울와우북페스티벌
                </p>
                <p className="text-xs text-white/70">
                  10.17 - 10.19
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center glass">
                <span className="text-lg">🎯</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-semibold">
                  나의 맑음 유형 진단
                </p>
                <p className="text-xs text-white/70">
                  8개 질문 · 3분 소요 · 16가지 유형
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/questions')}
          >
            ✨ 시작하기 ✨
          </Button>
        </GlassCard>
      </motion.div>
      </div>
    </MobileLayout>
  );
}
