'use client';

import { RecommendationResult } from '@/types';
import getProfileImageSrc from '@/lib/getProfileImageSrc';

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
  // 말줄임 없이 전체 문장 표시
  return desc;
}

export default function ShareCard({ result }: ShareCardProps) {
  const topProgram = result.recommendedPrograms[0];
  const shortDescription = summarizeDescription(result.clarityType.description);
  const shortProgramDesc = summarizeProgram(topProgram.description);

  return (
    <div
      style={{
        position: 'relative',
        width: '380px',
        height: '676px',
        background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 25%, #3b82f6 50%, #2563eb 75%, #1d4ed8 100%)',
        borderRadius: '24px',
        padding: '20px 18px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '-40px', width: '128px', height: '128px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      {/* 콘텐츠 */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
            🌈 나의 맑음 진단 결과
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
            21회 서울와우북페스티벌
          </div>
        </div>

        {/* 유형 이미지 + 정보 */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div
              style={{
                position: 'relative',
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
                src={getProfileImageSrc(result.clarityType.code)}
                alt={result.clarityType.name}
                crossOrigin="anonymous"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3))',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '6px',
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {result.clarityType.name}
          </h2>

          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: 'rgba(255, 255, 255, 0.25)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              &ldquo;{result.clarityType.nickname}&rdquo;
            </div>
          </div>

          {/* 간단한 설명 */}
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              paddingLeft: '8px',
              paddingRight: '8px',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {shortDescription}
          </p>
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: '100%',
            height: '1px',
            marginBottom: '14px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />

        {/* TOP 1 프로그램 */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', width: '100%' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🎯</span>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>추천 프로그램</h3>
          </div>
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              marginLeft: '1px',
              marginRight: '1px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'nowrap', width: '100%' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {topProgram.category}
              </span>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>🥇</span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '4px', lineHeight: '1.3', wordBreak: 'keep-all' }}>
              {topProgram.title}
            </h4>
            <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', lineHeight: '1.6', wordBreak: 'keep-all' }}>
              {shortProgramDesc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.9)', flexWrap: 'nowrap', width: '100%' }}>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>📅 {topProgram.date}</span>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>⏰ {topProgram.time}</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
          <div
            style={{
              width: '100%',
              height: '1px',
              marginBottom: '10px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)' }}>
              21회 서울와우북페스티벌
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
