import { UserAnswer, WowbookProgram, ClarityTypeCode, ClarityType } from '@/types';
import { questions } from './questions';
import { wowbookPrograms } from './programs';
import { getClarityType } from './clarityTypes';

// 감정 프로필 타입
export interface EmotionProfile {
  calm: number;
  active: number;
  reflective: number;
  social: number;
}

// 옵션 ID로 축 값 매핑
const optionToAxisMap: Record<string, 'I' | 'O' | 'B' | 'G' | 'S' | 'L' | 'C' | 'W'> = {
  // Q1, Q2: I/O
  'q1-a1': 'I', 'q1-a3': 'I', 'q1-a2': 'O', 'q1-a4': 'O',
  'q2-a1': 'I', 'q2-a3': 'I', 'q2-a2': 'O', 'q2-a4': 'O',
  // Q3, Q4: B/G
  'q3-a1': 'B', 'q3-a3': 'B', 'q3-a2': 'G', 'q3-a4': 'G',
  'q4-a1': 'B', 'q4-a2': 'B', 'q4-a3': 'G', 'q4-a4': 'G', 'q4-a5': 'G',
  // Q5, Q6: S/L
  'q5-a1': 'S', 'q5-a3': 'S', 'q5-a2': 'L', 'q5-a4': 'L',
  'q6-a1': 'S', 'q6-a3': 'S', 'q6-a2': 'L', 'q6-a4': 'L',
  // Q7, Q8: C/W
  'q7-a1': 'C', 'q7-a3': 'C', 'q7-a2': 'W', 'q7-a4': 'W',
  'q8-a1': 'C', 'q8-a2': 'C', 'q8-a3': 'W', 'q8-a4': 'W', 'q8-a5': 'W',
};

// 맑음 유형 계산 함수
export function calculateClarityType(answers: UserAnswer[]): ClarityType {
  const scores = {
    I: 0,
    O: 0,
    B: 0,
    G: 0,
    S: 0,
    L: 0,
    C: 0,
    W: 0,
  };

  // 각 답변에서 점수 집계
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || !question.axis) return;

    const selectedValues = Array.isArray(answer.answer)
      ? answer.answer
      : [answer.answer];

    // 선택된 옵션들의 점수 합산
    selectedValues.forEach((value) => {
      const option = question.options?.find((opt) => opt.value === value);
      if (option) {
        // 축 값 매핑
        const axisValue = optionToAxisMap[option.id];
        if (axisValue) {
          scores[axisValue] += option.score;
        }
      }
    });
  });

  // 각 축별로 우세한 쪽 결정
  const axis1 = scores.I >= scores.O ? 'I' : 'O';
  const axis2 = scores.B >= scores.G ? 'B' : 'G';
  const axis3 = scores.S >= scores.L ? 'S' : 'L';
  const axis4 = scores.C >= scores.W ? 'C' : 'W';

  // 유형 코드 생성
  const typeCode = `${axis1}${axis2}${axis3}${axis4}` as ClarityTypeCode;

  console.log('🌤️ 맑음 유형 계산:', {
    scores,
    axes: { axis1, axis2, axis3, axis4 },
    typeCode,
    typeName: getClarityType(typeCode).name,
  });

  return getClarityType(typeCode);
}

// 감정 점수 계산 함수
export function calculateEmotionProfile(answers: UserAnswer[]): EmotionProfile {
  const scores: EmotionProfile = {
    calm: 0,
    active: 0,
    reflective: 0,
    social: 0,
  };

  // 각 답변을 분석하여 감정 점수 계산
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.type === 'text') return; // 텍스트 질문은 제외

    const selectedValues = Array.isArray(answer.answer)
      ? answer.answer
      : [answer.answer];

    // 선택된 옵션들의 감정 태그 수집
    const selectedOptions = question.options?.filter((opt) =>
      selectedValues.includes(opt.value)
    );

    if (!selectedOptions) return;

    // 가중치 계산 (단일 선택: 25점, 다중 선택: 선택 개수에 따라 분배)
    const weight = question.type === 'single' ? 25 : 15 / selectedValues.length;

    selectedOptions.forEach((option) => {
      if (option.emotion) {
        scores[option.emotion] += weight;
      }
    });
  });

  // 정규화: 최소값 기준으로 조정하여 0-100 범위로
  const total = scores.calm + scores.active + scores.reflective + scores.social;
  
  if (total === 0) {
    // 모든 값이 0이면 균등 분배
    return { calm: 25, active: 25, reflective: 25, social: 25 };
  }

  // 비율을 유지하면서 0-100 범위로 스케일링
  const maxScore = Math.max(scores.calm, scores.active, scores.reflective, scores.social);
  
  return {
    calm: Math.round((scores.calm / maxScore) * 100),
    active: Math.round((scores.active / maxScore) * 100),
    reflective: Math.round((scores.reflective / maxScore) * 100),
    social: Math.round((scores.social / maxScore) * 100),
  };
}

