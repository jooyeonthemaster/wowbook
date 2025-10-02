import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { WeatherDiary } from '@/types';

// POST: 기상 일지 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, programId, programTitle, mood, content } = body;

    // 유효성 검사
    if (!userId || !programId || !programTitle || !mood || !content) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore에 저장
    const diaryData = {
      userId,
      programId,
      programTitle,
      mood,
      content,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'weatherDiaries'), diaryData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: '기상 일지가 저장되었습니다',
    });
  } catch (error) {
    console.error('기상 일지 저장 오류:', error);
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// GET: 기상 일지 조회 (userId 파라미터로)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다' },
        { status: 400 }
      );
    }

    // Firestore에서 사용자의 기상 일지 조회
    const q = query(
      collection(db, 'weatherDiaries'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const diaries: WeatherDiary[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      diaries.push({
        id: doc.id,
        userId: data.userId,
        programId: data.programId,
        programTitle: data.programTitle,
        mood: data.mood,
        content: data.content,
        createdAt: data.createdAt.toDate(),
      });
    });

    // 클라이언트에서 정렬 (인덱스 문제 회피)
    diaries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      success: true,
      diaries,
    });
  } catch (error) {
    console.error('기상 일지 조회 오류:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
