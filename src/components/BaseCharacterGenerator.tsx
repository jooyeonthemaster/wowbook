'use client';

import React, { useState } from 'react';

interface BaseCharacterGeneratorProps {
  onCharacterGenerated: (imageUrl: string) => void;
}

export default function BaseCharacterGenerator({
  onCharacterGenerated,
}: BaseCharacterGeneratorProps) {
  const [characterPrompt, setCharacterPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    '20대 여성, 긴 검은 머리, 부드러운 미소, 자연스러운 메이크업, 캐주얼한 스타일',
    '30대 남성, 짧은 갈색 머리, 안경, 지적인 느낌, 비즈니스 캐주얼',
    '10대 여성, 짧은 단발머리, 밝은 표정, 청순한 이미지, 학생 스타일',
    '20대 남성, 파마 머리, 밝은 미소, 활기찬 느낌, 스포티한 스타일',
  ];

  const handleGenerate = async () => {
    if (!characterPrompt.trim()) {
      setError('캐릭터 설명을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-base-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterPrompt: characterPrompt.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.generatedImage) {
        setGeneratedImage(data.generatedImage);
        onCharacterGenerated(data.generatedImage);
      } else {
        setError(data.error || '이미지 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error generating base character:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseExample = (example: string) => {
    setCharacterPrompt(example);
  };

  const handleReset = () => {
    setCharacterPrompt('');
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">
          1단계: 기본 캐릭터 생성
        </h2>
        <p className="text-white/80 mb-6">
          캐릭터의 외모, 스타일, 분위기를 설명해주세요. 이 이미지를 바탕으로 16개의
          날씨 유형 프로필 이미지가 생성됩니다.
        </p>

        {/* 예시 프롬프트 */}
        <div className="mb-4">
          <p className="text-sm text-white/70 mb-2">예시 프롬프트:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleUseExample(example)}
                className="text-xs bg-white/5 hover:bg-white/10 text-white/90 px-3 py-2 rounded-lg border border-white/10 transition-all"
                disabled={isGenerating}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/90 mb-2">
            캐릭터 설명
          </label>
          <textarea
            value={characterPrompt}
            onChange={(e) => setCharacterPrompt(e.target.value)}
            placeholder="예: 20대 여성, 긴 검은 머리, 부드러운 미소, 자연스러운 메이크업, 캐주얼한 스타일"
            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* 생성 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !characterPrompt.trim()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                기본 캐릭터 생성 중...
              </span>
            ) : (
              '기본 캐릭터 생성'
            )}
          </button>

          {generatedImage && (
            <button
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              disabled={isGenerating}
            >
              초기화
            </button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* 생성 중 안내 */}
        {isGenerating && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
            <p className="text-blue-200">
              ⏳ 캐릭터 이미지를 생성하는 중입니다. 약 10-20초 정도 소요됩니다...
            </p>
          </div>
        )}
      </div>

      {/* 생성된 이미지 미리보기 */}
      {generatedImage && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            생성된 기본 캐릭터
          </h3>
          <div className="flex justify-center">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-white/30">
              <img
                src={generatedImage}
                alt="Generated base character"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-center text-white/70 mt-4">
            ✅ 이 캐릭터를 바탕으로 16개의 날씨 유형 프로필 이미지를 생성할 수
            있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
