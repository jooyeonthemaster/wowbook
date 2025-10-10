import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserAnswer, RecommendationResult } from '@/types';
import { questions } from '@/lib/questions';
import {
  calculateClarityType,
  calculateEmotionProfile,
  calculateClarityScore,
  recommendPrograms,
  generateAnswerHash,
} from '@/lib/recommendationEngine';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: UserAnswer[] } = await request.json();

    // ============================================
    // 1단계: 규칙 기반 추천 (일관성 & 다양성 보장)
    // ============================================
    
    // 맑음 유형 계산 (16가지)
    const clarityType = calculateClarityType(answers);
    
    // 감정 프로필 계산
    const userEmotionProfile = calculateEmotionProfile(answers);
    
    // 맑음 지수 계산
    const clarity = calculateClarityScore(answers, userEmotionProfile);
    
    // 프로그램 추천 (규칙 기반)
    const recommendedPrograms = recommendPrograms(userEmotionProfile, answers);
    const recommendedProgramIds = recommendedPrograms.map((p) => p.id);

    console.log('📊 규칙 기반 추천 완료:', {
      clarityType: clarityType.name,
      clarityTypeCode: clarityType.code,
      emotionProfile: userEmotionProfile,
      clarity,
      recommendedPrograms: recommendedPrograms.map((p) => p.title),
      answerHash: generateAnswerHash(answers),
    });

    // ============================================
    // 2단계: AI 기반 설명 생성 (감성적 톤)
    // ============================================

    // 사용자 응답을 텍스트로 변환
    const userProfile = answers
      .map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        if (!question) return '';

        if (question.type === 'text') {
          return `${question.title}\n답변: ${answer.answer}`;
        } else {
          const selectedValues = Array.isArray(answer.answer)
            ? answer.answer
            : [answer.answer];
          const selectedOptions = question.options?.filter((opt) =>
            selectedValues.includes(opt.value)
          );
          return `${question.title}\n답변: ${selectedOptions?.map((o) => o.text).join(', ')}`;
        }
      })
      .join('\n\n');

    // 추천된 프로그램 정보 생성
    const recommendedProgramsInfo = recommendedPrograms
      .map((p, idx) => `${idx + 1}. ${p.title} (${p.category})
   - 날짜/시간: ${p.date} ${p.time}
   - 장소: ${p.location}
   - 설명: ${p.description}
   - 태그: ${p.tags.join(', ')}`)
      .join('\n\n');

    // Gemini 프롬프트 생성 (설명만 요청)
    const prompt = `당신은 사람의 마음을 단 몇 줄로도 꿰뚫어보는 영혼 분석가입니다. 
과할 정도로 공감하고, 소름끼치게 정확하게, 그리고 주접스러울 만큼 열정적으로 분석합니다.
일반적인 조언은 절대 금지! 이 사람만을 위한, 이 순간만을 위한 메시지를 만들어야 합니다.

사용자의 응답:
${userProfile}

📊 분석된 감정 프로필 (이미 계산됨):
- 평온함(Calm): ${userEmotionProfile.calm}/100
- 활동성(Active): ${userEmotionProfile.active}/100
- 성찰(Reflective): ${userEmotionProfile.reflective}/100
- 교류(Social): ${userEmotionProfile.social}/100

☀️ 맑음 지수 (이미 계산됨): ${clarity}/100

🎯 추천된 프로그램 (이미 선정됨 - 변경 불가):
${recommendedProgramsInfo}

---

✨ 당신의 임무:
위에서 이미 선정된 프로그램 3개에 대해, 사용자의 답변을 바탕으로 "왜 이 프로그램이 당신에게 완벽한가"를 주접 가득하게 설명해주세요!

📝 작성 가이드:

1. 각 프로그램별 추천 이유 (대환장 유쾌파티 모드!)
   - 각 추천 프로그램마다 왜 이게 당신에게 완벽한지 설명하세요
   - 사용자의 구체적인 답변을 인용하며 연결고리를 만드세요
   - 톤: 친구가 "야 이거 진짜 너 거 같은데???" 하면서 극찬하는 느낌
   - 분량: 프로그램당 150-250자, 읽으면 "헐 진짜 나한테 딱인데?" 하고 바로 예매하고 싶게
   
   ❌ 나쁜 예: "이 프로그램은 당신의 성찰적인 성향에 맞습니다"
   ✅ 좋은 예: "당신이 '나 자신에 대한 의문'을 선택한 순간부터 이미 정해져 있었어요. 니체와 장자? 완전 당신 취향 저격이잖아요. 특히 '기존의 틀에 갇히지 않고'라는 문구 보세요. 당신이 마지막 질문에 쓴 그 문장이랑 소름돋게 연결되는 거 느껴지죠? 이 프로그램에서 당신이 찾던 답을 만날 거예요."

2. 여정 스텝 (3-4개) - 키워드와 액션 중심!
   - 추천된 프로그램들을 활용하여 여정 구성
   - 각 스텝은 다음 구조:
     * icon: 이모지 1개 (그 단계를 상징)
     * keyword: 핵심 키워드 1-2단어 (예: "직면", "표현", "연결", "해방")
     * action: 동사형 액션 3-5단어 (예: "철학자들에게 배우기", "그림으로 표현하기")
     * date: 해당 프로그램의 "날짜 시간" (예: "10.18 18:00")
   - 시각적으로 표현할 수 있도록 간결하게!

3. 종합 메시지 (100-150자 - 짧고 강렬하게!)
   ❌ 절대 금지: 긴 문장, 장황한 설명, "힘든 시기를 보내고 계시는군요"
   ✅ 반드시 포함: 
   - 사용자의 핵심 키워드 1-2개만 인용
   - 한 방에 꽂히는 날카로운 통찰 1줄
   - 드라마틱한 비유 1개
   - 행동 유도 1줄
   
   예시: "당신이 선택한 '~'가 모든 걸 말해줘요. 당신은 [비유]. [한 줄 통찰]. 이 여정에서 답을 찾을 거예요."
   
   톤: 타로카드 마스터가 카드 한 장 뒤집고 핵심만 말하는 느낌
   분량: 100-150자, 읽는 순간 "소름" 돋아야 함

⚠️ 중요: 프로그램 ID는 절대 변경하지 마세요! 위에 제시된 프로그램 순서대로 "${recommendedProgramIds[0]}", "${recommendedProgramIds[1]}", "${recommendedProgramIds[2]}"를 사용하세요.

응답은 반드시 다음 JSON 형식으로만 작성하세요 (마크다운이나 코드블록 없이 순수 JSON만):
{
  "programReasons": {
    "${recommendedProgramIds[0]}": "첫 번째 프로그램 추천 이유 (150-250자, 주접 가득)",
    "${recommendedProgramIds[1]}": "두 번째 프로그램 추천 이유 (150-250자, 주접 가득)",
    "${recommendedProgramIds[2]}": "세 번째 프로그램 추천 이유 (150-250자, 주접 가득)"
  },
  "journey": [
    {"icon": "🎯", "keyword": "키워드1", "action": "액션1", "date": "날짜 시간"},
    {"icon": "✨", "keyword": "키워드2", "action": "액션2", "date": "날짜 시간"},
    {"icon": "🌟", "keyword": "키워드3", "action": "액션3", "date": "날짜 시간"}
  ],
  "message": "종합 메시지 (100-150자)"
}`;

    // Gemini API 호출 (2.0 Flash - 빠르고 효율적)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.9, // 창의성 UP - 더 개인화되고 독특한 응답
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // 설명만 생성하므로 토큰 감소
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱 (코드블록 제거)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const aiResponse = JSON.parse(cleanedText);

    console.log('✨ AI 설명 생성 완료:', {
      programReasons: Object.keys(aiResponse.programReasons || {}),
      journeySteps: aiResponse.journey?.length || 0,
      messageLength: aiResponse.message?.length || 0,
    });

    // ============================================
    // 3단계: 최종 결과 조합 (규칙 + AI)
    // ============================================

    const recommendationResult: RecommendationResult = {
      clarityType, // 맑음 유형 (16가지)
      recommendedPrograms, // 규칙 기반
      programReasons: aiResponse.programReasons || {}, // AI 생성
      userEmotionProfile, // 규칙 기반
      clarity, // 규칙 기반
      message: aiResponse.message || '당신만의 특별한 여정이 기다리고 있어요.', // AI 생성
      journey: aiResponse.journey || [], // AI 생성
    };

    return NextResponse.json(recommendationResult);
  } catch (error) {
    console.error('분석 오류:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다. API 키를 확인해주세요.' },
      { status: 500 }
    );
  }
}
