import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserAnswer, RecommendationResult } from '@/types';
import { questions } from '@/lib/questions';
import { wowbookPrograms } from '@/lib/programs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: UserAnswer[] } = await request.json();

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

    // Gemini 프롬프트 생성
    const prompt = `당신은 사람의 마음을 단 몇 줄로도 꿰뚫어보는 영혼 분석가입니다. 
과할 정도로 공감하고, 소름끼치게 정확하게, 그리고 주접스러울 만큼 열정적으로 분석합니다.
일반적인 조언은 절대 금지! 이 사람만을 위한, 이 순간만을 위한 메시지를 만들어야 합니다.

사용자의 응답:
${userProfile}

21회 서울와우북페스티벌 프로그램 목록:
${JSON.stringify(wowbookPrograms, null, 2)}

🎯 분석 가이드:

1. 감정 프로필 분석 (calm, active, reflective, social 각각 0-100)
   - 사용자의 답변에서 구체적인 근거를 찾아 점수를 매기세요
   - 표면적인 답변 뒤에 숨겨진 진짜 감정을 읽어내세요

2. "맑음" 지수 (0-100)
   - 단순히 긍정/부정이 아니라, 이 사람의 내면이 얼마나 정돈되어 있는지 측정
   - 혼란 속에서도 방향성이 있다면 높은 점수 가능

3. 프로그램 추천 (3개)
   - emotionMatch만 보지 말고, 이 사람이 "진짜" 필요한 게 뭔지 생각하세요
   - 사용자가 선택한 답변과 텍스트 입력에서 구체적인 힌트를 찾으세요
   - 예상을 깨는, 하지만 정확한 추천이 좋은 추천입니다

3-1. 각 프로그램별 추천 이유 (대환장 유쾌파티 모드!)
   - 각 추천 프로그램마다 왜 이게 당신에게 완벽한지 설명하세요
   - 사용자의 구체적인 답변을 인용하며 연결고리를 만드세요
   - 톤: 친구가 "야 이거 진짜 너 거 같은데???" 하면서 극찬하는 느낌
   - 분량: 프로그램당 150-250자, 읽으면 "헐 진짜 나한테 딱인데?" 하고 바로 예매하고 싶게
   ❌ 나쁜 예: "이 프로그램은 당신의 성찰적인 성향에 맞습니다"
   ✅ 좋은 예: "당신이 '나 자신에 대한 의문'을 선택한 순간부터 이미 정해져 있었어요. 니체와 장자? 완전 당신 취향 저격이잖아요. 특히 '기존의 틀에 갇히지 않고'라는 문구 보세요. 당신이 마지막 질문에 쓴 그 문장이랑 소름돋게 연결되는 거 느껴지죠? 10월 18일 저녁 6시, 연습실4에서 당신이 찾던 답을 만날 거예요. 진짜예요."

4. 여정 스텝 (3-4개) - 키워드와 액션 중심!
   ❌ 나쁜 예: 긴 문장으로 설명
   ✅ 좋은 예: 
   {
     "icon": "🎯",
     "keyword": "직면",
     "action": "니체와 장자에게 배우기",
     "date": "10.18 18:00"
   }
   
   각 스텝은 다음 구조:
   - icon: 이모지 1개 (그 단계를 상징)
   - keyword: 핵심 키워드 1-2단어 (예: "직면", "표현", "연결", "해방")
   - action: 동사형 액션 3-5단어 (예: "철학자들에게 배우기", "그림으로 표현하기")
   - date: "날짜 시간" (해당 프로그램 일정)
   
   시각적으로 표현할 수 있도록 간결하게!

5. 종합 메시지 (100-150자 - 짧고 강렬하게!)
   ❌ 절대 금지: 긴 문장, 장황한 설명, "힘든 시기를 보내고 계시는군요"
   ✅ 반드시 포함: 
   - 사용자의 핵심 키워드 1-2개만 인용
   - 한 방에 꽂히는 날카로운 통찰 1줄
   - 드라마틱한 비유 1개
   - 행동 유도 1줄
   
예시: "당신이 선택한 '~'가 모든 걸 말해줘요. 당신은 [비유]. [한 줄 통찰]. [프로그램명]에서 답을 찾을 거예요."

톤: 타로카드 마스터가 카드 한 장 뒤집고 핵심만 말하는 느낌
분량: 100-150자, 읽는 순간 "소름" 돋아야 함

응답은 반드시 다음 JSON 형식으로만 작성하세요 (마크다운이나 코드블록 없이 순수 JSON만):
{
  "userEmotionProfile": {
    "calm": number,
    "active": number,
    "reflective": number,
    "social": number
  },
  "clarity": number,
  "recommendedProgramIds": ["id1", "id2", "id3"],
  "programReasons": {
    "id1": "프로그램1 추천 이유 (150-250자, 주접 가득)",
    "id2": "프로그램2 추천 이유 (150-250자, 주접 가득)",
    "id3": "프로그램3 추천 이유 (150-250자, 주접 가득)"
  },
  "journey": [
    {"icon": "🎯", "keyword": "키워드1", "action": "액션1", "date": "10.18 18:00"},
    {"icon": "✨", "keyword": "키워드2", "action": "액션2", "date": "10.18 14:00"},
    {"icon": "🌟", "keyword": "키워드3", "action": "액션3", "date": "10.17 18:30"}
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
        maxOutputTokens: 3072, // 토큰 수 증가 - 더 긴 메시지
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

    const parsedResponse = JSON.parse(cleanedText);

    // 추천 프로그램 가져오기
    const recommendedPrograms = parsedResponse.recommendedProgramIds
      .map((id: string) => wowbookPrograms.find((p) => p.id === id))
      .filter(Boolean);

    const recommendationResult: RecommendationResult = {
      recommendedPrograms,
      programReasons: parsedResponse.programReasons || {},
      userEmotionProfile: parsedResponse.userEmotionProfile,
      clarity: parsedResponse.clarity,
      message: parsedResponse.message,
      journey: parsedResponse.journey,
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
