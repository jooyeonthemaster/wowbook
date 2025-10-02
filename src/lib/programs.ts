import { WowbookProgram } from '@/types';

// 21회 서울와우북페스티벌 프로그램 데이터
export const wowbookPrograms: WowbookProgram[] = [
  {
    id: 'prog-1',
    title: '개막식 & 이어지는 목소리들',
    category: '개막행사',
    date: '10.17.금',
    time: '18:30',
    location: '서교스퀘어홀',
    description: '세익스피어의 『겨울 이야기』를 지넷 윈터슨이 『시간의 틈』으로 재탄생시키고, 이를 다시 소리꾼 정은혜가 한국의 판소리로 공연합니다. 시대와 장르를 넘나드는 세 번의 변주가 하나의 무대에서 만납니다. 공연에 이어 지넷 윈터슨과 한국 작가 듀나가 함께하는 토크가 진행됩니다.',
    tags: ['개막', '공연', '토크', '지넷윈터슨', '듀나', '판소리', '고전', '재창조'],
    emotionMatch: {
      calm: 50,
      active: 80,
      reflective: 70,
      social: 90,
    },
  },
  {
    id: 'prog-2',
    title: '한 장의 사진, 한 사람의 삶',
    category: '와우스페셜',
    date: '10.18.토',
    time: '11:00',
    location: '서교스퀘어홀',
    description: '어린 시절, 동급생에게 건넨 필름 카메라 한 대. 『빛과 멜로디』는 그 작은 선물이 어떻게 한 사람을 살리고, 그 삶이 또 어떻게 세계로 뻗어나가는지 그린 이야기입니다. 한 장의 사진이 어떻게 한 사람의 삶을 바꿀 수 있을까? 혼란 속에서도 서로를 지켜온 투명한 마음들, 한 사람의 맑음이 또 다른 맑음을 부르는 순간들을 만나봅니다.',
    tags: ['사진', '삶', '선물', '감동', '이야기'],
    emotionMatch: {
      calm: 85,
      active: 40,
      reflective: 95,
      social: 70,
    },
  },
  {
    id: 'prog-3',
    title: '일상이 고고학이 되는 순간',
    category: '와우판타스틱서재',
    date: '10.18.토',
    time: '11:00',
    location: '연습실4',
    description: '황윤 작가의 \'일상이 고고학\' 시리즈에 대한 이야기를 나눕니다. 박물관 마니아가 동네를 산책하듯 만나는 역사의 순간들에서 감상, 고증, 연구를 통한 즐거운 휴식을 제안합니다.',
    tags: ['역사', '고고학', '일상', '산책', '휴식'],
    emotionMatch: {
      calm: 90,
      active: 30,
      reflective: 95,
      social: 50,
    },
  },
  {
    id: 'prog-4',
    title: '마르크 마예프스키 그림책 워크숍',
    category: '와우국제교류',
    date: '10.18.토',
    time: '12:00',
    location: '로비',
    description: '빛과 색채에 매력을 느끼며 자연의 풍경을 그리는 것을 좋아하는 그림책 작가 마르크 마예프스키의 워크숍입니다. 자연과 빛을 다채롭고 섬세하게 표현해낸 그의 그림들을 살펴보며 참여자들이 자신만의 빛과 색채를 찾고 이를 그림책으로 표현하는 시간을 가집니다.',
    tags: ['그림책', '워크숍', '자연', '빛', '색채', '창작'],
    emotionMatch: {
      calm: 80,
      active: 70,
      reflective: 75,
      social: 60,
    },
  },
  {
    id: 'prog-5',
    title: '제로웨이스트로 가는 일상의 전환',
    category: '와우판타스틱서재',
    date: '10.18.토',
    time: '14:00',
    location: '연습실4',
    description: '쓰레기 문맹 탈출을 돕는 쓰레기 해설자이자 통역가 홍수열(자연순환사회연구소 소장)의 일상 속 환경 실천 이야기입니다. 22년간 쓰레기만 연구해온 \'쓰레기 박사\'가 인간의 소비 행동과 쓰레기 배출의 상관관계 등을 통해 일상에서 시작되는 작은 변화가 어떻게 지구를 바꿀 수 있는지 구체적 대안을 제시합니다.',
    tags: ['환경', '제로웨이스트', '쓰레기', '지속가능', '실천'],
    emotionMatch: {
      calm: 60,
      active: 80,
      reflective: 85,
      social: 75,
    },
  },
  {
    id: 'prog-6',
    title: '사람의 마음을 움직이는 이야기',
    category: '와우판타스틱서재',
    date: '10.18.토',
    time: '16:00',
    location: '연습실4',
    description: '『브랜딩 위드 AI』의 저자 최현희 마케터가 AI가 모든 것을 분석하는 오늘날, 사람의 마음을 움직이고 붙잡는 브랜딩이란 무엇인가에 대해 알려줍니다. 1913송정역시장부터 도시 공간까지, 평범한 사람들의 작은 배려와 용기가 진짜 브랜드를 만들어 간 이야기를 공유하며, 인간다움에 더 가까워지는 기회 앞에 선 브랜드의 현재를 짚어줍니다.',
    tags: ['브랜딩', 'AI', '마케팅', '이야기', '인간다움'],
    emotionMatch: {
      calm: 50,
      active: 70,
      reflective: 80,
      social: 85,
    },
  },
  {
    id: 'prog-7',
    title: '니체와 장자, 맑음을 말하다',
    category: '와우스페셜',
    date: '10.18.토',
    time: '18:00',
    location: '연습실4',
    description: '혼돈의 시대에 맑음이란 무엇일까? 19세기 독일의 철학자 니체와 기원전 중국의 사상가 장자가 전하는 지혜를 통해 우리 시대 \'맑음\'의 의미를 함께 듣습니다. 창조적 파괴와 자연스러운 조화, 서로 다른 길처럼 보이지만 두 철학자 모두 기존의 틀에 갇히지 않고 본질로 돌아가 진정한 자유를 찾으라고 말합니다.',
    tags: ['철학', '니체', '장자', '맑음', '자유', '사유'],
    emotionMatch: {
      calm: 75,
      active: 40,
      reflective: 100,
      social: 50,
    },
  },
  {
    id: 'prog-8',
    title: '자연 속 무한한 이야기들',
    category: '와우국제교류',
    date: '10.18.토',
    time: '14:00',
    location: '서교스퀘어홀',
    description: '프랑스 남부에서 태어나 베를린에 살고 있는 그림책 작가 마르크 마예프스키와 한국의 김혜은 작가가 만납니다. \'계절의 인사\'라는 주제 하에 자연을 바라보는 서로의 다른 시선을 교차시킨 작업에 대해 이야기합니다. 각자의 작업 세계를 소개하고, 두 작가가 함께 그려낸 자연의 서사가 어떤 의미를 가지는지 관객과 함께 나눕니다.',
    tags: ['그림책', '자연', '국제교류', '계절', '서사'],
    emotionMatch: {
      calm: 90,
      active: 40,
      reflective: 85,
      social: 65,
    },
  },
  {
    id: 'prog-9',
    title: '집, 그리고',
    category: '와우국제교류',
    date: '10.18.토',
    time: '18:30',
    location: '서교스퀘어홀',
    description: '한국의 만화가 홍연식과 캐나다의 그래픽 노블 작가 에릭 킴이 만나 \'집\'을 이야기합니다. 집은 우리가 태어난 곳이자 돌아가고 싶은 곳입니다. 때로는 떠나고 싶었던 곳이기도 하고, 다시 찾아 헤매는 곳이기도 합니다. 한국과 캐나다, 서로 다른 문화와 길을 걸어온 두 작가가 각자의 방식으로 그려내는 \'집\'의 모습을 통해, 물리적 공간을 넘어 정서적 안식처이자 정체성의 뿌리인 \'집\'에 대해 이야기 나눕니다.',
    tags: ['집', '가족', '정체성', '만화', '그래픽노블', '국제교류'],
    emotionMatch: {
      calm: 80,
      active: 35,
      reflective: 95,
      social: 70,
    },
  },
  {
    id: 'prog-10',
    title: '기후가 찾는 질문, 우리가 찾는 맑음',
    category: '와우스페셜',
    date: '10.19.일',
    time: '11:00',
    location: '서교스퀘어홀',
    description: '30년간 국립기상과학원에서 기후를 연구한 대기과학자 조천호와 『천 개의 파랑』으로 한국과학문학상 대상을 수상한 SF작가 천선란이 만납니다. 과학 데이터가 보여주는 엄중한 현실과 문학적 상상력이 그려내는 다른 미래 사이에서, 기후위기 속에서도 포기하지 않는 평범한 사람들의 작은 실천이 어떻게 변화의 씨앗이 되는지 함께 모색합니다.',
    tags: ['기후위기', '환경', '과학', 'SF', '미래', '실천'],
    emotionMatch: {
      calm: 55,
      active: 75,
      reflective: 90,
      social: 80,
    },
  },
  {
    id: 'prog-11',
    title: '레모, 단어 하나를 옮기는 일',
    category: '와우판타스틱서재',
    date: '10.19.일',
    time: '12:00',
    location: '연습실4',
    description: 'AI가 번역을 빠르게 대체하는 시대, 번역가의 자리는 어디일까? 프랑스 문학을 한국어로 옮기고 출판하는 과정에서 얻은 기쁨과 막막함, 그리고 출판사를 운영하며 겪은 외국 문학 번역의 현실을 이야기합니다. 번역에 대한 나름의 정의와 번역가의 자세를 나눕니다.',
    tags: ['번역', '문학', '언어', 'AI', '출판'],
    emotionMatch: {
      calm: 85,
      active: 30,
      reflective: 95,
      social: 60,
    },
  },
  {
    id: 'prog-12',
    title: '종말의 끝에서 기후정의를 외치다',
    category: '와우스페셜',
    date: '10.19.일',
    time: '14:00',
    location: '연습실4',
    description: '기후 위기와 재난은 모두에게 평등하게 다가올까? 기후정의를 강연해온 과학저술가 박재용과 『루나』에서 우주로 내몰린 해녀들의 이야기를 통해 기술 발전 이면의 불평등을 그려낸 SF작가 서윤빈이 만납니다. 삶의 조건에 따라 달라질 기후 종말을 구체적으로 상상하고, 불평등한 세상에서 기후정의를 실현하기 위해 우리가 지금 할 수 있는 일을 함께 고민합니다.',
    tags: ['기후정의', '불평등', 'SF', '사회', '재난', '실천'],
    emotionMatch: {
      calm: 45,
      active: 85,
      reflective: 90,
      social: 85,
    },
  },
  {
    id: 'prog-13',
    title: '이야기가 이야기를 부를때',
    category: '폐막토크',
    date: '10.19.일',
    time: '14:30',
    location: '서교스퀘어홀',
    description: '작가 은유가 축제 기간 동안 나눈 이야기들 속에서 발견한 사람들의 맑은 순간들을 함께 나눕니다. 『아무튼, 인터뷰』, 『폭력과 존엄 사이』에서 평범한 사람들의 이야기를 듣고 전달해온 작가가 "그리 대단한 사람은 없다. 그렇다고 그냥 사는 사람도 없다"는 문장을 마음에 새기며 축제를 마무리하고 새로운 시작을 엽니다.',
    tags: ['폐막', '인터뷰', '이야기', '사람', '울림'],
    emotionMatch: {
      calm: 70,
      active: 60,
      reflective: 85,
      social: 95,
    },
  },
];

