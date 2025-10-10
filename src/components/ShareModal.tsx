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

  // 링크 공유 (Web Share API - OG 태그로 자동 프리뷰)
  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Web Share API 지원 확인
      if (navigator.share) {
        const shareData: ShareData = {
          title: shareTitle,
          text: shareDescription,
          url: fullUrl,
        };

        try {
          await navigator.share(shareData);
          // 공유 성공 (사용자가 앱 선택하고 공유 완료)
        } catch (error) {
          // 사용자가 취소한 경우 (AbortError)
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('공유 실패:', error);
            alert('공유에 실패했습니다.');
          }
        }
      } else {
        // Web Share API 미지원 (데스크톱 등)
        // 클립보드에 링크 복사
        try {
          await navigator.clipboard.writeText(fullUrl);
          alert('✅ 링크가 클립보드에 복사되었습니다!\n카카오톡이나 메신저에 붙여넣기 하세요.');
        } catch (clipboardError) {
          // 클립보드도 실패하면 링크 선택
          prompt('링크를 복사하세요:', fullUrl);
        }
      }
    } catch (error) {
      console.error('공유 오류:', error);
      alert('공유 기능을 사용할 수 없습니다.');
    } finally {
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
