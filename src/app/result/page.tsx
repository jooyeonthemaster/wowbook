'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import ShareModal from '@/components/ShareModal';
import { RecommendationResult, ClarityTypeCode, ClarityType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getClarityType } from '@/lib/clarityTypes';

// 궁합 좋은 유형 (2개)
function getCompatibleTypes(code: ClarityTypeCode): ClarityType[] {
  const compatibilityMap: Record<ClarityTypeCode, ClarityTypeCode[]> = {
    IBSC: ['IBLC', 'OBSC'], // 같은 고요 + 논리
    IBSW: ['IBLW', 'OBSW'], // 같은 고요 + 감성
    IBLC: ['IBSC', 'OBLC'], // 같은 고요 + 논리
    IBLW: ['IBSW', 'OBLW'], // 같은 고요 + 감성
    IGSC: ['IGLC', 'OGSC'], // 같은 역동 + 논리
    IGSW: ['IGLW', 'OGSW'], // 같은 역동 + 감성
    IGLC: ['IGSC', 'OGLC'], // 같은 역동 + 논리
    IGLW: ['IGSW', 'OGLW'], // 같은 역동 + 감성
    OBSC: ['IBSC', 'OBLC'], // 같은 고요 + 논리
    OBSW: ['IBSW', 'OBLW'], // 같은 고요 + 감성
    OBLC: ['IBLC', 'OBSC'], // 같은 고요 + 논리
    OBLW: ['IBLW', 'OBSW'], // 같은 고요 + 감성
    OGSC: ['IGSC', 'OGLC'], // 같은 역동 + 논리
    OGSW: ['IGSW', 'OGLW'], // 같은 역동 + 감성
    OGLC: ['IGLC', 'OGSC'], // 같은 역동 + 논리
    OGLW: ['IGLW', 'OGSW'], // 같은 역동 + 감성
  };
  
  return (compatibilityMap[code] || []).map(c => getClarityType(c));
}

// 충돌 유형 (2개)
function getConflictTypes(code: ClarityTypeCode): ClarityType[] {
  const conflictMap: Record<ClarityTypeCode, ClarityTypeCode[]> = {
    IBSC: ['OGLW', 'OGSW'], // 정반대 (혼자고요논리 vs 함께역동감성)
    IBSW: ['OGLC', 'OGSC'], // 정반대
    IBLC: ['OGSW', 'OGLW'], // 정반대
    IBLW: ['OGSC', 'OGLC'], // 정반대
    IGSC: ['OBLW', 'OBSW'], // 정반대
    IGSW: ['OBLC', 'OBSC'], // 정반대
    IGLC: ['OBSW', 'OBLW'], // 정반대
    IGLW: ['OBSC', 'OBLC'], // 정반대
    OBSC: ['IGLW', 'IGSW'], // 정반대
    OBSW: ['IGLC', 'IGSC'], // 정반대
    OBLC: ['IGSW', 'IGLW'], // 정반대
    OBLW: ['IGSC', 'IGLC'], // 정반대
    OGSC: ['IBLW', 'IBSW'], // 정반대
    OGSW: ['IBLC', 'IBSC'], // 정반대
    OGLC: ['IBSW', 'IBLW'], // 정반대
    OGLW: ['IBSC', 'IBLC'], // 정반대
  };
  
  return (conflictMap[code] || []).map(c => getClarityType(c));
}

// 궁합 이유 (소름돋게 구체적으로)
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

