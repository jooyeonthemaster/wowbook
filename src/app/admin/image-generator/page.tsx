'use client';

import ProfileImageGenerator from '@/components/ProfileImageGenerator';

export default function ImageGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎨 날씨 캐릭터 생성기
          </h1>
          <p className="text-white/70 text-lg">
            AI가 16개 날씨 유형별로 완전히 개성 있는 캐릭터를 자동 생성합니다
          </p>
        </div>

        {/* 캐릭터 생성 컴포넌트 */}
        <ProfileImageGenerator />

        {/* 설명 섹션 */}
        <div className="mt-12 glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 사용 방법</h2>
          <div className="space-y-3 text-white/80">
            <p>1. &ldquo;16개 개성 있는 캐릭터 생성 시작&rdquo; 버튼을 클릭합니다</p>
            <p>2. AI가 자동으로 16개 날씨 유형별로 완전히 다른 캐릭터를 순차적으로 생성합니다</p>
            <p>3. 각 캐릭터는 고유한 헤어스타일, 의상, 색상, 표정, 분위기를 가집니다</p>
            <p>4. 생성 완료 후 개별 또는 전체 다운로드가 가능합니다</p>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ 주의: 16개 캐릭터 생성에는 약 20-30분이 소요될 수 있습니다.
              API 속도 제한으로 인해 각 이미지 사이에 1초씩 대기합니다.
            </p>
          </div>

          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-200 text-sm">
              ✨ <strong>개성 있는 캐릭터:</strong> 참조 이미지 없이 AI가 각 유형의 특성을 반영하여 완전히 독창적인 캐릭터를 생성합니다. IBSC는 차가운 은발의 여성, OGSW는 무지개 색 머리의 밝은 여성 등, 16명 모두 다릅니다!
            </p>
          </div>
        </div>

        {/* 16개 유형 설명 */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🌈 16개 날씨 유형 (MBTI 스타일)</h2>

          <div className="space-y-6">
            {/* 그룹 1: IB - 조용한 내면의 맑음 */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">그룹 1: 혼자 × 고요 (IB)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { code: 'IBSC', name: '새벽 서리 맑음', emoji: '❄️🌅', color: '#E6F7FF' },
                  { code: 'IBSW', name: '봄날 아침 맑음', emoji: '🌸☀️', color: '#FFF9E6' },
                  { code: 'IBLC', name: '가을밤 보름달 맑음', emoji: '🍂🌕', color: '#FFE4B5' },
                  { code: 'IBLW', name: '안개 낀 아침 맑음', emoji: '🌫️💫', color: '#F0F0F0' },
                ].map((type) => (
                  <div
                    key={type.code}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                    style={{ borderLeftColor: type.color, borderLeftWidth: '4px' }}
                  >
                    <div className="text-xs text-white/60 font-mono mb-1">{type.code}</div>
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-white text-xs font-semibold">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 그룹 2: IG - 강렬한 내면의 맑음 */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">그룹 2: 혼자 × 역동 (IG)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { code: 'IGSC', name: '겨울 눈보라 맑음', emoji: '❄️💨', color: '#E0F2FF' },
                  { code: 'IGSW', name: '여름 소나기 맑음', emoji: '🌦️⚡', color: '#B3E5FC' },
                  { code: 'IGLC', name: '별이 쏟아지는 밤 맑음', emoji: '✨🌌', color: '#1A237E' },
                  { code: 'IGLW', name: '봄바람 꽃잎 맑음', emoji: '🌸🌬️', color: '#FFF0F5' },
                ].map((type) => (
                  <div
                    key={type.code}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                    style={{ borderLeftColor: type.color, borderLeftWidth: '4px' }}
                  >
                    <div className="text-xs text-white/60 font-mono mb-1">{type.code}</div>
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-white text-xs font-semibold">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 그룹 3: OB - 조용한 연결의 맑음 */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">그룹 3: 함께 × 고요 (OB)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { code: 'OBSC', name: '이슬 내린 새벽 맑음', emoji: '💧🌱', color: '#E8F5E9' },
                  { code: 'OBSW', name: '봄비 내리는 오후 맑음', emoji: '🌧️🌿', color: '#C8E6C9' },
                  { code: 'OBLC', name: '보름달 뜨는 밤 맑음', emoji: '🌕🌙', color: '#FFF3E0' },
                  { code: 'OBLW', name: '봄날 아지랑이 맑음', emoji: '🌸🌫️', color: '#FFF9C4' },
                ].map((type) => (
                  <div
                    key={type.code}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                    style={{ borderLeftColor: type.color, borderLeftWidth: '4px' }}
                  >
                    <div className="text-xs text-white/60 font-mono mb-1">{type.code}</div>
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-white text-xs font-semibold">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 그룹 4: OG - 강렬한 연결의 맑음 */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">그룹 4: 함께 × 역동 (OG)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { code: 'OGSC', name: '뇌우 치는 오후 맑음', emoji: '⚡🌩️', color: '#B39DDB' },
                  { code: 'OGSW', name: '소나기 쏟아진 후 맑음', emoji: '🌈☀️', color: '#81C784' },
                  { code: 'OGLC', name: '구름 흐르는 저녁 맑음', emoji: '☁️🌅', color: '#FFCCBC' },
                  { code: 'OGLW', name: '무지개 뜬 하늘 맑음', emoji: '🌈✨', color: '#FFE082' },
                ].map((type) => (
                  <div
                    key={type.code}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                    style={{ borderLeftColor: type.color, borderLeftWidth: '4px' }}
                  >
                    <div className="text-xs text-white/60 font-mono mb-1">{type.code}</div>
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-white text-xs font-semibold">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
