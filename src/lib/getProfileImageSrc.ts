import { ClarityTypeCode } from '@/types';

// 맑음 유형 코드별 정적 이미지 경로를 반환한다.
// - 대부분 .png
// - IGSC만 .jpg
// - IBSW는 파일명에 " (1)" 서픽스 존재
export function getProfileImageSrc(code: ClarityTypeCode): string {
  const isJpg = code === 'IGSC';
  const suffix = code === 'IBSW' ? ' (1)' : '';
  const ext = isJpg ? 'jpg' : 'png';
  return `/image/weather-profile-${code}${suffix}.${ext}`;
}

export default getProfileImageSrc;


