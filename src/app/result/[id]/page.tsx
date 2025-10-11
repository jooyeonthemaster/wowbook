'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import ShareModal from '@/components/ShareModal';
import { RecommendationResult, ClarityTypeCode, ClarityType } from '@/types';
import { getClarityType } from '@/lib/clarityTypes';
import getProfileImageSrc from '@/lib/getProfileImageSrc';

// 궁합 좋은 유형 (2개)
function getCompatibleTypes(code: ClarityTypeCode): ClarityType[] {
  const compatibilityMap: Record<ClarityTypeCode, ClarityTypeCode[]> = {
    IBSC: ['IBLC', 'OBSC'],
    IBSW: ['IBLW', 'OBSW'],
    IBLC: ['IBSC', 'OBLC'],
    IBLW: ['IBSW', 'OBLW'],
    IGSC: ['IGLC', 'OGSC'],
    IGSW: ['IGLW', 'OGSW'],
    IGLC: ['IGSC', 'OGLC'],
    IGLW: ['IGSW', 'OGLW'],
    OBSC: ['IBSC', 'OBLC'],
    OBSW: ['IBSW', 'OBLW'],
    OBLC: ['IBLC', 'OBSC'],
    OBLW: ['IBLW', 'OBSW'],
    OGSC: ['IGSC', 'OGLC'],
    OGSW: ['IGSW', 'OGLW'],
    OGLC: ['IGLC', 'OGSC'],
    OGLW: ['IGLW', 'OGSW'],
  };
  
  return (compatibilityMap[code] || []).map(c => getClarityType(c));
}

// 충돌 유형 (2개)
function getConflictTypes(code: ClarityTypeCode): ClarityType[] {
  const conflictMap: Record<ClarityTypeCode, ClarityTypeCode[]> = {
    IBSC: ['OGLW', 'OGSW'],
    IBSW: ['OGLC', 'OGSC'],
    IBLC: ['OGSW', 'OGLW'],
    IBLW: ['OGSC', 'OGLC'],
    IGSC: ['OBLW', 'OBSW'],
    IGSW: ['OBLC', 'OBSC'],
    IGLC: ['OBSW', 'OBLW'],
    IGLW: ['OBSC', 'OBLC'],
    OBSC: ['IGLW', 'IGSW'],
    OBSW: ['IGLC', 'IGSC'],
    OBLC: ['IGSW', 'IGLW'],
    OBLW: ['IGSC', 'IGLC'],
    OGSC: ['IBLW', 'IBSW'],
    OGSW: ['IBLC', 'IBSC'],
    OGLC: ['IBSW', 'IBLW'],
    OGLW: ['IBSC', 'IBLC'],
  };
  
  return (conflictMap[code] || []).map(c => getClarityType(c));
}

