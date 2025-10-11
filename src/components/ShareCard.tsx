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
        width: '400px',
        height: '500px',
        background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 25%, #3b82f6 50%, #2563eb 75%, #1d4ed8 100%)',
        borderRadius: '20px',
        padding: '18px 16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-30px', width: '100px', height: '100px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* 콘텐츠 */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }}>
        {/* 로고 - 좌측 상단 (화면 표시용, 캡처 시 숨김) */}
        <div className="share-card-logo" style={{ position: 'absolute', top: '0', left: '0', zIndex: 20 }}>
          <img
            src="/logo/logo.png"
            alt="와우북페스티벌 로고"
            crossOrigin="anonymous"
            style={{
              width: '80px',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
              imageRendering: '-webkit-optimize-contrast',
              WebkitFontSmoothing: 'antialiased',
            }}
          />
        </div>

        {/* 헤더 - 컴팩트 */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2px' }}>
            🌈 나의 맑음 진단 결과
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
            21회 서울와우북페스티벌
          </div>
        </div>

        {/* 유형 이미지 + 정보 - 컴팩트 */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <div
              style={{
                position: 'relative',
                width: '90px',
                height: '90px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                padding: '8px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
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
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '5px',
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {result.clarityType.name}
          </h2>

          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
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
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.5',
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
            marginBottom: '10px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />

        {/* TOP 1 프로그램 - 컴팩트 */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', width: '100%' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>🎯</span>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>추천 프로그램</h3>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              marginLeft: '1px',
              marginRight: '1px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'nowrap', width: '100%' }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 'bold',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {topProgram.category}
              </span>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>🥇</span>
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '4px', lineHeight: '1.3', wordBreak: 'keep-all' }}>
              {topProgram.title}
            </h4>
            <p style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '7px', lineHeight: '1.5', wordBreak: 'keep-all' }}>
              {shortProgramDesc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '9px', color: 'rgba(255, 255, 255, 0.9)', flexWrap: 'nowrap', width: '100%' }}>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>📅 {topProgram.date}</span>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>⏰ {topProgram.time}</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{ marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
          <div
            style={{
              width: '100%',
              height: '1px',
              marginBottom: '8px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)' }}>
              21회 서울와우북페스티벌
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