// Gemini API를 위한 프로그램 정보 요약
export const programSummary = {
  totalPrograms: wowbookPrograms.length,
  festivalName: '21회 서울와우북페스티벌',
  dates: ['10.17.금', '10.18.토', '10.19.일'],
  locations: ['서교스퀘어홀', '연습실4', '로비'],
  categories: ['개막행사', '와우스페셜', '와우판타스틱서재', '와우국제교류', '폐막토크'],
  themes: [
    '맑음과 치유',
    '기후위기와 환경',
    '고전의 재해석',
    '일상의 가치',
    '국제 문화 교류',
    '철학과 성찰',
    '창작과 예술',
  ],
};

// 카테고리별 프로그램 필터링 헬퍼 함수
export function getProgramsByCategory(category: string): WowbookProgram[] {
  return wowbookPrograms.filter((program) => program.category === category);
}

// 감정 매칭 점수로 정렬 헬퍼 함수
export function sortProgramsByEmotion(
  programs: WowbookProgram[],
  emotionProfile: { calm: number; active: number; reflective: number; social: number }
): WowbookProgram[] {
  return programs.sort((a, b) => {
    const scoreA =
      Math.abs(a.emotionMatch.calm - emotionProfile.calm) +
      Math.abs(a.emotionMatch.active - emotionProfile.active) +
      Math.abs(a.emotionMatch.reflective - emotionProfile.reflective) +
      Math.abs(a.emotionMatch.social - emotionProfile.social);
    
    const scoreB =
      Math.abs(b.emotionMatch.calm - emotionProfile.calm) +
      Math.abs(b.emotionMatch.active - emotionProfile.active) +
      Math.abs(b.emotionMatch.reflective - emotionProfile.reflective) +
      Math.abs(b.emotionMatch.social - emotionProfile.social);
    
    return scoreA - scoreB; // 낮은 차이 = 더 잘 맞음
  });
}
