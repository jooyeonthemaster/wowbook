'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import WeatherIcon from '@/components/WeatherIcon';
import CircularProgress from '@/components/CircularProgress';
import StatCard from '@/components/StatCard';
import Thermometer from '@/components/Thermometer';
import MiniBarChart from '@/components/MiniBarChart';
import IconStat from '@/components/IconStat';
import { RecommendationResult, JourneyStep } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function ResultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('recommendationResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push('/');
    }
  }, [router]);

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-white/80 text-lg">로딩 중...</p>
      </div>
    );
  }

  const getWeatherType = (clarity: number) => {
    if (clarity >= 80) return 'sunny';
    if (clarity >= 60) return 'partly-cloudy';
    if (clarity >= 40) return 'cloudy';
    if (clarity >= 20) return 'rainy';
    return 'stormy';
  };

  const getClarityMessage = (clarity: number) => {
    if (clarity >= 80) return '맑은 하늘';
    if (clarity >= 60) return '구름 낀 맑음';
    if (clarity >= 40) return '흐림';
    if (clarity >= 20) return '비';
    return '폭풍';
  };

  return (
    <MobileLayout>
      <div className="px-6 py-6">
        <div className="w-full max-w-md mx-auto">
        {/* 추천 프로그램 - 최상단 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white text-glow text-center">
            🎯 당신을 위한 추천 프로그램
          </h2>
          <div className="space-y-3">
            {result.recommendedPrograms.map((program, index) => {
              const isExpanded = expandedProgram === program.id;
              
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-4 glass-hover cursor-pointer"
                  onClick={() => toggleProgram(program.id)}
                >
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(186, 230, 253, 1), rgba(125, 211, 252, 1))',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(147, 197, 253, 0.5)'
                          }}
                        >
                          {program.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight mb-2">
                        {program.title}
                      </h3>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-4xl opacity-80">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl text-white/60"
                      >
                        ▼
                      </motion.div>
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="flex items-center gap-3 mb-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      📅 {program.date}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏰ {program.time}
                    </span>
                  </div>
                  
                  <div className="text-sm text-white/80 mb-3 flex items-center gap-1">
                    📍 {program.location}
                  </div>

                  {/* 설명 - 토글 가능 */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : '48px',
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden mb-3"
                  >
                    <p className="text-sm text-white/90 leading-relaxed">
                      {program.description}
                    </p>
                  </motion.div>

                  {/* 더보기 표시 */}
                  {!isExpanded && program.description.length > 100 && (
                    <div className="text-center mb-3">
                      <span className="text-xs text-white/50 font-medium">
                        클릭하여 더보기 ▼
                      </span>
                    </div>
                  )}

                  {/* 🔥 추천 이유 (주접 가득한 멘트) */}
                  {result.programReasons?.[program.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="mb-3 p-4 rounded-xl relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.15), rgba(125, 211, 252, 0.15))',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 20px rgba(147, 197, 253, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {/* 배경 장식 */}
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        {index === 0 ? '🎯' : index === 1 ? '✨' : '💫'}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🔥</span>
                          <span className="text-xs font-bold text-white/90">
                            왜 이게 당신한테 완벽한가요?
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-white font-medium">
                          {result.programReasons[program.id]}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1.5">
                    {program.tags.slice(0, isExpanded ? undefined : 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 맑음 지수 메인 - 듀얼 디스플레이 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* 온도계 스타일 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-6 flex items-center justify-center"
          >
            <Thermometer value={result.clarity} height={180} label="맑음 지수" />
          </motion.div>
          
          {/* 원형 + 날씨 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-6 flex flex-col items-center justify-center"
          >
            <div className="mb-3">
              <WeatherIcon type={getWeatherType(result.clarity)} size="lg" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white text-glow text-center">
              {getClarityMessage(result.clarity)}
            </h1>
            <p className="text-sm text-white/70 text-center">
              당신의 마음 상태
            </p>
          </motion.div>
        </div>

        {/* 감정 프로필 - 듀얼 뷰 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white text-glow text-center">
            당신의 감정 프로필
          </h2>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* 바 차트 스타일 */}
            <GlassCard delay={0.2}>
              <MiniBarChart
                data={[
                  { label: '평온함', value: result.userEmotionProfile.calm, icon: '🧘' },
                  { label: '활동성', value: result.userEmotionProfile.active, icon: '⚡' },
                  { label: '성찰', value: result.userEmotionProfile.reflective, icon: '💭' },
                  { label: '교류', value: result.userEmotionProfile.social, icon: '🤝' },
                ]}
              />
            </GlassCard>
          </div>

          {/* 아이콘 통계 그리드 */}
          <div className="grid grid-cols-4 gap-2">
            <IconStat
              icon="🧘"
              value={result.userEmotionProfile.calm}
              label="평온함"
              color="rgba(186, 230, 253, 1)"
              delay={0.3}
            />
            <IconStat
              icon="⚡"
              value={result.userEmotionProfile.active}
              label="활동성"
              color="rgba(147, 197, 253, 1)"
              delay={0.4}
            />
            <IconStat
              icon="💭"
              value={result.userEmotionProfile.reflective}
              label="성찰"
              color="rgba(125, 211, 252, 1)"
              delay={0.5}
            />
            <IconStat
              icon="🤝"
              value={result.userEmotionProfile.social}
              label="교류"
              color="rgba(165, 243, 252, 1)"
              delay={0.6}
            />
          </div>
        </div>

        {/* 맑아지는 여정 - 시각적 카드 그리드 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-glow text-center">
            ✨ 당신의 여정 ✨
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {result.journey.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass rounded-2xl p-6 relative overflow-hidden glass-hover"
                style={{
                  background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.2), rgba(125, 211, 252, 0.15))',
                }}
              >
                {/* 배경 이모지 */}
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-5">
                  {step.icon}
                </div>
                
                <div className="relative z-10 flex items-center gap-6">
                  {/* 아이콘 섹션 */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.4), rgba(125, 211, 252, 0.4))',
                      boxShadow: '0 4px 20px rgba(147, 197, 253, 0.4)'
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  {/* 텍스트 섹션 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white text-glow">
                        {step.keyword}
                      </h3>
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-bold"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      >
                        STEP {index + 1}
                      </span>
                    </div>
                    <p className="text-base text-white/90 font-medium mb-2">
                      {step.action}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <span>📅</span>
                      <span>{step.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              sessionStorage.removeItem('recommendationResult');
              router.push('/');
            }}
          >
            처음으로 돌아가기
          </Button>
          <Button
            variant="outline"
            fullWidth
            disabled={isSaving}
            onClick={async () => {
              if (!user) {
                alert('로그인이 필요한 기능입니다.');
                router.push('/login');
                return;
              }

              try {
                setIsSaving(true);
                
                // 사용자의 답변도 함께 저장
                const storedAnswers = sessionStorage.getItem('userAnswers');
                
                const response = await fetch('/api/results', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.uid,
                    result,
                    answers: storedAnswers ? JSON.parse(storedAnswers) : [],
                  }),
                });

                const data = await response.json();

                if (data.success) {
                  alert('✨ 결과가 나의 기상 일지에 저장되었습니다!');
                } else {
                  throw new Error(data.error);
                }
              } catch (error) {
                console.error('저장 실패:', error);
                alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
              } finally {
                setIsSaving(false);
              }
            }}
          >
            {isSaving ? '저장 중...' : '결과 저장하기'}
          </Button>
        </div>
        </div>
      </div>
    </MobileLayout>
  );
}