// 맑음 지수 계산 함수
export function calculateClarityScore(answers: UserAnswer[], emotionProfile: EmotionProfile): number {
  const q1Answer = answers.find((a) => a.questionId === 'q1');
  
  // Q1 (날씨) 기반 기본 점수
  let clarityBase = 50;
  if (q1Answer && typeof q1Answer.answer === 'string') {
    switch (q1Answer.answer) {
      case 'sunny':
        clarityBase = 90;
        break;
      case 'partly-cloudy':
        clarityBase = 70;
        break;
      case 'cloudy':
        clarityBase = 50;
        break;
      case 'rainy':
        clarityBase = 35;
        break;
      case 'stormy':
        clarityBase = 20;
        break;
    }
  }

  // Q2 (고민 주제) 기반 조정
  const q2Answer = answers.find((a) => a.questionId === 'q2');
  let clarityAdjust = 0;
  if (q2Answer && typeof q2Answer.answer === 'string') {
    switch (q2Answer.answer) {
      case 'fatigue':
        clarityAdjust = -5; // 무기력은 약간 감소
        break;
      case 'trauma':
        clarityAdjust = -10; // 트라우마는 더 감소
        break;
      case 'future':
        clarityAdjust = 5; // 미래 고민은 약간 증가 (방향성 있음)
        break;
    }
  }

  // Q3 (치유 방법) - 선택 개수가 많을수록 자기 이해도가 높음
  const q3Answer = answers.find((a) => a.questionId === 'q3');
  if (q3Answer && Array.isArray(q3Answer.answer)) {
    const healingMethodsCount = q3Answer.answer.length;
    // 2-4개 선택이 이상적 (너무 적거나 많으면 혼란)
    if (healingMethodsCount >= 2 && healingMethodsCount <= 4) {
      clarityAdjust += 5;
    }
  }

  // Q4 (필요한 것) - 평화/통찰은 맑음 증가, 변화/행동은 약간 감소
  const q4Answer = answers.find((a) => a.questionId === 'q4');
  if (q4Answer && typeof q4Answer.answer === 'string') {
    switch (q4Answer.answer) {
      case 'peace':
        clarityAdjust += 10;
        break;
      case 'insight':
        clarityAdjust += 8;
        break;
      case 'action':
        clarityAdjust -= 5; // 행동이 필요하다 = 현재는 정돈 안됨
        break;
    }
  }

  // Q6 (텍스트) - 답변 길이 기반 (자기 표현이 명확할수록 맑음)
  const q6Answer = answers.find((a) => a.questionId === 'q6');
  if (q6Answer && typeof q6Answer.answer === 'string') {
    const textLength = q6Answer.answer.trim().length;
    if (textLength > 100) {
      clarityAdjust += 10; // 충분히 긴 답변 = 자기 이해 높음
    } else if (textLength < 20) {
      clarityAdjust -= 5; // 짧은 답변 = 불명확
    }
  }

  // 최종 점수 계산 (0-100 범위)
  const finalScore = Math.max(0, Math.min(100, clarityBase + clarityAdjust));
  
  return Math.round(finalScore);
}

// 프로그램 추천 함수 (다양성 보장)
export function recommendPrograms(
  emotionProfile: EmotionProfile,
  answers: UserAnswer[]
): WowbookProgram[] {
  // 1. 각 프로그램과의 유사도 계산
  const programScores = wowbookPrograms.map((program) => {
    // 유클리드 거리 기반 유사도 (거리가 가까울수록 높은 점수)
    const distance = Math.sqrt(
      Math.pow(program.emotionMatch.calm - emotionProfile.calm, 2) +
      Math.pow(program.emotionMatch.active - emotionProfile.active, 2) +
      Math.pow(program.emotionMatch.reflective - emotionProfile.reflective, 2) +
      Math.pow(program.emotionMatch.social - emotionProfile.social, 2)
    );

    // 거리를 점수로 변환 (최대 거리 200 가정)
    const similarityScore = Math.max(0, 100 - (distance / 2));

    return {
      program,
      score: similarityScore,
      distance,
    };
  });

  // 2. 점수 기준 정렬
  programScores.sort((a, b) => b.score - a.score);

  // 3. 다양성을 고려한 선택
  const selectedPrograms: WowbookProgram[] = [];
  const usedCategories: Set<string> = new Set();
  const usedDates: Set<string> = new Set();

  // 첫 번째는 무조건 최고 점수
  selectedPrograms.push(programScores[0].program);
  usedCategories.add(programScores[0].program.category);
  usedDates.add(programScores[0].program.date);

  // 나머지 2개 선택 (다양성 고려)
  for (const item of programScores.slice(1)) {
    if (selectedPrograms.length >= 3) break;

    const program = item.program;
    
    // 다양성 점수 계산
    let diversityBonus = 0;
    
    // 다른 카테고리면 보너스
    if (!usedCategories.has(program.category)) {
      diversityBonus += 20;
    }
    
    // 다른 날짜면 보너스
    if (!usedDates.has(program.date)) {
      diversityBonus += 10;
    }

    // 최종 점수 = 유사도 점수 + 다양성 보너스
    const finalScore = item.score + diversityBonus;

    // 일정 점수 이상이면 선택
    if (finalScore > 40 || selectedPrograms.length < 3) {
      selectedPrograms.push(program);
      usedCategories.add(program.category);
      usedDates.add(program.date);
    }
  }

  // 4. 혹시 3개 미만이면 점수 순으로 채우기
  if (selectedPrograms.length < 3) {
    for (const item of programScores) {
      if (selectedPrograms.length >= 3) break;
      if (!selectedPrograms.includes(item.program)) {
        selectedPrograms.push(item.program);
      }
    }
  }

  return selectedPrograms.slice(0, 3);
}

// 답변 해시 생성 (같은 답변 조합은 같은 추천)
export function generateAnswerHash(answers: UserAnswer[]): string {
  // Q6 제외 (텍스트는 해시에서 제외하여 일관성 유지)
  const relevantAnswers = answers
    .filter((a) => a.questionId !== 'q6')
    .map((a) => {
      const answer = Array.isArray(a.answer) 
        ? a.answer.sort().join(',') 
        : a.answer;
      return `${a.questionId}:${answer}`;
    })
    .sort()
    .join('|');

  return relevantAnswers;
}

