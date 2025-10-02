'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminStats, ProgramStats, KeywordAnalysis } from '@/types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

const COLORS = ['#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#fb7185'];

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [keywords, setKeywords] = useState<{ [programId: string]: KeywordAnalysis }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [analyzingProgram, setAnalyzingProgram] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('통계 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeKeywords = async (program: ProgramStats) => {
    try {
      setAnalyzingProgram(program.programId);

      const contents = program.diaries.map(d => d.content);

      const response = await fetch('/api/admin/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          programTitle: program.programTitle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setKeywords(prev => ({
          ...prev,
          [program.programId]: data.analysis,
        }));
      }
    } catch (error) {
      console.error('키워드 분석 실패:', error);
    } finally {
      setAnalyzingProgram(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">📊 통계 불러오는 중...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white">통계 데이터가 없습니다</div>
      </div>
    );
  }

  // 차트 데이터 준비
  const programChartData = stats.programStats.map(p => ({
    name: p.programTitle.length > 15 ? p.programTitle.substring(0, 15) + '...' : p.programTitle,
    일지수: p.totalDiaries,
    참여자: p.uniqueUsers,
  }));

  // 전체 날씨 분포
  const totalMoodDistribution = stats.programStats.reduce((acc, program) => {
    Object.entries(program.moodDistribution).forEach(([mood, count]) => {
      acc[mood] = (acc[mood] || 0) + count;
    });
    return acc;
  }, {} as Record<string, number>);

  const moodPieData = Object.entries(totalMoodDistribution).map(([mood, count]) => ({
    name: weatherMoodLabel[mood],
    value: count,
    emoji: weatherMoodEmoji[mood],
  }));

  // 날씨별 평균 점수 계산
  const moodStats = Object.entries(totalMoodDistribution).map(([mood, count]) => ({
    mood: weatherMoodLabel[mood],
    emoji: weatherMoodEmoji[mood],
    count,
    percentage: ((count / stats.totalDiaries) * 100).toFixed(1),
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-pink-900 p-8">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">📊 Admin Dashboard</h1>
        <p className="text-lg text-white/70">21회 서울와우북페스티벌 기상 일지 분석</p>
      </motion.div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="text-4xl mb-3">📝</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalDiaries}</div>
          <div className="text-sm text-white/60">총 기상 일지</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="text-4xl mb-3">👥</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
          <div className="text-sm text-white/60">참여 사용자</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="text-4xl mb-3">📚</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.programStats.length}</div>
          <div className="text-sm text-white/60">프로그램 수</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="text-4xl mb-3">{moodStats[0]?.emoji}</div>
          <div className="text-3xl font-bold text-white mb-1">{moodStats[0]?.mood}</div>
          <div className="text-sm text-white/60">가장 많은 날씨 ({moodStats[0]?.percentage}%)</div>
        </motion.div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* 프로그램별 일지 수 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">📊 프로그램별 참여 통계</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={programChartData.slice(0, 8)} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#ffffff', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis tick={{ fill: '#ffffff' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff40', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Bar dataKey="일지수" fill="#a78bfa" />
              <Bar dataKey="참여자" fill="#f472b6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 전체 날씨 분포 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">🌤️ 전체 날씨 분포</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={moodPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: unknown) => {
                  const {
                    cx,
                    cy,
                    midAngle,
                    outerRadius,
                    percent,
                    name,
                  } = props as {
                    cx: number;
                    cy: number;
                    midAngle: number;
                    outerRadius: number;
                    percent: number;
                    name: string;
                  };
                  if (percent === 0) return null;
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize="12"
                    >
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {moodPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff40', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 날씨별 통계 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">🌈 날씨별 상세 통계</h2>
        <div className="grid grid-cols-6 gap-4">
          {moodStats.map((stat, index) => (
            <div key={stat.mood} className="text-center">
              <div className="text-4xl mb-2">{stat.emoji}</div>
              <div className="text-lg font-bold text-white">{stat.count}</div>
              <div className="text-sm text-white/60">{stat.mood}</div>
              <div className="text-xs text-white/40">{stat.percentage}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 프로그램 순위 및 상세 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">🏆 프로그램 순위 및 상세 분석</h2>

        <div className="grid grid-cols-1 gap-4">
          {stats.programStats.map((program, index) => (
            <div
              key={program.programId}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                    <h3 className="text-xl font-bold text-white">{program.programTitle}</h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/60">
                    <span>📝 {program.totalDiaries}개 일지</span>
                    <span>👥 {program.uniqueUsers}명 참여</span>
                    <span>💬 평균 {(program.totalDiaries / program.uniqueUsers).toFixed(1)}개/인</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-4xl mb-1">{weatherMoodEmoji[program.topMood]}</div>
                    <div className="text-xs text-white/60">대표 날씨</div>
                  </div>
                </div>
              </div>

              {/* 날씨 분포 바 */}
              <div className="mb-4">
                <div className="text-xs text-white/60 mb-2">날씨 분포</div>
                <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                  {Object.entries(program.moodDistribution).map(([mood, count]) => {
                    const percentage = (count / program.totalDiaries) * 100;
                    return count > 0 ? (
                      <div
                        key={mood}
                        className="group relative"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[Object.keys(weatherMoodEmoji).indexOf(mood) % COLORS.length],
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {weatherMoodEmoji[mood]} {count}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* 키워드 분석 */}
              <div>
                <button
                  onClick={() => analyzeKeywords(program)}
                  disabled={analyzingProgram === program.programId}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                >
                  {analyzingProgram === program.programId ? '분석 중...' : '🔍 키워드 분석'}
                </button>

                {keywords[program.programId] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-white mb-2">핵심 키워드</div>
                      <div className="flex flex-wrap gap-2">
                        {keywords[program.programId].keywords.slice(0, 10).map((kw, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full text-xs text-white font-medium"
                          >
                            {kw.word} <span className="text-purple-300">({kw.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-2">AI 요약</div>
                      <p className="text-sm text-white/80 leading-relaxed">{keywords[program.programId].summary}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
