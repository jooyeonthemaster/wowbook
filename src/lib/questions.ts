import { Question } from '@/types';

export const questions: Question[] = [
  // ============================================
  // I/O 축: 맑아지는 공간 (혼자 vs 함께)
  // ============================================
  {
    id: 'q1',
    title: '갑자기 비가 내리기 시작했어요.\n당신은?',
    description: '가장 끌리는 것을 선택해주세요.',
    type: 'single',
    step: 1,
    axis: 'I/O',
    options: [
      { 
        id: 'q1-a1',
        text: '🌧️ 혼자 창가에 앉아 빗소리를 듣는다',
        value: 'q1-a1',
        score: 2,
        vibe: '비를 혼자 온전히 느끼고 싶음',
        emotion: 'calm'
      },
      { 
        id: 'q1-a2',
        text: '☔ 우산 쓰고 누군가와 함께 비를 맞으러 나간다',
        value: 'q1-a2',
        score: 2,
        vibe: '비를 함께 경험하고 싶음',
        emotion: 'social'
      },
      { 
        id: 'q1-a3',
        text: '📚 혼자 이불 속에서 빗소리 들으며 책을 읽는다',
        value: 'q1-a3',
        score: 1,
        vibe: '비 오는 날은 나만의 시간',
        emotion: 'calm'
      },
      { 
        id: 'q1-a4',
        text: '🍵 친구 불러서 빗소리 들으며 수다를 떤다',
        value: 'q1-a4',
        score: 1,
        vibe: '비 오는 날은 함께할 때',
        emotion: 'social'
      },
    ],
  },
  {
    id: 'q2',
    title: '당신이 더 좋아하는\n날씨는?',
    description: '더 편안하고 좋은 날씨를 선택해주세요.',
    type: 'single',
    step: 2,
    axis: 'I/O',
    options: [
      { 
        id: 'q2-a1',
        text: '🌫️ 안개 낀 아침 - 세상이 조용하고 나만 있는 느낌',
        value: 'q2-a1',
        score: 2,
        vibe: '고립된 평화로움',
        emotion: 'reflective'
      },
      { 
        id: 'q2-a2',
        text: '☀️ 쨍한 맑은 날 - 모두가 밖에 나와 있는 느낌',
        value: 'q2-a2',
        score: 2,
        vibe: '함께하는 활기',
        emotion: 'social'
      },
      { 
        id: 'q2-a3',
        text: '🌙 별이 쏟아지는 밤 - 혼자 하늘을 보는 시간',
        value: 'q2-a3',
        score: 1,
        vibe: '나만의 밤하늘',
        emotion: 'reflective'
      },
      { 
        id: 'q2-a4',
        text: '🌈 비 온 뒤 무지개 - 사람들이 함께 보는 순간',
        value: 'q2-a4',
        score: 1,
        vibe: '함께 나누는 감동',
        emotion: 'social'
      },
    ],
  },

  // ============================================
  // B/G 축: 맑아지는 에너지 (고요 vs 역동)
  // ============================================
  {
    id: 'q3',
    title: '창문을 열었어요.\n어떤 바람이 불어오길 바라나요?',
    description: '더 좋은 바람을 선택해주세요.',
    type: 'single',
    step: 3,
    axis: 'B/G',
    options: [
      { 
        id: 'q3-a1',
        text: '🍃 살랑살랑 부드러운 산들바람',
        value: 'q3-a1',
        score: 2,
        vibe: '고요하고 평화로운',
        emotion: 'calm'
      },
      { 
        id: 'q3-a2',
        text: '💨 휘익 지나가는 시원한 강풍',
        value: 'q3-a2',
        score: 2,
        vibe: '역동적이고 강렬한',
        emotion: 'active'
      },
      { 
        id: 'q3-a3',
        text: '🌾 나뭇잎 흔들리는 정도의 잔잔한 바람',
        value: 'q3-a3',
        score: 1,
        vibe: '차분하게 느껴지는',
        emotion: 'calm'
      },
      { 
        id: 'q3-a4',
        text: '🌪️ 머리카락 날리는 세찬 바람',
        value: 'q3-a4',
        score: 1,
        vibe: '활력 넘치는',
        emotion: 'active'
      },
    ],
  },
  {
    id: 'q4',
    title: '4개의 계절 중\n당신과 가장 닮은 계절은?',
    description: '여러 개 선택 가능 (최대 2개)',
    type: 'multiple',
    step: 4,
    axis: 'B/G',
    maxSelect: 2,
    options: [
      { 
        id: 'q4-a1',
        text: '🍂 가을 - 차분하게 가라앉으며 깊어지는',
        value: 'q4-a1',
        score: 1,
        vibe: '고요한 성숙',
        emotion: 'reflective'
      },
      { 
        id: 'q4-a2',
        text: '❄️ 겨울 - 고요하고 평화롭게 정화되는',
        value: 'q4-a2',
        score: 1,
        vibe: '청정한 고요',
        emotion: 'calm'
      },
      { 
        id: 'q4-a3',
        text: '🌸 봄 - 활기차게 피어나고 시작되는',
        value: 'q4-a3',
        score: 1,
        vibe: '생동하는 시작',
        emotion: 'active'
      },
      { 
        id: 'q4-a4',
        text: '☀️ 여름 - 뜨겁게 타오르며 활발한',
        value: 'q4-a4',
        score: 1,
        vibe: '역동적 에너지',
        emotion: 'active'
      },
      { 
        id: 'q4-a5',
        text: '🌦️ 환절기 - 변화하며 움직이는',
        value: 'q4-a5',
        score: 1,
        vibe: '활동적 전환',
        emotion: 'active'
      },
    ],
  },

  // ============================================
  // S/L 축: 맑아지는 방식 (깊이 vs 넓이)
  // ============================================
  {
    id: 'q5',
    title: '밤하늘을 올려다보고 있어요.\n무엇이 보이나요?',
    description: '더 공감되는 것을 선택해주세요.',
    type: 'single',
    step: 5,
    axis: 'S/L',
    options: [
      { 
        id: 'q5-a1',
        text: '⭐ 하나의 별을 집중해서 보며 그 빛의 의미를 생각한다',
        value: 'q5-a1',
        score: 2,
        vibe: '하나를 깊이',
        emotion: 'reflective'
      },
      { 
        id: 'q5-a2',
        text: '🌌 온 하늘의 별들을 보며 우주 전체를 상상한다',
        value: 'q5-a2',
        score: 2,
        vibe: '전체를 넓게',
        emotion: 'reflective'
      },
      { 
        id: 'q5-a3',
        text: '🔭 별자리 하나를 찾아 완벽하게 이해하고 싶다',
        value: 'q5-a3',
        score: 1,
        vibe: '하나를 완벽히',
        emotion: 'reflective'
      },
      { 
        id: 'q5-a4',
        text: '🌠 여러 별자리의 신화를 연결하며 상상한다',
        value: 'q5-a4',
        score: 1,
        vibe: '여러 것을 연결',
        emotion: 'social'
      },
    ],
  },
  {
    id: 'q6',
    title: '오늘은 날씨가 정말 좋아요.\n당신의 선택은?',
    description: '더 끌리는 것을 선택해주세요.',
    type: 'single',
    step: 6,
    axis: 'S/L',
    options: [
      { 
        id: 'q6-a1',
        text: '🌳 한 곳에 오래 앉아 햇살과 바람을 온전히 느낀다',
        value: 'q6-a1',
        score: 2,
        vibe: '하나를 깊이 체험',
        emotion: 'calm'
      },
      { 
        id: 'q6-a2',
        text: '🚴 여러 장소를 돌아다니며 다양한 풍경을 본다',
        value: 'q6-a2',
        score: 2,
        vibe: '여러 것을 경험',
        emotion: 'active'
      },
      { 
        id: 'q6-a3',
        text: '🪑 벤치에 앉아 구름 하나가 흘러가는 걸 끝까지 본다',
        value: 'q6-a3',
        score: 1,
        vibe: '하나를 끝까지',
        emotion: 'reflective'
      },
      { 
        id: 'q6-a4',
        text: '📸 이 풍경 저 풍경 사진 찍으며 여기저기 구경한다',
        value: 'q6-a4',
        score: 1,
        vibe: '다양하게 포착',
        emotion: 'social'
      },
    ],
  },

  // ============================================
  // C/W 축: 맑음의 언어 (이성 vs 감성)
  // ============================================
  {
    id: 'q7',
    title: '내일 비가 온대요.\n당신의 반응은?',
    description: '더 공감되는 것을 선택해주세요.',
    type: 'single',
    step: 7,
    axis: 'C/W',
    options: [
      { 
        id: 'q7-a1',
        text: '📱 "강수확률 몇 %지? 우산 챙겨야 하나?"',
        value: 'q7-a1',
        score: 2,
        vibe: '논리적 판단과 준비',
        emotion: 'reflective'
      },
      { 
        id: 'q7-a2',
        text: '💭 "아... 비 오는 날 특유의 그 감성..."',
        value: 'q7-a2',
        score: 2,
        vibe: '감성적 느낌과 분위기',
        emotion: 'calm'
      },
      { 
        id: 'q7-a3',
        text: '🤔 "저기압이 오는구나. 기압 변화 때문에..."',
        value: 'q7-a3',
        score: 1,
        vibe: '과학적 이해와 분석',
        emotion: 'reflective'
      },
      { 
        id: 'q7-a4',
        text: '☔ "비 냄새 좋아. 우산 쓰고 걷고 싶다"',
        value: 'q7-a4',
        score: 1,
        vibe: '감각적 경험과 기대',
        emotion: 'social'
      },
    ],
  },
  {
    id: 'q8',
    title: '가장 기억에 남는\n날씨가 있나요?',
    description: '여러 개 선택 가능 (최대 2개)',
    type: 'multiple',
    step: 8,
    axis: 'C/W',
    maxSelect: 2,
    options: [
      { 
        id: 'q8-a1',
        text: '☀️ "일출 시각이 완벽했던 그 여행의 타이밍"',
        value: 'q8-a1',
        score: 1,
        vibe: '계획과 타이밍의 완벽함',
        emotion: 'reflective'
      },
      { 
        id: 'q8-a2',
        text: '🌡️ "영하로 떨어진 순간의 그 청명함"',
        value: 'q8-a2',
        score: 1,
        vibe: '정확한 수치의 기억',
        emotion: 'reflective'
      },
      { 
        id: 'q8-a3',
        text: '🌧️ "소나기 맞으며 울었던 그날의 기분"',
        value: 'q8-a3',
        score: 1,
        vibe: '감정과 날씨의 일치',
        emotion: 'social'
      },
      { 
        id: 'q8-a4',
        text: '🌅 "노을 보며 누군가와 나눴던 그 대화"',
        value: 'q8-a4',
        score: 1,
        vibe: '관계와 분위기',
        emotion: 'social'
      },
      { 
        id: 'q8-a5',
        text: '❄️ "첫눈 내릴 때의 그 설레는 공기"',
        value: 'q8-a5',
        score: 1,
        vibe: '감각적 순간',
        emotion: 'calm'
      },
    ],
  },
];