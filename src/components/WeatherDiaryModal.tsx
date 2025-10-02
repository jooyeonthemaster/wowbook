'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import Button from './Button';
import WeatherIcon from './WeatherIcon';
import { WeatherMood, WowbookProgram } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface WeatherDiaryModalProps {
  program: WowbookProgram;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const weatherMoods: { mood: WeatherMood; label: string; emoji: string }[] = [
  { mood: 'sunny', label: '맑음', emoji: '☀️' },
  { mood: 'partly-cloudy', label: '구름조금', emoji: '⛅' },
  { mood: 'cloudy', label: '흐림', emoji: '☁️' },
  { mood: 'rainy', label: '비', emoji: '🌧️' },
  { mood: 'stormy', label: '폭풍', emoji: '⛈️' },
  { mood: 'snowy', label: '눈', emoji: '❄️' },
];

export default function WeatherDiaryModal({ program, isOpen, onClose, onSave }: WeatherDiaryModalProps) {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<WeatherMood | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood || !content.trim() || !user) return;

    setIsSaving(true);

    try {
      const requestBody = {
        userId: user.uid,
        programId: program.id,
        programTitle: program.title,
        mood: selectedMood,
        content: content.trim(),
      };

      console.log('기상 일지 저장 요청:', requestBody);

      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('기상 일지 저장 응답:', data);

      if (!response.ok) {
        throw new Error(data.error || '저장 실패');
      }

      // 성공 처리
      alert('기상 일지가 저장되었습니다!');
      setSelectedMood(null);
      setContent('');
      onSave?.();
      onClose();
    } catch (error) {
      console.error('기상 일지 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-[340px] max-h-[75vh] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 - 고정 */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2.5 border-b border-white/10 flex-shrink-0">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-sm font-bold text-white mb-0.5">나의 기상 일지</h3>
                <p className="text-[11px] text-white/60 truncate">{program.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 스크롤 가능한 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto px-4 py-3" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* 날씨 선택 */}
              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-white mb-2">
                  프로그램을 체험한 기분은?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {weatherMoods.map((item) => (
                    <button
                      key={item.mood}
                      onClick={() => setSelectedMood(item.mood)}
                      className={`py-2 px-1.5 rounded-lg transition-all ${
                        selectedMood === item.mood
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 ring-2 ring-purple-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{item.emoji}</div>
                      <div className="text-[9px] text-white font-medium">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 소감 작성 */}
              <div>
                <label className="block text-xs font-semibold text-white mb-2">
                  짧은 소감을 적어주세요
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="이 프로그램을 체험하며 느낀 점을 자유롭게 적어주세요..."
                  className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={200}
                />
                <div className="text-[10px] text-white/40 text-right mt-1">
                  {content.length}/200
                </div>
              </div>
            </div>

            {/* 버튼 - 고정 */}
            <div className="flex gap-2 px-4 py-3 border-t border-white/10 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-white font-semibold transition-all"
                disabled={isSaving}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedMood || !content.trim() || isSaving}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-xs text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
