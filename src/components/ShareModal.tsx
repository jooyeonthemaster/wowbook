'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { domToPng } from 'modern-screenshot';
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
  const modalRef = useRef<HTMLDivElement>(null);

  // iOS Safari: 모달 열릴 때 배경 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    // 배경 스크롤 막기 (iOS Safari 완벽 대응)
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    // cleanup: 모달 닫힐 때 원상복구
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      html.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // 캡처 전 폰트/이미지 로드 보장 및 안정화 대기
  const waitForCardAssets = async (root?: HTMLElement | null) => {
    try {
      // 폰트 로드 대기
      if (typeof document !== 'undefined') {
        const doc = document as Document & { fonts?: { ready: Promise<void> } };
        if (doc.fonts?.ready) {
          await doc.fonts.ready.catch(() => undefined);
        }
      }

      // 이미지 로드 대기 (지정된 루트 기준)
      const scope = root ?? cardRef.current ?? undefined;
      const images = Array.from(scope?.querySelectorAll('img') || []);
      await Promise.all(
        images.map((img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();

            const handleLoad = () => {
              // 이미지 로드 후 crossOrigin 강제 설정
              if (!img.crossOrigin) {
                img.crossOrigin = 'anonymous';
              }
              resolve();
            };

            img.addEventListener('load', handleLoad, { once: true });
            img.addEventListener('error', () => resolve(), { once: true });

            // 이미 로드된 경우를 위한 fallback
            if (img.complete) {
              handleLoad();
            }
          })
        )
      );

      // 레이아웃 안정화 대기
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    } catch {}
  };

  // 공유할 텍스트
  const shareTitle = `나의 맑음 유형: ${result.clarityType.name}`;
  const shareDescription = `"${result.clarityType.nickname}" - 21회 서울와우북페스티벌 맑음 진단 결과`;
  const fullUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // 링크 공유 (카카오톡, 메신저용 - OG 태그로 자동 프리뷰)
  const handleLinkShare = async () => {
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
          // 공유 성공
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('공유 실패:', error);
            alert('공유에 실패했습니다.');
          }
        }
      } else {
        // Web Share API 미지원 (데스크톱)
        try {
          await navigator.clipboard.writeText(fullUrl);
          alert('✅ 링크가 클립보드에 복사되었습니다!\n카카오톡이나 메신저에 붙여넣기 하세요.');
        } catch {
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

  // 이미지 공유 (인스타그램, SNS용)
  const handleImageShare = async () => {
    if (!cardRef.current) return;

    try {
      setIsSharing(true);

      // cardRef의 첫 번째 자식 (실제 ShareCard)을 직접 캡처
      const cardElement = cardRef.current.querySelector('div') as HTMLElement;
      if (!cardElement) {
        throw new Error('ShareCard 요소를 찾을 수 없습니다');
      }

      await waitForCardAssets(cardElement);
      await new Promise(resolve => setTimeout(resolve, 100));

      // 캡처 전: ShareCard의 로고 숨기기
      const logoElement = cardElement.querySelector('.share-card-logo') as HTMLElement;
      const originalDisplay = logoElement ? logoElement.style.display : '';
      if (logoElement) {
        logoElement.style.display = 'none';
      }

      const targetWidth = 400;
      const targetHeight = 500;

      console.log('Capturing ShareCard directly...');

      // modern-screenshot으로 이미지 생성 (4:5 비율 400x500)
      const dataUrl = await domToPng(cardElement, {
        width: targetWidth,
        height: targetHeight,
        scale: 2,
        backgroundColor: '#3b82f6',
      });

      // 캡처 후: 로고 원상복구
      if (logoElement) {
        logoElement.style.display = originalDisplay;
      }

      console.log('Image created successfully');

      // Canvas에 로고 오버레이 추가 (고해상도)
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth * 2;
      canvas.height = targetHeight * 2;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. 캡처된 이미지 그리기
        const cardImage = new Image();
        cardImage.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          cardImage.onload = () => resolve();
          cardImage.onerror = reject;
          cardImage.src = dataUrl;
        });
        ctx.drawImage(cardImage, 0, 0, canvas.width, canvas.height);

        // 2. 로고 이미지 로드 및 그리기 (좌측 상단)
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          logo.onload = () => resolve();
          logo.onerror = reject;
          logo.src = '/logo/logo.png';
        });

        // 로고 크기: 240px (더 크게 렌더링)
        const logoWidth = 240;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        const logoX = 36; // padding
        const logoY = 36;

        // 고품질 렌더링 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 그림자 효과 제거 (깨끗한 로고)
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      }

      // Canvas를 Blob으로 변환
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas to Blob 변환 실패'));
        }, 'image/png', 1.0);
      });

      // Web Share API로 이미지 파일 공유
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], `맑음진단_${result.clarityType.code}.png`, {
            type: 'image/png',
          });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: shareTitle,
              text: shareDescription,
            });
          } else {
            alert('이 브라우저는 이미지 공유를 지원하지 않습니다.\n"📥 저장" 버튼을 이용해주세요!');
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('이미지 공유 실패:', error);
            alert('이미지 공유에 실패했습니다.');
          }
        }
      } else {
        alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
      }

      setIsSharing(false);
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 생성에 실패했습니다.');
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      setIsDownloading(true);

      // cardRef의 첫 번째 자식 (실제 ShareCard)을 직접 캡처
      const cardElement = cardRef.current.querySelector('div') as HTMLElement;
      if (!cardElement) {
        throw new Error('ShareCard 요소를 찾을 수 없습니다');
      }

      await waitForCardAssets(cardElement);
      await new Promise(resolve => setTimeout(resolve, 100));

      // 캡처 전: ShareCard의 로고 숨기기
      const logoElement = cardElement.querySelector('.share-card-logo') as HTMLElement;
      const originalDisplay = logoElement ? logoElement.style.display : '';
      if (logoElement) {
        logoElement.style.display = 'none';
      }

      const targetWidth = 400;
      const targetHeight = 500;

      console.log('Download - Capturing ShareCard directly...');

      // modern-screenshot으로 이미지 생성 (4:5 비율 400x500)
      const dataUrl = await domToPng(cardElement, {
        width: targetWidth,
        height: targetHeight,
        scale: 2,
        backgroundColor: '#3b82f6',
      });

      // 캡처 후: 로고 원상복구
      if (logoElement) {
        logoElement.style.display = originalDisplay;
      }

      console.log('Download - Image created successfully');

      // Canvas에 로고 오버레이 추가 (고해상도)
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth * 2;
      canvas.height = targetHeight * 2;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. 캡처된 이미지 그리기
        const cardImage = new Image();
        cardImage.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          cardImage.onload = () => resolve();
          cardImage.onerror = reject;
          cardImage.src = dataUrl;
        });
        ctx.drawImage(cardImage, 0, 0, canvas.width, canvas.height);

        // 2. 로고 이미지 로드 및 그리기 (좌측 상단)
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          logo.onload = () => resolve();
          logo.onerror = reject;
          logo.src = '/logo/logo.png';
        });

        // 로고 크기: 240px (더 크게 렌더링)
        const logoWidth = 240;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        const logoX = 36; // padding
        const logoY = 36;

        // 고품질 렌더링 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 그림자 효과 제거 (깨끗한 로고)
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      }

      // Canvas를 Blob으로 변환
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas to Blob 변환 실패'));
        }, 'image/png', 1.0);
      });

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
          {/* 배경 오버레이 - 클릭하면 닫힘 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{
              cursor: 'pointer',
              touchAction: 'none', // iOS 배경 터치 스크롤 완전 차단
            }}
          />

          {/* 모달 콘텐츠 - 스크롤 가능 영역 */}
          <div
            ref={modalRef}
            className="fixed inset-0 z-[51] flex items-start justify-center overflow-y-scroll"
            style={{
              padding: '0',
              paddingTop: 'max(72px, calc(56px + 16px + env(safe-area-inset-top)))',
              paddingBottom: 'max(120px, calc(72px + env(safe-area-inset-bottom)))',
              paddingLeft: '16px',
              paddingRight: '16px',
              WebkitOverflowScrolling: 'touch', // iOS 부드러운 스크롤
              overscrollBehavior: 'contain', // 스크롤 끝에서 바운스 방지
              touchAction: 'pan-y', // 세로 스크롤만 허용
            }}
            onClick={(e) => {
              // 배경 클릭 시 모달 닫기 (버튼 클릭은 제외)
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-[340px] my-auto"
              style={{
                minHeight: 'min-content', // 내용 크기만큼만
              }}
            >
              {/* 스크롤 컨테이너 */}
              <div
                className="flex flex-col items-center gap-4"
                style={{
                  paddingBottom: '0',
                }}
              >
                {/* 공유 카드 (80% 축소: 400→320, 500→400) */}
                <div
                  ref={cardRef}
                  style={{
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center',
                    marginBottom: '-100px', // 500px 높이 기준 축소 빈공간 보정 (500*(1-0.8))
                    width: '400px',
                    height: '500px',
                  }}
                >
                  <ShareCard result={result} />
                </div>

                {/* 버튼들 */}
                <div
                  className="flex flex-col gap-2.5 w-full"
                  style={{
                    flexShrink: 0,
                    paddingBottom: 'max(20px, env(safe-area-inset-bottom))' // iOS Safari 추가 여백
                  }}
                >
                  {/* 링크 공유 (카카오톡, 메신저) */}
                  <button
                    onClick={handleLinkShare}
                    disabled={isSharing}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    {isSharing ? '준비 중...' : '📤 링크 공유 (카카오톡, 메신저)'}
                  </button>
                  
                  {/* 하단 버튼 그룹 */}
                  <div className="flex gap-2.5">
                    {/* 인스타그램 공유 */}
                    <button
                      onClick={handleImageShare}
                      disabled={isSharing}
                      className="flex-1 py-2.5 px-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(219, 39, 119, 0.9))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                      }}
                    >
                      {isSharing ? '준비 중...' : '📸 인스타그램'}
                    </button>
                    
                    {/* 이미지 저장 */}
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex-1 py-2.5 px-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 0.9))',
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
