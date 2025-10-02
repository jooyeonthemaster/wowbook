import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { contents, programTitle } = await request.json();

    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { error: '분석할 내용이 없습니다' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
다음은 "${programTitle}" 프로그램에 대한 참가자들의 피드백입니다:

${contents.map((c, i) => `${i + 1}. ${c}`).join('\n')}

이 피드백들을 분석하여:
1. 가장 자주 언급된 키워드 10개를 추출하고, 각 키워드의 언급 빈도를 계산해주세요.
2. 전체 피드백의 핵심 요약을 2-3문장으로 작성해주세요.

응답은 반드시 다음 JSON 형식으로만 작성해주세요:
{
  "keywords": [
    {"word": "키워드1", "count": 빈도수},
    {"word": "키워드2", "count": 빈도수}
  ],
  "summary": "요약 내용"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 추출
    let jsonData;
    try {
      // JSON 블록 찾기
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없습니다');
      }
    } catch (parseError) {
      console.error('JSON 파싱 실패:', text);
      // 기본값 반환
      jsonData = {
        keywords: [{ word: '분석 실패', count: 0 }],
        summary: '키워드 분석에 실패했습니다.',
      };
    }

    return NextResponse.json({
      success: true,
      analysis: jsonData,
    });
  } catch (error) {
    console.error('키워드 분석 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `키워드 분석 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
