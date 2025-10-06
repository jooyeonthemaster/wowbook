'use client';

import { RecommendationResult } from '@/types';

interface ShareCardProps {
  result: RecommendationResult;
}

// 설명을 짧게 요약하는 함수
function summarizeDescription(desc: string): string {
  // 첫 문장만 가져오기 (마침표나 물음표 기준)
  const firstSentence = desc.split(/[.?!]/)[0] + '.';
  // 100자 이내로 제한
  if (firstSentence.length > 100) {
    return firstSentence.substring(0, 97) + '...';
  }
  return firstSentence;
}

// 프로그램 설명을 짧게 요약하는 함수
function summarizeProgram(desc: string): string {
  // 50자 이내로 제한
  if (desc.length > 50) {
    return desc.substring(0, 47) + '...';
  }
  return desc;
}

export default function ShareCard({ result }: ShareCardProps) {
  const topProgram = result.recommendedPrograms[0];
  const shortDescription = summarizeDescription(result.clarityType.description);
  const shortProgramDesc = summarizeProgram(topProgram.description);

  return (
    <div
      className="relative"
      style={{
        width: '380px',
        height: '580px',
        background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 25%, #3b82f6 50%, #2563eb 75%, #1d4ed8 100%)',
        borderRadius: '24px',
        padding: '24px 20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <div className="text-xs font-bold text-white/90 mb-0.5">
            🌈 나의 맑음 진단 결과
          </div>
          <div className="text-[10px] text-white/70">
            21회 서울와우북페스티벌
          </div>
        </div>

        {/* 유형 이미지 + 정보 */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div
              className="relative"
              style={{
                width: '110px',
                height: '110px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                padding: '10px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={`/image/weather-profile-${result.clarityType.code}${result.clarityType.code === 'IBSW' ? ' (1)' : ''}.png`}
                alt={result.clarityType.name}
                className="w-full h-full object-cover"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3))',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          <h2
            className="text-2xl font-bold mb-1.5"
            style={{
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {result.clarityType.name}
          </h2>

          <div className="flex justify-center mb-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              &ldquo;{result.clarityType.nickname}&rdquo;
            </div>
          </div>

          {/* 간단한 설명 */}
          <p
            className="text-xs text-white/90 leading-relaxed px-2"
            style={{
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {shortDescription}
          </p>
        </div>

        {/* 구분선 */}
        <div
          className="w-full h-px mb-4"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />

        {/* TOP 1 프로그램 */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-sm font-bold text-white">추천 프로그램</h3>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
              >
                {topProgram.category}
              </span>
              <span className="text-lg">🥇</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1 leading-tight">
              {topProgram.title}
            </h4>
            <p className="text-[10px] text-white/80 mb-2 leading-relaxed">
              {shortProgramDesc}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-white/90">
              <span>📅 {topProgram.date}</span>
              <span>⏰ {topProgram.time}</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-auto pt-4">
          <div
            className="w-full h-px mb-3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/90 mb-0.5">
              21회 서울와우북페스티벌
            </div>
            <div className="text-[9px] text-white/70">
              나만의 맑음을 찾아보세요 ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
