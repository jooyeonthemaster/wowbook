'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { WeatherDiary, AnalysisResult } from '@/types';

const weatherMoodEmoji: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
};

const weatherMoodLabel: Record<string, string> = {
  sunny: '맑음',
  'partly-cloudy': '구름조금',
  cloudy: '흐림',
  rainy: '비',
  stormy: '폭풍',
  snowy: '눈',
};

export default function MyPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [diaries, setDiaries] = useState<WeatherDiary[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDiaries();
      fetchResults();
    }
  }, [user, loading, router]);

  const fetchDiaries = async () => {
    if (!user) return;

    try {
      console.log('기상 일지 조회 시작, userId:', user.uid);
      const response = await fetch(`/api/diary?userId=${user.uid}`);
      const data = await response.json();

      console.log('기상 일지 조회 응답:', data);

      if (data.success) {
        setDiaries(data.diaries);
        console.log('기상 일지 개수:', data.diaries.length);
      } else {
        console.error('기상 일지 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('기상 일지 조회 실패:', error);
    }
  };

  const fetchResults = async () => {
    if (!user) return;

    try {
      setIsLoadingDiaries(true);
      const response = await fetch(`/api/results?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('결과 조회 실패:', error);
    } finally {
      setIsLoadingDiaries(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <MobileLayout>
      <div className="px-6 py-6">
        {/* 프로필 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {user.displayName || '사용자'}
                </h2>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all"
            >
              로그아웃
            </button>
          </GlassCard>
        </motion.div>

        {/* 기상 일지 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">나의 기상 일지</h3>

          {isLoadingDiaries ? (
            <div className="text-center py-12">
              <div className="text-white/60">불러오는 중...</div>
            </div>
          ) : (diaries.length === 0 && results.length === 0) ? (
            <GlassCard className="p-8 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-white/70 mb-4">아직 작성한 기상 일지가 없습니다</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium"
              >
                맑음 진단 시작하기
              </button>
            </GlassCard>
          ) : (
            <>
              {/* 저장된 분석 결과 */}
              {results.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-bold text-white/90">나의 맑음 기록</h4>
                  {results.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        sessionStorage.setItem('recommendationResult', JSON.stringify(item.result));
                        router.push('/result');
                      }}
                      className="cursor-pointer"
                    >
                      <GlassCard className="p-4 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">
                            {item.result.clarityType?.emoji || '☀️'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-white">
                                {item.result.clarityType?.name || '맑음 유형'}
                              </span>
                            </div>
                            <p className="text-xs text-white/60">
                              {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-white/40">
                            →
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 프로그램별 기상 일지 */}
              {diaries.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-white/90 mb-4">프로그램 기상 일지</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {diaries.map((diary, index) => (
                      <motion.div
                        key={diary.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <GlassCard className="p-3 h-full">
                          <div className="flex flex-col h-full">
                            <div className="text-3xl mb-2 text-center">
                              {weatherMoodEmoji[diary.mood]}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col gap-1.5 mb-2">
                                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] text-white font-medium text-center">
                                  {weatherMoodLabel[diary.mood]}
                                </span>
                                <span className="text-[10px] text-white/60 text-center">
                                  {new Date(diary.createdAt).toLocaleDateString('ko-KR', {
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-2 text-center">
                                {diary.programTitle}
                              </h4>
                              <p className="text-[11px] text-white/70 leading-snug line-clamp-3">
                                {diary.content}
                              </p>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