// 궁합 이유
function getCompatibilityReason(myCode: ClarityTypeCode, theirCode: ClarityTypeCode): string {
  const reasons: Record<string, string> = {
    'IBSC-IBLC': '둘이 같이 있는데도 각자 책 읽는 거 가능. "뭐해?" 안 물어봐도 되고, 몇 시간 침묵해도 안 어색. 가끔 "이 부분 봐봐" 하면서 보여주면 딱 이해해줌. 말 안 해도 알아요.',
    'IBSC-OBSC': '새벽 카페에서 만나서 각자 책 읽다가 "이거 어떻게 생각해?" 물어보면 30분씩 진지하게 토론. 답장 늦어도 서로 이해함. 혼자 시간 필요한 거 존중.',
    'IBSW-IBLW': '전시 같이 가도 각자 알아서 보고, 끝나고 "그 작품 대박이지?" 하면 "완전! 나 울뻔했어" 이러면서 감성 공유. 같이 있어도 혼자 있는 것 같은 편안함.',
    'IBSW-OBSW': '둘이 카페에서 2시간 동안 진심 토크 가능. "나만 이래?" "아니 나도!" 하면서 서로 위로. 눈물 콧물 다 나와도 괜찮아요. 진짜 위로받는 느낌.',
    'IBLC-OBLC': '"어제 배운 거 있는데 설명해줄까?" "오 좋아!" 이러면서 노션 켜고 같이 정리. 설명하고 질문하면서 둘 다 더 이해됨. 1+1이 3 되는 느낌.',
    'IBLW-OBLW': '전시 끝나고 "저기도 가볼까?" "오 좋아" 하면서 즉흥적으로 여기저기. 둘 다 감성 사진 찍고, 인스타 스토리 서로 리그램. 취향이 딱 맞아요.',
    'IGSC-IGLC': '각자 작업실에서 밤새 작업하다가 새벽 4시에 "아직 안 자?" "너도?" ㅋㅋ 서로 몰입 모드 이해해줌. 완성하면 제일 먼저 보여주는 사이.',
    'IGSC-OGSC': '"이거 어떻게 생각해?" 물어보면 바로 논리적으로 피드백. 서로 날카롭게 지적해줘도 안 삐짐. 오히려 고마워함. 서로 자극되면서 발전.',
    'IGSW-IGLW': '둘 다 "오늘 기분 이상한데?" "나도, 뭐라도 해야겠어" 하면서 갑자기 창작 시작. 밤새 각자 만들고 아침에 서로 보여주기. 자유로운 영혼들.',
    'IGSW-OGSW': '공연장에서 만나면 둘 다 맨 앞 자리. "이거 진짜 좋다!" 하면서 눈물 흘리고, 끝나고 "우리 뭔가 만들자!" 하면서 바로 시작. 열정 폭발.',
    'IGLC-OGLC': '"이거 해볼까?" "오 재밌겠는데?" 하면서 바로 프로젝트 시작. 둘 다 배우는 거 좋아해서 밤새 자료 조사하고 공유. 혁신적인 거 만들어냄.',
    'IGLW-OGLW': '"오늘 뭐해?" "몰라, 일단 나가자" 하면서 계획 없이 떠남. 즉흥적으로 움직이는데 둘 다 좋아해서 완벽. 여행 가면 대박 잼.',
    'OBSC-OBLC': '북카페에서 3-4명 모여서 진지한 대화. "이 부분 어떻게 생각해?" 물어보면 각자 의견 나누고, 정리해서 공유. 스터디 모임 최적 조합.',
    'OBSW-OBLW': '소규모 모임에서 분위기 메이커 둘. 다 같이 편하게 웃고 떠들면서도 깊은 얘기 가능. "우리 또 언제 볼까?" 하면서 다음 약속 바로 잡음.',
    'OGSC-OGLC': '토론하다가 "그러면 이렇게 하면 어때?" "오 좋은데?" 하면서 바로 실행. 말만 하는 게 아니라 실천함. 추진력 미쳤음.',
    'OGSW-OGLW': '페스티벌에서 만나면 둘 다 "야 저기 가보자!" "오케!" 하면서 여기저기. 흥 돋우고 분위기 만들고, 모르는 사람도 끼워서 다 같이 놀아요.',
  };
  
  return reasons[`${myCode}-${theirCode}`] || '둘 다 맑아지는 방식이 비슷해서, 서로 이해가 잘 돼요. 함께 있으면 편안해요.';
}

// 충돌 이유
function getConflictReason(myCode: ClarityTypeCode, theirCode: ClarityTypeCode): string {
  const reasons: Record<string, string> = {
    'IBSC-OGLW': '당신: "혼자 있고 싶어..." / 이 유형: "야!! 놀러 가자!! 왜 집에만 있어??" → 서로 이해 불가. 당신한텐 지옥, 저한텐 당신이 답답.',
    'IBSC-OGSW': '당신: "조용히 생각 좀..." / 이 유형: "야 진짜 좋았어!! 너도 그랬지?!!" (텐션 MAX) → 당신 귀 아픔. 저 사람은 왜 조용한지 이해 못 함.',
  };
  
  const key = `${myCode}-${theirCode}`;
  if (reasons[key]) return reasons[key];
  
  const my = myCode.split('');
  const their = theirCode.split('');
  const diffs = my.filter((c, i) => c !== their[i]).length;
  
  if (diffs >= 3) {
    return '거의 모든 게 정반대라 "쟤는 왜 저러지?" 싶음. 서로 이해 못 함. 같이 있으면 하나는 피곤해요.';
  }
  return '맑아지는 방식이 좀 달라서, 가끔 "아 답답해" 할 수 있어요. 서로 노력 필요.';
}

