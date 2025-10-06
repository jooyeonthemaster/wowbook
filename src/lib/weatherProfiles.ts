import { WeatherProfile, WeatherProfileType } from '@/types';

// 16개 날씨 유형 프로필 정의 (MBTI 스타일)
export const weatherProfiles: WeatherProfile[] = [
  // 그룹 1: 혼자 × 고요 (IB) - 조용한 내면의 맑음
  {
    type: 'IBSC',
    name: '새벽 서리 맑음',
    description: '이른 새벽, 하얀 서리가 조용히 내려앉은 고요하고 차가운 맑음. 혼자만의 시간 속에서 차분하게 내면을 들여다보는 유형.',
    characteristics: ['고요함', '성찰적', '차분함', '집중력', '내면 탐구'],
    emoji: '❄️🌅',
    color: '#E6F7FF',
  },
  {
    type: 'IBSW',
    name: '봄날 아침 맑음',
    description: '따스한 봄 햇살이 부드럽게 비추는 아침의 맑음. 혼자서도 충만하고 평온한 에너지를 느끼는 유형.',
    characteristics: ['평온함', '따뜻함', '온화함', '자기 충족', '안정감'],
    emoji: '🌸☀️',
    color: '#FFF9E6',
  },
  {
    type: 'IBLC',
    name: '가을밤 보름달 맑음',
    description: '가을 밤하늘에 떠오른 보름달처럼 은은하고 깊은 맑음. 차분한 사색과 깊이 있는 통찰을 즐기는 유형.',
    characteristics: ['사색적', '깊이 있음', '통찰력', '지혜로움', '철학적'],
    emoji: '🍂🌕',
    color: '#FFE4B5',
  },
  {
    type: 'IBLW',
    name: '안개 낀 아침 맑음',
    description: '부드러운 안개 속에서 천천히 드러나는 아침의 맑음. 은은하고 신비로운 분위기 속에서 자신만의 세계를 탐색하는 유형.',
    characteristics: ['신비로움', '몽환적', '예민함', '감수성', '내면 세계'],
    emoji: '🌫️💫',
    color: '#F0F0F0',
  },

  // 그룹 2: 혼자 × 역동 (IG) - 강렬한 내면의 맑음
  {
    type: 'IGSC',
    name: '겨울 눈보라 맑음',
    description: '차갑고 강렬한 눈보라가 지나간 뒤의 청명한 맑음. 혼자서도 강한 에너지와 집중력을 발휘하는 유형.',
    characteristics: ['강렬함', '집중력', '독립적', '결단력', '냉철함'],
    emoji: '❄️💨',
    color: '#E0F2FF',
  },
  {
    type: 'IGSW',
    name: '여름 소나기 맑음',
    description: '시원한 여름 소나기가 쏟아진 직후의 상쾌한 맑음. 혼자만의 시간에 집중적으로 에너지를 쏟아내는 유형.',
    characteristics: ['상쾌함', '활력', '집중적', '정화', '돌파력'],
    emoji: '🌦️⚡',
    color: '#B3E5FC',
  },
  {
    type: 'IGLC',
    name: '별이 쏟아지는 밤 맑음',
    description: '밤하늘 가득 쏟아지는 별빛처럼 강렬하고 신비로운 맑음. 혼자서 우주적 통찰과 깊은 영감을 얻는 유형.',
    characteristics: ['영감', '창의력', '직관력', '심오함', '비전'],
    emoji: '✨🌌',
    color: '#1A237E',
  },
  {
    type: 'IGLW',
    name: '봄바람 꽃잎 맑음',
    description: '봄바람에 꽃잎이 날리는 역동적이면서도 아름다운 맑음. 혼자만의 시간에 창의적 에너지를 발산하는 유형.',
    characteristics: ['창의적', '예술적', '자유로움', '표현력', '감각적'],
    emoji: '🌸🌬️',
    color: '#FFF0F5',
  },

  // 그룹 3: 함께 × 고요 (OB) - 조용한 연결의 맑음
  {
    type: 'OBSC',
    name: '이슬 내린 새벽 맑음',
    description: '새벽녘 풀잎마다 맺힌 이슬처럼 부드럽고 은은한 맑음. 조용히 타인과 연결되며 따뜻한 위로를 나누는 유형.',
    characteristics: ['부드러움', '공감', '섬세함', '위로', '포용력'],
    emoji: '💧🌱',
    color: '#E8F5E9',
  },
  {
    type: 'OBSW',
    name: '봄비 내리는 오후 맑음',
    description: '봄비가 촉촉이 내리는 오후의 고요한 맑음. 함께 있는 사람들에게 자연스러운 위안을 주는 유형.',
    characteristics: ['온화함', '치유', '안정적', '배려', '조화'],
    emoji: '🌧️🌿',
    color: '#C8E6C9',
  },
  {
    type: 'OBLC',
    name: '보름달 뜨는 밤 맑음',
    description: '보름달 아래 모인 사람들처럼 조용하지만 깊은 연대감을 나누는 맑음. 함께하는 시간에 의미를 부여하는 유형.',
    characteristics: ['연대감', '신뢰', '깊이', '의미', '유대감'],
    emoji: '🌕🌙',
    color: '#FFF3E0',
  },
  {
    type: 'OBLW',
    name: '봄날 아지랑이 맑음',
    description: '봄날 아지랑이처럼 부드럽고 몽환적인 맑음. 함께 있는 사람들과 편안하고 자연스러운 분위기를 만드는 유형.',
    characteristics: ['편안함', '자연스러움', '친근함', '수용적', '여유'],
    emoji: '🌸🌫️',
    color: '#FFF9C4',
  },

  // 그룹 4: 함께 × 역동 (OG) - 강렬한 연결의 맑음
  {
    type: 'OGSC',
    name: '뇌우 치는 오후 맑음',
    description: '천둥번개가 치는 뇌우 속에서도 함께 있으면 느껴지는 강렬한 맑음. 격렬한 상황 속에서도 타인과 강하게 연결되는 유형.',
    characteristics: ['강렬함', '카리스마', '리더십', '열정', '추진력'],
    emoji: '⚡🌩️',
    color: '#B39DDB',
  },
  {
    type: 'OGSW',
    name: '소나기 쏟아진 후 맑음',
    description: '소나기가 쏟아진 직후 함께 느끼는 상쾌하고 역동적인 맑음. 활발한 에너지로 타인과 적극적으로 교류하는 유형.',
    characteristics: ['활기참', '사교적', '긍정적', '에너제틱', '즐거움'],
    emoji: '☀️💧',
    color: '#81C784',
  },
  {
    type: 'OGLC',
    name: '구름 흐르는 저녁 맑음',
    description: '저녁 하늘을 빠르게 흐르는 구름처럼 역동적이면서도 아름다운 맑음. 함께하는 사람들과 깊이 있는 대화와 통찰을 나누는 유형.',
    characteristics: ['통찰력', '대화', '지적', '호기심', '영향력'],
    emoji: '☁️🌅',
    color: '#FFCCBC',
  },
  {
    type: 'OGLW',
    name: '무지개 뜬 하늘 맑음',
    description: '비온 뒤 무지개가 뜬 하늘처럼 화려하고 희망찬 맑음. 함께하는 사람들에게 긍정적 에너지와 영감을 전파하는 유형.',
    characteristics: ['희망적', '영감', '다채로움', '표현력', '낙관적'],
    emoji: '☀️✨',
    color: '#FFE082',
  },
];

// 유형별 프로필 조회
export function getWeatherProfile(type: WeatherProfileType): WeatherProfile | undefined {
  return weatherProfiles.find((profile) => profile.type === type);
}

// 모든 프로필 타입 가져오기
export function getAllProfileTypes(): WeatherProfileType[] {
  return weatherProfiles.map((profile) => profile.type);
}
