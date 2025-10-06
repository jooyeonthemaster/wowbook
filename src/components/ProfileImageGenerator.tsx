'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeatherProfileType, ProfileImageGenerationResponse } from '@/types';
import { weatherProfiles, getAllProfileTypes } from '@/lib/weatherProfiles';

export default function ProfileImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState<Record<WeatherProfileType, string>>({} as Record<WeatherProfileType, string>);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentlyGenerating, setCurrentlyGenerating] = useState<WeatherProfileType | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedTypes, setSelectedTypes] = useState<Set<WeatherProfileType>>(new Set());
  const [showSelector, setShowSelector] = useState(false);

  const generateAllImages = async () => {
    setIsGenerating(true);
    setProgress({ current: 0, total: 16 });
    const allTypes = getAllProfileTypes();
    const results: Record<string, string> = {};

    for (let i = 0; i < allTypes.length; i++) {
      const profileType = allTypes[i];
      setCurrentlyGenerating(profileType);
      setProgress({ current: i + 1, total: 16 });

      try {
        const response = await fetch('/api/generate-profile-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileType,
          }),
        });

        const data: ProfileImageGenerationResponse = await response.json();

        if (data.success && data.generatedImage) {
          results[profileType] = data.generatedImage;
          setGeneratedImages((prev) => ({ ...prev, [profileType]: data.generatedImage! }));
        } else {
          console.error(`${profileType} 생성 실패:`, data.error);
        }

        // API 속도 제한 방지 (1초 대기)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`${profileType} 생성 오류:`, error);
      }
    }

    setIsGenerating(false);
    setCurrentlyGenerating(null);
    alert('모든 프로필 이미지 생성이 완료되었습니다!');
  };

  // 선택한 유형들만 생성
  const generateSelectedImages = async () => {
    if (selectedTypes.size === 0) {
      alert('생성할 유형을 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    const typesToGenerate = Array.from(selectedTypes);
    setProgress({ current: 0, total: typesToGenerate.length });

    for (let i = 0; i < typesToGenerate.length; i++) {
      const profileType = typesToGenerate[i];
      setCurrentlyGenerating(profileType);
      setProgress({ current: i + 1, total: typesToGenerate.length });

      try {
        const response = await fetch('/api/generate-profile-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileType }),
        });

        const data: ProfileImageGenerationResponse = await response.json();

        if (data.success && data.generatedImage) {
          setGeneratedImages((prev) => ({ ...prev, [profileType]: data.generatedImage! }));
        } else {
          console.error(`${profileType} 생성 실패:`, data.error);
        }

        // API 속도 제한 방지 (1초 대기)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`${profileType} 생성 오류:`, error);
      }
    }

    setIsGenerating(false);
    setCurrentlyGenerating(null);
    setSelectedTypes(new Set());
    setShowSelector(false);
    alert(`선택한 ${typesToGenerate.length}개 유형 생성 완료!`);
  };

  // 유형 선택/해제 토글
  const toggleTypeSelection = (type: WeatherProfileType) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // 특정 유형만 다시 생성
  const regenerateSingleImage = async (profileType: WeatherProfileType) => {
    setCurrentlyGenerating(profileType);

    try {
      const response = await fetch('/api/generate-profile-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileType }),
      });

      const data: ProfileImageGenerationResponse = await response.json();

      if (data.success && data.generatedImage) {
        setGeneratedImages((prev) => ({ ...prev, [profileType]: data.generatedImage! }));
        alert(`${weatherProfiles.find(p => p.type === profileType)?.name} 재생성 완료!`);
      } else {
        alert(`재생성 실패: ${data.error}`);
      }
    } catch (error) {
      console.error(`${profileType} 재생성 오류:`, error);
      alert('재생성 중 오류가 발생했습니다.');
    } finally {
      setCurrentlyGenerating(null);
    }
  };

  const downloadAllImages = () => {
    Object.entries(generatedImages).forEach(([type, imageData]) => {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `weather-profile-${type}.png`;
      link.click();
    });
  };

  return (
    <div className="space-y-8">
      {/* 생성 버튼 섹션 */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎨 16개 날씨 유형 캐릭터 생성
        </h2>
        <p className="text-white/70 mb-6">
          AI가 각 날씨 유형별로 완전히 개성 있는 캐릭터 16명을 생성합니다. 각 캐릭터는 고유한 외모, 스타일, 분위기를 가지고 있습니다.
        </p>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <p className="text-blue-200 text-sm">
            💡 <strong>새로운 방식:</strong> 참조 이미지 없이 AI가 각 유형의 성격과 분위기를 바탕으로 완전히 독창적인 캐릭터를 생성합니다. 각 캐릭터는 서로 다른 헤어스타일, 의상, 표정, 색상을 가지고 있어 개성이 뚜렷합니다.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateAllImages}
            disabled={isGenerating}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                생성 중... ({progress.current}/{progress.total})
              </div>
            ) : (
              '✨ 전체 생성 (16개)'
            )}
          </button>

          <button
            onClick={() => setShowSelector(!showSelector)}
            disabled={isGenerating}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            🎯 선택 생성
          </button>
        </div>

        {/* 유형 선택 UI */}
        {showSelector && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">생성할 유형 선택 ({selectedTypes.size}개)</h3>
              <button
                onClick={generateSelectedImages}
                disabled={selectedTypes.size === 0 || isGenerating}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                선택한 유형 생성
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weatherProfiles.map((profile) => (
                <button
                  key={profile.type}
                  onClick={() => toggleTypeSelection(profile.type)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedTypes.has(profile.type)
                      ? 'bg-blue-500/30 border-2 border-blue-400'
                      : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-lg mb-1">{profile.emoji}</div>
                  <div className="text-white text-xs font-medium">{profile.type}</div>
                  <div className="text-white/60 text-xs">{profile.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentlyGenerating && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm">
              현재 생성 중: <span className="font-bold">{weatherProfiles.find(p => p.type === currentlyGenerating)?.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* 생성된 이미지 그리드 */}
      {Object.keys(generatedImages).length > 0 && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              생성된 이미지 ({Object.keys(generatedImages).length}/16)
            </h3>
            {Object.keys(generatedImages).length === 16 && (
              <button
                onClick={downloadAllImages}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-semibold"
              >
                💾 전체 다운로드
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherProfiles.map((profile) => {
              const image = generatedImages[profile.type];
              return (
                <motion.div
                  key={profile.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                    {image ? (
                      <img
                        src={image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{profile.emoji}</div>
                          <div className="text-xs">대기 중...</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white text-xs font-semibold">{profile.name}</p>
                    <p className="text-white/50 text-xs">{profile.emoji}</p>
                  </div>
                  {image && (
                    <div className="flex gap-1">
                      <a
                        href={image}
                        download={`weather-profile-${profile.type}.png`}
                        className="flex-1 px-2 py-1 bg-white/10 text-white rounded text-xs text-center hover:bg-white/20 transition-colors"
                      >
                        💾
                      </a>
                      <button
                        onClick={() => regenerateSingleImage(profile.type)}
                        disabled={currentlyGenerating === profile.type || isGenerating}
                        className="flex-1 px-2 py-1 bg-blue-500/20 text-white rounded text-xs text-center hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="이 유형만 다시 생성"
                      >
                        {currentlyGenerating === profile.type ? (
                          <span className="inline-block animate-spin">🔄</span>
                        ) : (
                          '🔄'
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