export default function SharedResultPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const id = params.id as string;
        
        // 먼저 sessionStorage 확인
        const stored = sessionStorage.getItem('recommendationResult');
        const storedId = sessionStorage.getItem('resultId');
        
        if (stored && storedId === id) {
          setResult(JSON.parse(stored));
          setIsLoading(false);
          return;
        }

        // sessionStorage에 없으면 API로 불러오기
        const response = await fetch(`/api/results/${id}`);
        
        if (!response.ok) {
          throw new Error('결과를 찾을 수 없습니다');
        }

        const data = await response.json();
        
        if (data.success && data.result) {
          setResult(data.result.result);
        } else {
          throw new Error('결과를 불러올 수 없습니다');
        }
      } catch (err) {
        console.error('결과 로드 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [params.id]);

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <GlassCard className="text-center">
            <p className="text-white/80 text-lg">결과를 불러오는 중...</p>
          </GlassCard>
        </div>
      </MobileLayout>
    );
  }

  if (error || !result) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <GlassCard className="text-center">
            <p className="text-white/90 text-xl font-bold mb-4">😢</p>
            <p className="text-white/80 mb-4">{error || '결과를 찾을 수 없습니다'}</p>
            <Button variant="primary" onClick={() => router.push('/')}>
              처음으로 가기
            </Button>
          </GlassCard>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-6 py-6">
        <div className="w-full max-w-md mx-auto">
        
        {/* 맑음 유형 - 최상단 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <GlassCard className="text-center relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 text-9xl opacity-5">
              {result.clarityType.emoji.split('')[0]}
            </div>
            
            <div className="relative z-10">
              {/* 유형 이미지 */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-6 floating flex justify-center"
              >
                <img
                  src={getProfileImageSrc(result.clarityType.code)}
                  alt={result.clarityType.name}
                  className="w-48 h-48 object-contain"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(147, 197, 253, 0.5))',
                  }}
                />
              </motion.div>
              
              {/* 유형 이름 */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold mb-2 text-white text-glow"
              >
                {result.clarityType.name}
              </motion.h1>
              
              {/* 영문 이름 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-white/60 mb-4 font-medium"
              >
                {result.clarityType.nameEn}
              </motion.p>
              
              {/* 별명 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.3), rgba(125, 211, 252, 0.3))',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                <span className="text-sm font-bold text-white">
                  &ldquo;{result.clarityType.nickname}&rdquo;
                </span>
              </motion.div>
              
              {/* 설명 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-base text-white/90 leading-relaxed mb-6 px-4"
              >
                {result.clarityType.description}
              </motion.p>
              
              {/* 맑아지는 순간 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.1), rgba(125, 211, 252, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="text-xs font-bold text-white/80 mb-2">💫 당신이 맑아지는 순간</div>
                <p className="text-sm text-white/90 leading-relaxed italic">
                  &ldquo;{result.clarityType.clarityMoment}&rdquo;
                </p>
              </motion.div>
              
              {/* 대표 문장 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg font-bold text-white text-glow"
              >
                {result.clarityType.signature}
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
        
        {/* 추천 프로그램 */}
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
                  {/* 프로그램 상세 내용 - 기존과 동일 */}
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
                      <h3 className="text-xl font-bold leading-tight mb-2" style={{
                        background: 'linear-gradient(135deg, #bae6fd, #7dd3fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
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
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm" style={{
                      background: 'rgba(186, 230, 253, 0.2)',
                      border: '1px solid rgba(186, 230, 253, 0.4)',
                      color: 'white'
                    }}>
                      📅 {program.date}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm" style={{
                      background: 'rgba(147, 197, 253, 0.2)',
                      border: '1px solid rgba(147, 197, 253, 0.4)',
                      color: 'white'
                    }}>
                      ⏰ {program.time}
                    </span>
                  </div>
                  
                  <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm inline-flex" style={{
                    background: 'rgba(125, 211, 252, 0.2)',
                    border: '1px solid rgba(125, 211, 252, 0.4)',
                    color: 'white'
                  }}>
                    📍 {program.location}
                  </div>

                  {/* 설명 */}
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

                  {!isExpanded && program.description.length > 100 && (
                    <div className="text-center mb-3">
                      <span className="text-xs text-white/50 font-medium">
                        클릭하여 더보기 ▼
                      </span>
                    </div>
                  )}

                  {/* 추천 이유 */}
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
                  <div className="flex flex-wrap gap-1.5 mb-3">
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

                  {/* 예약 버튼 */}
                  <a
                    href={program.reservationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{
                      background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.3), rgba(244, 114, 182, 0.3))',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>프로그램 예약</span>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 핵심 특성 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white text-glow text-center">
            ✨ 당신의 특성
          </h2>
          <GlassCard>
            <div className="space-y-3">
              {result.clarityType.characteristics.map((characteristic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(186, 230, 253, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.4), rgba(125, 211, 252, 0.4))',
                  }}>
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <p className="flex-1 text-sm text-white font-medium">
                    {characteristic}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 잘 맞는 유형 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white text-glow text-center">
            💚 함께하면 좋은 유형
          </h2>
          <GlassCard>
            <div className="space-y-3">
              {getCompatibleTypes(result.clarityType.code).map((type, index) => (
                <motion.div
                  key={type.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{type.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1">{type.name}</h3>
                      <p className="text-xs text-white/70">{type.nickname}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {getCompatibilityReason(result.clarityType.code, type.code)}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 주의할 유형 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white text-glow text-center">
            ⚠️ 조심스러운 유형
          </h2>
          <GlassCard>
            <div className="space-y-3">
              {getConflictTypes(result.clarityType.code).map((type, index) => (
                <motion.div
                  key={type.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.1))',
                    border: '1px solid rgba(251, 146, 60, 0.3)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{type.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1">{type.name}</h3>
                      <p className="text-xs text-white/70">{type.nickname}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {getConflictReason(result.clarityType.code, type.code)}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsShareModalOpen(true)}
          >
            ✨ 공유하기 ✨
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push('/')}
          >
            나도 진단하러 가기
          </Button>
        </div>

        {/* 공유 모달 */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          result={result}
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
        />
        </div>
      </div>
    </MobileLayout>
  );
}