// 충돌 이유 (소름돋게 구체적으로)
function getConflictReason(myCode: ClarityTypeCode, theirCode: ClarityTypeCode): string {
  const reasons: Record<string, string> = {
    'IBSC-OGLW': '당신: "혼자 있고 싶어..." / 이 유형: "야!! 놀러 가자!! 왜 집에만 있어??" → 서로 이해 불가. 당신한텐 지옥, 저한텐 당신이 답답.',
    'IBSC-OGSW': '당신: "조용히 생각 좀..." / 이 유형: "야 진짜 좋았어!! 너도 그랬지?!!" (텐션 MAX) → 당신 귀 아픔. 저 사람은 왜 조용한지 이해 못 함.',
    'IBSW-OGLC': '당신: "천천히 느껴보자..." / 이 유형: "오케이 5분 쉬었으니 다음 일정!" → 속도 차이로 스트레스. 당신은 느끼고 싶은데 저 사람은 추진.',
    'IBSW-OGSC': '당신: "그냥 공감해줘..." / 이 유형: "근데 그게 논리적으로 말이 안 되지 않아?" → 공감 원하는데 논리로 반박당함. 속상.',
    'IBLC-OGSW': '당신: "이거랑 저거랑 연결되는 게..." / 이 유형: "어려운 말 그만! 그냥 즐기자!!" → 당신은 분석하고 싶은데 저 사람은 느끼고만 싶음.',
    'IBLC-OGLW': '당신: "계획 좀 세워보자" / 이 유형: "계획? 그냥 가면 되지 뭐~" → 당신은 정리하고 싶은데 저 사람은 즉흥. 불안함.',
    'IBLW-OGSC': '당신: "분위기가 좋았어..." / 이 유형: "근데 내용은 뭐였는데? 근거는?" → 감각으로 기억하는데 논리 요구받음. 부담.',
    'IBLW-OGLC': '당신: "오늘은 기분 내키는 대로..." / 이 유형: "일정표 짰어! 이렇게 가자!" → 자유롭고 싶은데 스케줄 박힘. 답답.',
    'IGSC-OBLW': '당신: "완성까지 못 쉬어..." / 이 유형: "야 그만하고 놀자~ 사람들 만나" → 몰입 깨짐. 짜증 유발.',
    'IGSC-OBSW': '당신: "논리적으로 이렇게..." / 이 유형: "그래, 힘들었지? 괜찮아~" (감정 위로) → 위로 안 원하는데 감정 터치. 불편.',
    'IGSW-OBLC': '당신: "기분 따라 만드는 중..." / 이 유형: "계획대로 가자, 효율적으로" → 감정 표현하고 싶은데 효율 얘기. 식음.',
    'IGSW-OBSC': '당신: "그냥 느낌 아니야?" / 이 유형: "근거가 뭔데? 논리적으로 설명해봐" → 감성 무시당하는 느낌.',
    'IGLC-OBSW': '당신: "이것도 배워볼까? 저것도?" / 이 유형: "너 너무 정신없어... 하나만 해" → 탐험하고 싶은데 브레이크 거는 느낌.',
    'IGLC-OBLW': '당신: "새로운 거 배웠어!" / 이 유형: "그래~ 근데 기분 어때?" → 지식 얘기하고 싶은데 감정 물어봄. 맥 빠짐.',
    'IGLW-OBSC': '당신: "그냥 끌려서 왔어" / 이 유형: "왜? 이유가 뭐야?" → 즉흥적으로 움직이는데 이유 캐물음. 귀찮.',
    'IGLW-OBLC': '당신: "계획? 그딴 거 없어" / 이 유형: "일정 짜야지, 효율적으로" → 자유 vs 체계. 속 터짐.',
    'OBSC-IGLW': '당신: "진지하게 얘기해보자" / 이 유형: "야 나 저기 가봐야 돼~" → 깊은 대화하고 싶은데 자꾸 딴 데 가려고 함.',
    'OBSC-IGSW': '당신: "논리적으로 보면..." / 이 유형: "아 몰라!! 그냥 짜증나!!" → 감정 폭발에 당황.',
    'OBSW-IGLC': '당신: "어떻게 지냈어?" / 이 유형: "아 그거 배웠는데 들어볼래?" (지식 폭탄) → 마음 얘기하고 싶은데 강의 듣는 기분.',
    'OBSW-IGSC': '당신: "오늘 편하게 수다 떨자~" / 이 유형: "미안, 오늘 작업 있어서..." (약속 펑크) → 자주 못 만남.',
    'OBLC-IGSW': '당신: "체계적으로 정리해보면..." / 이 유형: "아 그냥 느낌대로 하면 안 돼?" → 정리하고 싶은데 즉흥.',
    'OBLC-IGLW': '당신: "다 같이 배워보자" / 이 유형: "나 혼자 할래~" → 함께하고 싶은데 자꾸 혼자.',
    'OBLW-IGSC': '당신: "다 같이 즐기자~" / 이 유형: "미안, 집중해야 돼" → 놀고 싶은데 안 나옴.',
    'OBLW-IGLC': '당신: "편하게 수다 떨자" / 이 유형: "그거 알아? 어제 배운 건데..." (TMI 폭격) → 편하게 놀고 싶은데 강의.',
    'OGSC-IBLW': '당신: "이게 맞지 않아?!" / 이 유형: "그냥... 분위기가..." → 논리 vs 감각. 대화 안 통함.',
    'OGSC-IBSW': '당신: "토론 ㄱㄱ" / 이 유형: "...나 조용히 있고 싶어" → 에너지 넘치는데 상대는 조용. 심심.',
    'OGSW-IBLC': '당신: "우리 지금 하나야!!" / 이 유형: "...근데 논리적으로 보면" → 감정 고조됐는데 냉수.',
    'OGSW-IBSC': '당신: "야 진짜 좋지 않아?!" / 이 유형: "...응" (무덤덤) → 텐션 차이 극심. 혼자 신남.',
    'OGLC-IBSW': '당신: "오케이 이렇게 추진!" / 이 유형: "...나 천천히 할래" → 빠른데 상대는 느림. 답답.',
    'OGLC-IBLW': '당신: "목표 달성 ㄱㄱ" / 이 유형: "목표? 그냥 즐기면 되지" → 효율 vs 여유. 못 맞춤.',
    'OGLW-IBSC': '당신: "놀자!! 왜 집에만 있어?!" / 이 유형: "...혼자 있는 게 좋아서" → 이해 불가. 당신은 답답, 저한텐 부담.',
    'OGLW-IBLC': '당신: "생각하지 말고 느껴!" / 이 유형: "...근데 이게 왜 이렇지?" → 즐기고 싶은데 분석함. 재미없음.',
  };
  
  const key = `${myCode}-${theirCode}`;
  if (reasons[key]) return reasons[key];
  
  // 기본 메시지
  const my = myCode.split('');
  const their = theirCode.split('');
  const diffs = my.filter((c, i) => c !== their[i]).length;
  
  if (diffs >= 3) {
    return '거의 모든 게 정반대라 "쟤는 왜 저러지?" 싶음. 서로 이해 못 함. 같이 있으면 하나는 피곤해요.';
  }
  return '맑아지는 방식이 좀 달라서, 가끔 "아 답답해" 할 수 있어요. 서로 노력 필요.';
}

export default function ResultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
                  src={`/image/weather-profile-${result.clarityType.code}${result.clarityType.code === 'IBSW' ? ' (1)' : ''}.png`}
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
            onClick={() => {
              sessionStorage.removeItem('recommendationResult');
              sessionStorage.removeItem('userAnswers');
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
                  alert(`✨ ${result.clarityType.name} 결과가 저장되었습니다!`);
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
            {isSaving ? '저장 중...' : '🌤️ 내 맑음 유형 저장하기'}
          </Button>
        </div>

        {/* 공유 모달 */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          result={result}
        />
        </div>
      </div>
    </MobileLayout>
  );
}

