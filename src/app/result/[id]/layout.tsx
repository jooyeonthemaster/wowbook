import { Metadata } from 'next';

// OG 메타 태그 생성 (서버 사이드)
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://20251002wowbook-h1vytimjc-jooyoens-projects-59877186.vercel.app';
    
    // API에서 결과 데이터 가져오기 (서버 사이드)
    const response = await fetch(`${baseUrl}/api/results/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return {
        title: '맑음 진단 결과',
        description: '21회 서울와우북페스티벌 맑음 진단',
      };
    }

    const data = await response.json();
    const result = data.result?.result;
    
    if (!result) {
      return {
        title: '맑음 진단 결과',
        description: '21회 서울와우북페스티벌 맑음 진단',
      };
    }

    const clarityType = result.clarityType;
    const isJpg = clarityType.code === 'IGSC';
    const suffix = clarityType.code === 'IBSW' ? ' (1)' : '';
    const ext = isJpg ? 'jpg' : 'png';
    const imageUrl = `${baseUrl}/image/weather-profile-${clarityType.code}${suffix}.${ext}`;
    
    return {
      title: `나의 맑음 유형: ${clarityType.name}`,
      description: `"${clarityType.nickname}" - ${clarityType.description.slice(0, 100)}...`,
      openGraph: {
        title: `나의 맑음 유형: ${clarityType.name}`,
        description: `"${clarityType.nickname}" - 21회 서울와우북페스티벌 맑음 진단 결과`,
        images: [
          {
            url: imageUrl,
            width: 380,
            height: 580,
            alt: clarityType.name,
          },
        ],
        url: `${baseUrl}/result/${id}`,
        siteName: '맑음 - 와우북페스티벌',
        type: 'website',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: `나의 맑음 유형: ${clarityType.name}`,
        description: `"${clarityType.nickname}" - 21회 서울와우북페스티벌 맑음 진단 결과`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {
      title: '맑음 진단 결과',
      description: '21회 서울와우북페스티벌 맑음 진단',
    };
  }
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

