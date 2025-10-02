# 맑음 - 21회 서울와우북페스티벌 추천 서비스

당신의 마음 상태를 분석하고, 와우북페스티벌에서 당신에게 딱 맞는 프로그램을 AI가 추천해드립니다.

## 🌤️ 프로젝트 개요

- **컨셉**: "맑음" - 흐린 마음을 맑게 하는 여정
- **기술 스택**: Next.js 15, TypeScript, Tailwind CSS v4, Firebase, OpenAI API
- **디자인**: 글래스모피즘 (Glassmorphism) UI
- **목표**: 사용자의 감정 상태를 파악하고 21회 서울와우북페스티벌의 적합한 프로그램 추천

## 🎨 주요 기능

1. **감정 진단 질문** (6단계)
   - 현재 감정 상태 파악
   - 혼란의 원인 분석
   - 치유 방식 선호도
   - 필요한 것 확인
   - 관심사 파악
   - 미래 비전 작성

2. **AI 기반 분석**
   - Google Gemini 1.5 Pro 활용
   - 감정 프로필 생성 (평온함, 활동성, 성찰, 교류)
   - "맑음" 정도 측정
   - 개인 맞춤 메시지 생성

3. **프로그램 추천**
   - 와우북페스티벌 프로그램 매칭
   - 상위 3개 프로그램 추천
   - 맑아지는 여정 가이드

4. **시각적 결과 표현**
   - 날씨 아이콘으로 감정 상태 시각화
   - 글래스모피즘 UI로 세련된 표현
   - 애니메이션 효과

## 🚀 시작하기

### 1. 환경 변수 설정

\`env.txt\` 파일의 내용을 \`.env.local\` 파일로 복사하고 실제 값을 입력하세요:

\`\`\`bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key

# 참고: Google AI Studio에서 API 키 발급
# https://aistudio.google.com/app/apikey
\`\`\`

### 2. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 프로젝트 구조

\`\`\`
src/
├── app/
│   ├── api/
│   │   └── analyze/          # AI 분석 API
│   ├── questions/            # 질문 페이지
│   ├── result/               # 결과 페이지
│   ├── page.tsx              # 랜딩 페이지
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 글로벌 스타일
├── components/
│   ├── GlassCard.tsx         # 글래스 카드 컴포넌트
│   ├── Button.tsx            # 버튼 컴포넌트
│   ├── ProgressBar.tsx       # 진행바 컴포넌트
│   └── WeatherIcon.tsx       # 날씨 아이콘 컴포넌트
├── lib/
│   ├── firebase.ts           # Firebase 설정
│   ├── questions.ts          # 질문 데이터
│   └── programs.ts           # 프로그램 데이터
└── types/
    └── index.ts              # TypeScript 타입 정의
\`\`\`

## 🎨 디자인 컨셉

### 색상 팔레트
- **하늘 색상**: #e0f2fe (밝음), #7dd3fc (중간), #0ea5e9 (깊음)
- **구름/은색**: #ffffff (흰색), #f8fafc (회색), #cbd5e1 (은색)

### 글래스모피즘 효과
- 투명도: 70%
- Backdrop blur: 20px
- 부드러운 테두리와 그림자

### 모바일 레이아웃
- 고정 너비: 380px
- 화이트 배경
- 은색 미학

## 🔑 핵심 기술

- **Next.js 15**: App Router, Server Components
- **TypeScript**: 타입 안정성
- **Tailwind CSS v3**: 유틸리티 CSS
- **Framer Motion**: 부드러운 애니메이션
- **Firebase**: 데이터 저장 (추후 활용 가능)
- **Google Gemini 1.5 Pro**: AI 분석 및 추천

## 📝 라이선스

와작 홈즈, scentdestination  
대표: 유선화

---

**맑음**과 함께 당신의 마음을 맑게 하세요 ☀️
