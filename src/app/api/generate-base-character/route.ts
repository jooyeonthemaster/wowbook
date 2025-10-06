import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { characterPrompt } = await request.json();

    if (!characterPrompt) {
      return NextResponse.json(
        { success: false, error: '캐릭터 설명이 필요합니다.' },
        { status: 400 }
      );
    }

    // 기본 캐릭터 생성 프롬프트
    const fullPrompt = generateBaseCharacterPrompt(characterPrompt);

    console.log('🎨 기본 캐릭터 이미지 생성 시작...');

    // Gemini API 호출
    const model = 'gemini-2.5-flash-image-preview';
    const contents = [{ text: fullPrompt }];

    const response = await genAI.models.generateContent({
      model: model,
      contents: contents,
    });

    // 생성된 이미지 추출
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log('AI 텍스트 응답:', part.text);
        }
        if (part.inlineData) {
          const generatedImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          console.log('✅ 기본 캐릭터 이미지 생성 성공');

          return NextResponse.json({
            success: true,
            generatedImage,
          });
        }
      }
    }

    console.error('❌ 이미지 생성 실패: 응답에 이미지 데이터가 없음');
    return NextResponse.json(
      { success: false, error: '이미지 생성에 실패했습니다.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Base character generation error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 기본 캐릭터 생성 프롬프트
function generateBaseCharacterPrompt(userPrompt: string): string {
  return `
You are an expert character illustrator. Create a beautiful, clean profile portrait based on the following description.

USER'S CHARACTER DESCRIPTION:
${userPrompt}

IMPORTANT REQUIREMENTS:
- Generate a high-quality profile portrait/headshot image
- The character should be facing forward or at a slight angle
- Clean, professional portrait style
- Square format (1:1 ratio), 1024x1024 pixels
- Well-lit, clear facial features
- Neutral or simple background
- The character should be the main focus
- Modern, clean aesthetic
- High detail on face and upper body
- Suitable as a base reference for creating variations

STYLE GUIDELINES:
- Professional portrait photography style
- Clean and modern
- Good lighting that shows facial features clearly
- Minimal background distractions
- Focus on capturing the character's essence
- High quality, detailed rendering
- Natural colors and tones
- Suitable for profile picture variations

Create a stunning base character portrait that will serve as a reference for generating 16 weather-themed variations.
`;
}
