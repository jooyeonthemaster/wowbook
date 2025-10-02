'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import WeatherDiaryModal from '@/components/WeatherDiaryModal';
import { wowbookPrograms } from '@/lib/programs';
import { WowbookProgram } from '@/types';

export default function ProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<WowbookProgram | null>(null);
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  const categories = ['all', '개막행사', '와우스페셜', '와우판타스틱서재', '와우국제교류', '폐막토크'];

  const filteredPrograms = selectedCategory === 'all'
    ? wowbookPrograms
    : wowbookPrograms.filter(p => p.category === selectedCategory);

  const handleWriteDiary = (program: WowbookProgram) => {
    setSelectedProgram(program);
    setShowDiaryModal(true);
  };

  return (
    <MobileLayout>
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">프로그램 목록</h1>
          <p className="text-sm text-white/70">
            21회 서울와우북페스티벌의 모든 프로그램을 확인하세요
          </p>
        </motion.div>

        {/* 카테고리 필터 */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>

        {/* 프로그램 리스트 */}
        <div className="space-y-4">
          {filteredPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-white/20 rounded text-xs text-white font-medium">
                        {program.category}
                      </span>
                      <span className="text-xs text-white/60">
                        {program.date} {program.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {program.title}
                    </h3>
                    <p className="text-sm text-white/70 mb-3 line-clamp-3">
                      {program.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {program.location}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {program.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 기상 일지 작성 버튼 */}
                <button
                  onClick={() => handleWriteDiary(program)}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  기상 일지 작성
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">해당 카테고리에 프로그램이 없습니다</p>
          </div>
        )}
      </div>

      {/* 기상 일지 모달 */}
      {selectedProgram && (
        <WeatherDiaryModal
          program={selectedProgram}
          isOpen={showDiaryModal}
          onClose={() => {
            setShowDiaryModal(false);
            setSelectedProgram(null);
          }}
          onSave={() => {
            // 저장 성공 시 알림
            alert('기상 일지가 저장되었습니다!');
          }}
        />
      )}
    </MobileLayout>
  );
}
