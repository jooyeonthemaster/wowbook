// 질문 타입
export interface Question {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  step: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  emotion?: 'calm' | 'active' | 'reflective' | 'social';
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

