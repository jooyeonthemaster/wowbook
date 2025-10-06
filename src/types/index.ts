// 질문 타입
export interface Question {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  step: number;
  axis?: 'I/O' | 'B/G' | 'S/L' | 'C/W'; // 측정 축
  maxSelect?: number; // 다중 선택 최대 개수
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number; // 점수 (1 or 2)
  vibe?: string; // 분위기 설명
  emotion?: 'calm' | 'active' | 'reflective' | 'social'; // 기존 호환성
}

// 맑음 유형 타입
export type ClarityTypeCode = 
  | 'IBSC' | 'IBSW' | 'IBLC' | 'IBLW'
  | 'IGSC' | 'IGSW' | 'IGLC' | 'IGLW'
  | 'OBSC' | 'OBSW' | 'OBLC' | 'OBLW'
  | 'OGSC' | 'OGSW' | 'OGLC' | 'OGLW';

export interface ClarityType {
  code: ClarityTypeCode;
  name: string; // "새벽 서리 맑음"
  nameEn: string; // "Dawn Frost Clarity"
  nickname: string; // "차가운 명료함"
  emoji: string; // "❄️🌅"
  description: string; // 유형 설명 (짧게)
  characteristics: string[]; // 핵심 특성 4-5개
  clarityMoment: string; // 맑아지는 순간 (서정적으로)
  festivalStyle: {
    programs: string[];
    place: string;
    time: string;
    participation: string;
  };
  signature: string; // 대표 문장
  tags: string[]; // 키워드
}

// 사용자 응답 타입
export interface UserAnswer {
  questionId: string;
  answer: string | string[];
}

// 와우북페스티벌 프로그램 타입
export interface WowbookProgram {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
  reservationUrl: string; // 프로그램 예약 링크
  emotionMatch: {
    calm: number;      // 0-100: 조용하고 평화로운 정도
    active: number;    // 0-100: 활동적이고 역동적인 정도
    reflective: number; // 0-100: 성찰적이고 깊이 있는 정도
    social: number;    // 0-100: 사회적이고 교류적인 정도
  };
}

// 여정 스텝 타입
export interface JourneyStep {
  icon: string;
  keyword: string;
  action: string;
  date: string;
}

// AI 추천 결과 타입
export interface RecommendationResult {
  clarityType: ClarityType; // 맑음 유형 (16가지)
  recommendedPrograms: WowbookProgram[];
  programReasons: { [programId: string]: string }; // 각 프로그램 추천 이유 (주접 가득)
  userEmotionProfile: {
    calm: number;
    active: number;
    reflective: number;
    social: number;
  };
  clarity: number; // 0-100: "맑음" 정도
  message: string; // 짧고 강렬한 메시지 (100-150자)
  journey: JourneyStep[]; // 시각적 여정 스텝
}

// Firebase에 저장할 세션 데이터
export interface SessionData {
  id: string;
  answers: UserAnswer[];
  result?: RecommendationResult;
  createdAt: Date;
  completedAt?: Date;
}

// 기상 일지 타입
export type WeatherMood = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';

export interface WeatherDiary {
  id: string;
  userId: string;
  programId: string;
  programTitle: string;
  mood: WeatherMood; // 프로그램을 체험한 기분(날씨)
  content: string; // 짧은 소감
  createdAt: Date;
}

// Admin 통계 타입
export interface ProgramStats {
  programId: string;
  programTitle: string;
  totalDiaries: number;
  uniqueUsers: number;
  moodDistribution: {
    sunny: number;
    'partly-cloudy': number;
    cloudy: number;
    rainy: number;
    stormy: number;
    snowy: number;
  };
  topMood: WeatherMood;
  diaries: WeatherDiary[];
}

export interface AdminStats {
  totalDiaries: number;
  totalUsers: number;
  programStats: ProgramStats[];
}

export interface KeywordAnalysis {
  keywords: { word: string; count: number }[];
  summary: string;
}

// 분석 결과 저장 타입
export interface AnalysisResult {
  id: string;
  userId: string;
  result: RecommendationResult;
  answers: UserAnswer[];
  createdAt: Date;
}

// 16개 날씨 유형 프로필 타입 (MBTI 스타일)
export type WeatherProfileType =
  // 그룹 1: 혼자 × 고요 (IB) - 조용한 내면의 맑음
  | 'IBSC'  // 새벽 서리 맑음
  | 'IBSW'  // 봄날 아침 맑음
  | 'IBLC'  // 가을밤 보름달 맑음
  | 'IBLW'  // 안개 낀 아침 맑음
  // 그룹 2: 혼자 × 역동 (IG) - 강렬한 내면의 맑음
  | 'IGSC'  // 겨울 눈보라 맑음
  | 'IGSW'  // 여름 소나기 맑음
  | 'IGLC'  // 별이 쏟아지는 밤 맑음
  | 'IGLW'  // 봄바람 꽃잎 맑음
  // 그룹 3: 함께 × 고요 (OB) - 조용한 연결의 맑음
  | 'OBSC'  // 이슬 내린 새벽 맑음
  | 'OBSW'  // 봄비 내리는 오후 맑음
  | 'OBLC'  // 보름달 뜨는 밤 맑음
  | 'OBLW'  // 봄날 아지랑이 맑음
  // 그룹 4: 함께 × 역동 (OG) - 강렬한 연결의 맑음
  | 'OGSC'  // 뇌우 치는 오후 맑음
  | 'OGSW'  // 소나기 쏟아진 후 맑음
  | 'OGLC'  // 구름 흐르는 저녁 맑음
  | 'OGLW'; // 무지개 뜬 하늘 맑음

export interface WeatherProfile {
  type: WeatherProfileType;
  name: string;
  description: string;
  characteristics: string[];
  emoji: string;
  color: string;
}

// 이미지 생성 요청 타입
export interface ProfileImageGenerationRequest {
  referenceImage: string; // Base64
  profileType: WeatherProfileType;
}

// 이미지 생성 응답 타입
export interface ProfileImageGenerationResponse {
  success: boolean;
  profileType: WeatherProfileType;
  generatedImage?: string; // Base64
  error?: string;
}

