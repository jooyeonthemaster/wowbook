import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { WeatherProfileType } from '@/types';
import { getWeatherProfile, weatherProfiles } from '@/lib/weatherProfiles';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { profileType } = await request.json();

    if (!profileType) {
      return NextResponse.json(
        { success: false, error: '프로필 타입이 필요합니다.' },
        { status: 400 }
      );
    }

    // 프로필 정보 가져오기
    const profile = getWeatherProfile(profileType as WeatherProfileType);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 프로필 타입입니다.' },
        { status: 400 }
      );
    }

    // 유형별 프롬프트 생성 (참조 이미지 없이)
    const prompt = generateProfilePrompt(profile);

    // Gemini API 호출
    const model = 'gemini-2.5-flash-image-preview';
    const contents = [{ text: prompt }];

    console.log(`🎨 이미지 생성 시작: ${profile.name} (${profileType})`);

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
          console.log(`✅ 이미지 생성 성공: ${profile.name}`);

          return NextResponse.json({
            success: true,
            profileType,
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
    console.error('Profile image generation error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 유형별 프롬프트 생성 함수
function generateProfilePrompt(profile: { type: WeatherProfileType; name: string; description: string; characteristics: string[]; emoji: string; color: string }): string {
  const characterDetails = getCharacterDetails(profile.type);

  const basePrompt = `
Create a CUTE, BLOCKY character in a consistent geometric low-poly style.

ABSOLUTE STYLE REQUIREMENTS (STRICTLY ENFORCE):
- BLOCKY geometric shapes with clean edges (like Minecraft but cuter)
- FLAT COLORS only - no gradients, no shading, no realistic lighting
- Simple 2-3 color outfit maximum
- SMALL simple shapes for weather elements (do not overpower character)
- Thick outlined style OR flat geometric style
- Gender-neutral, adorable chibi design
- Simple dot eyes and small smile
- Big blocky head, small chunky body
- Standing straight, centered, full body visible

REFERENCE STYLE:
- Crossy Road characters
- Monument Valley characters
- Simple mobile game mascots
- Blocky voxel art style

CHARACTER: ${profile.name}
${characterDetails.appearance}

CRITICAL RULES:
1. Character must be 70% of image, weather elements 30%
2. Weather elements are SMALL icons around character (not in background)
3. Background is SOLID COLOR or simple 2-color gradient
4. NO realistic weather effects
5. NO complex scenes or landscapes
6. Keep it SIMPLE and CUTE
7. Use GEOMETRIC SHAPES for everything

WEATHER ELEMENTS (MUST BE SMALL):
${getStyleGuidelines(profile.type)}

COLOR PALETTE: ${profile.color} + 2-3 complementary flat colors

FORMAT: 1024x1024px, square, centered character, solid/simple background

REMEMBER: Simple, blocky, cute, consistent style. Weather elements are tiny geometric icons, NOT realistic effects!
`;

  return basePrompt;
}

// 유형별 캐릭터 외모 상세 정의 (귀여운 블록 스타일)
function getCharacterDetails(type: WeatherProfileType): { appearance: string } {
  const characterAppearance: Record<WeatherProfileType, string> = {
    // 그룹 1: IB - 조용한 내면의 맑음
    'IBSC': `- Body: Blocky, geometric shape with chunky proportions
- Head: Large cubic/rounded head with simple face
- Hair: Simple blocky shape in icy white/silver color
- Face: Two dot eyes, small smile, peaceful expression
- Outfit: Simple geometric robe/cloak in white and light blue tones
- Accessories: Tiny geometric snowflake icon or frost pattern
- Colors: White, ice blue, silver (${weatherProfiles.find(p => p.type === 'IBSC')?.color})`,

    'IBSW': `- Body: Soft, rounded blocky shape, friendly proportions
- Head: Round, cute head with gentle features
- Hair: Blocky wavy shape in warm brown tones
- Face: Gentle dot eyes, warm smile
- Outfit: Simple geometric sweater/cardigan in cream and pastel tones
- Accessories: Tiny cherry blossom petal shapes
- Colors: Cream, soft pink, warm brown`,

    'IBLC': `- Body: Elegant blocky silhouette with flowing cape shape
- Head: Rounded cube with serene expression
- Hair: Geometric flowing shape in dark brown with amber accents
- Face: Calm eyes, thoughtful expression
- Outfit: Geometric robe in burgundy and orange autumn tones
- Accessories: Tiny moon shape and geometric autumn leaves
- Colors: Burgundy, amber, deep orange`,

    'IBLW': `- Body: Soft, misty blocky form with ethereal feel
- Head: Round with dreamy expression
- Hair: Wispy geometric shapes in lavender-gray
- Face: Mysterious small eyes, subtle smile
- Outfit: Simple hooded geometric cloak in gray tones
- Accessories: Tiny fog/mist geometric shapes
- Colors: Lavender, gray, misty white`,

    // 그룹 2: IG - 강렬한 내면의 맑음
    'IGSC': `- Body: Sharp, angular blocky shape with strong stance
- Head: Geometric cube with focused expression
- Hair: Sharp, spiky blocky hair in white-blonde
- Face: Determined dot eyes, confident look
- Outfit: Angular geometric outfit in crisp white tones
- Accessories: Ice crystal geometric shapes
- Colors: Brilliant white, ice blue, silver`,

    'IGSW': `- Body: Dynamic, energetic blocky form
- Head: Round with bright, active expression
- Hair: Short, spiky geometric bob in cyan blue
- Face: Bright eyes, energetic smile
- Outfit: Sporty geometric outfit in vibrant blue
- Accessories: Water droplet shapes
- Colors: Cyan, turquoise, bright blue`,

    'IGLC': `- Body: Mysterious blocky form with cosmic feel
- Head: Round with imaginative expression
- Hair: Flowing geometric shapes in deep navy-black
- Face: Visionary eyes, inspired look
- Outfit: Hoodie-shaped geometric form in deep blue
- Accessories: Tiny star and galaxy shapes
- Colors: Navy, midnight blue, star white`,

    'IGLW': `- Body: Flowing, artistic blocky silhouette
- Head: Round with creative, free expression
- Hair: Flowing geometric petals in pink-white
- Face: Artistic eyes, joyful smile
- Outfit: Flowing geometric dress/robe in blossom pink
- Accessories: Flower petals as geometric shapes
- Colors: Pink, white, cherry blossom tones`,

    // 그룹 3: OB - 조용한 연결의 맑음
    'OBSC': `- Body: Gentle, rounded blocky form
- Head: Soft round head with caring expression
- Hair: Geometric wavy shape in soft green-brown
- Face: Kind dot eyes, empathetic smile
- Outfit: Cozy geometric cardigan in mint green
- Accessories: Tiny dewdrop and leaf shapes
- Colors: Mint green, soft brown, nature tones`,

    'OBSW': `- Body: Comfortable, rounded blocky shape
- Head: Friendly round face
- Hair: Simple geometric shape in warm brown
- Face: Soothing eyes, comforting smile
- Outfit: Chunky geometric sweater in earth tones
- Accessories: Rain drop geometric shapes
- Colors: Earth brown, soft green, warm tones`,

    'OBLC': `- Body: Warm, radiant blocky silhouette
- Head: Round with trusting expression
- Hair: Flowing geometric shape in golden-amber
- Face: Warm eyes, connected smile
- Outfit: Elegant geometric dress in honey tones
- Accessories: Moon and star geometric shapes
- Colors: Golden amber, honey yellow, warm glow`,

    'OBLW': `- Body: Relaxed, comfortable blocky form
- Head: Friendly round with natural smile
- Hair: Soft geometric waves in golden-blonde
- Face: Relaxed eyes, easy smile
- Outfit: Casual geometric cardigan in light yellow
- Accessories: Shimmer effect geometric shapes
- Colors: Pale yellow, warm beige, spring gold`,

    // 그룹 4: OG - 강렬한 연결의 맑음
    'OGSC': `- Body: Powerful, dramatic blocky shape with cape
- Head: Strong geometric form with charismatic look
- Hair: Bold geometric spikes in dark purple
- Face: Powerful eyes, commanding expression
- Outfit: Dramatic geometric jacket/cape in purple
- Accessories: Lightning bolt geometric shapes
- Colors: Dark purple, electric white, storm gray`,

    'OGSW': `- Body: Vibrant, joyful blocky form with energetic feel
- Head: Bright, cheerful round face
- Hair: Spiky geometric shape in bright green/blue
- Face: Joyful eyes, big smile
- Outfit: Fresh green outfit with blue water drop accents
- Accessories: Small water droplet shapes (after-rain feel)
- Colors: Bright green, fresh blue, clean white`,

    'OGLC': `- Body: Dynamic, flowing blocky silhouette
- Head: Thoughtful round shape
- Hair: Flowing geometric form in auburn-orange
- Face: Intellectual eyes, engaging expression
- Outfit: Professional geometric sweater in coral tones
- Accessories: Cloud geometric shapes
- Colors: Coral, sunset orange, warm pink`,

    'OGLW': `- Body: Radiant, hopeful blocky form with bright feel
- Head: Bright, inspiring round face
- Hair: Spiky geometric shape in golden yellow
- Face: Hopeful eyes, radiant smile
- Outfit: Bright golden yellow outfit with sun motifs
- Accessories: 1 small sun icon, tiny sparkle shapes
- Colors: Golden yellow, bright gold, sunny orange`,
  };

  return { appearance: characterAppearance[type] || 'Unique cute blocky character' };
}

// 유형별 스타일 가이드라인 (블록 스타일)
function getStyleGuidelines(type: WeatherProfileType): string {
  const guidelines: Record<WeatherProfileType, string> = {
    // 그룹 1: 혼자 × 고요 (IB) - 조용한 내면의 맑음
    'IBSC': `- Simple geometric snowflakes floating around
- Tiny frost crystal icons
- Icy blue geometric background shapes
- Peaceful, calm atmosphere with cool tones
- Minimal geometric winter elements`,

    'IBSW': `- Geometric cherry blossom petal shapes
- Warm spring color blocks
- Simple sun icon
- Gentle, peaceful mood`,

    'IBLC': `- 1 FULL MOON circle (perfect round shape, not crescent)
- 2-3 tiny star icons
- Small autumn leaf geometric shapes
- Warm amber/orange outfit`,

    'IBLW': `- Simple fog/mist geometric shapes
- Soft lavender-gray color blocks
- Dreamy, mysterious mood
- Minimal misty elements`,

    // 그룹 2: 혼자 × 역동 (IG) - 강렬한 내면의 맑음
    'IGSC': `- Sharp ice crystal geometric shapes
- Bright white and blue blocks
- Strong, focused atmosphere
- Angular winter elements`,

    'IGSW': `- Water droplet geometric shapes
- Bright cyan color blocks
- Energetic, dynamic mood
- Fresh summer rain elements`,

    'IGLC': `- Star and galaxy geometric icons
- Deep blue cosmic blocks
- Visionary, inspired atmosphere
- Simple celestial shapes`,

    'IGLW': `- Flower petal geometric shapes
- Pink and white color blocks
- Creative, artistic mood
- Flowing spring elements`,

    // 그룹 3: 함께 × 고요 (OB) - 조용한 연결의 맑음
    'OBSC': `- Dewdrop and leaf geometric shapes
- Soft green color blocks
- Gentle, caring atmosphere
- Nature-inspired elements`,

    'OBSW': `- Rain drop geometric shapes
- Earth tone color blocks
- Soothing, comforting mood
- Gentle rain elements`,

    'OBLC': `- 1 FULL MOON circle (perfect round, not crescent)
- 1-2 tiny star icons
- Golden amber/honey outfit
- NO moon phases, only full round moon`,

    'OBLW': `- Heat shimmer geometric effects
- Pale yellow color blocks
- Relaxed, friendly mood
- Spring warmth elements`,

    // 그룹 4: 함께 × 역동 (OG) - 강렬한 연결의 맑음
    'OGSC': `- 2-3 TINY lightning bolt icons (simple zigzag lines)
- Purple outfit with small white accents
- NO dramatic effects, keep simple
- Small storm icon accessories only`,

    'OGSW': `- 3-4 TINY water droplet icons (after-rain freshness)
- Bright green/blue outfit
- NO rainbow - focus on fresh rain drops
- Small blue water drop shapes only`,

    'OGLC': `- 2-3 TINY cloud geometric shapes (simple rounded rectangles)
- Coral/orange outfit
- NO complex sunset scenes
- Small cloud icons as accessories only`,

    'OGLW': `- 1 SMALL sun icon + 2-3 tiny sparkle icons
- Golden yellow outfit
- NO rainbow - focus on sunny brightness
- Simple geometric sun and star shapes only`,
  };

  return guidelines[type] || '- Creative, artistic interpretation\n- Weather-themed atmosphere\n- Expressive, unique style';
}
