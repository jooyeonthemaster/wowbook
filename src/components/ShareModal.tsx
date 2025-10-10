'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import ShareCard from './ShareCard';
import { RecommendationResult } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecommendationResult;
  shareUrl?: string;
}

export default function ShareModal({ isOpen, onClose, result, shareUrl }: ShareModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 공유할 텍스트
  const shareTitle = `나의 맑음 유형: ${result.clarityType.name}`;
  const shareDescription = `"${result.clarityType.nickname}" - 21회 서울와우북페스티벌 맑음 진단 결과`;
  const fullUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // 이미지 + 링크 공유 (Web Share API - 모바일 네이티브)
  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      setIsSharing(true);

      // 폰트와 이미지 로딩 대기 (레이아웃 안정화)
      await new Promise(resolve => setTimeout(resolve, 300));

      // transform: scale 제거하고 원본 크기로 캡처
      const originalTransform = cardRef.current.style.transform;
      const originalMargin = cardRef.current.style.marginBottom;
      cardRef.current.style.transform = 'none';
      cardRef.current.style.marginBottom = '0';

      // 이미지를 생성
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 380,
        height: 580,
        windowWidth: 380,
        windowHeight: 580,
        imageTimeout: 0,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });

      // 원래 스타일 복원
      cardRef.current.style.transform = originalTransform;
      cardRef.current.style.marginBottom = originalMargin;

      // Canvas를 Blob으로 변환
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsSharing(false);
          return;
        }

        // Web Share API 지원 확인
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], `맑음진단_${result.clarityType.code}.png`, {
              type: 'image/png',
            });

            // 공유할 메시지 (링크 포함)
            const shareText = `${shareDescription}\n\n✨ 내 결과 자세히 보기:\n${fullUrl}\n\n🌤️ 나도 진단하러 가기:\n${window.location.origin}`;

            // 이미지 + 텍스트(링크 포함) 공유
            const shareData: ShareData = {
              title: shareTitle,
              text: shareText,
            };

            // 파일 공유 가능 여부 확인
            if (navigator.canShare({ files: [file], ...shareData })) {
              await navigator.share({
                ...shareData,
                files: [file],
              });
            } else if (navigator.canShare({ files: [file] })) {
              // 파일만 공유 가능한 경우 (일부 브라우저)
              await navigator.share({
                files: [file],
              });
              console.log('텍스트는 포함되지 않았습니다. 이미지만 공유됩니다.');
            } else {
              // 파일 공유 미지원 시 텍스트만 공유
              await navigator.share(shareData);
              alert('이미지는 포함되지 않았습니다. 아래 "이미지 저장" 버튼으로 저장하세요!');
            }
          } catch (error) {
            // 사용자가 취소한 경우 (AbortError)
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('공유 실패:', error);
              alert('공유에 실패했습니다. 이미지 저장 버튼을 이용해주세요.');
            }
          }
        } else {
          // Web Share API 미지원 (데스크톱 등)
          alert('이 브라우저는 공유 기능을 지원하지 않습니다.\n"이미지 저장" 버튼을 이용해주세요!');
        }

        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      setIsDownloading(true);

      // 폰트와 이미지 로딩 대기 (레이아웃 안정화)
      await new Promise(resolve => setTimeout(resolve, 300));

      // transform: scale 제거하고 원본 크기로 캡처
      const originalTransform = cardRef.current.style.transform;
      const originalMargin = cardRef.current.style.marginBottom;
      cardRef.current.style.transform = 'none';
      cardRef.current.style.marginBottom = '0';

      // html2canvas로 DOM을 이미지로 변환
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 고해상도
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 380,
        height: 580,
        windowWidth: 380,
        windowHeight: 580,
        imageTimeout: 0,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });

      // 원래 스타일 복원
      cardRef.current.style.transform = originalTransform;
      cardRef.current.style.marginBottom = originalMargin;

      // Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Blob을 다운로드
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `맑음진단_${result.clarityType.code}_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
      }, 'image/png');
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      alert('이미지 다운로드에 실패했습니다. 다시 시도해주세요.');
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{ cursor: 'pointer' }}
          />

          {/* 모달 콘텐츠 */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{
              padding: '16px',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="pointer-events-auto w-full max-w-[340px]"
              style={{
                maxHeight: 'calc(100vh - 32px - env(safe-area-inset-bottom))'
              }}
            >
              {/* 스크롤 컨테이너 */}
              <div
                className="flex flex-col items-center gap-4 h-full overflow-y-auto overflow-x-hidden"
                style={{
                  paddingBottom: '4px',
                  // iOS 스크롤 부드럽게
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {/* 공유 카드 (84.2% 축소: 380→320, 580→488) */}
                <div
                  ref={cardRef}
                  style={{
                    transform: 'scale(0.842)',
                    transformOrigin: 'top center',
                    marginBottom: '-92px', // 축소로 생긴 빈 공간 제거
                  }}
                >
                  <ShareCard result={result} />
                </div>

                {/* 버튼들 */}
                <div className="flex gap-2.5 w-full" style={{ flexShrink: 0 }}>
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    {isSharing ? '준비 중...' : '📤 공유'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.9), rgba(244, 114, 182, 0.9))',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 4px 20px rgba(167, 139, 250, 0.4)',
                    }}
                  >
                    {isDownloading ? '저장 중...' : '📥 저장'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
