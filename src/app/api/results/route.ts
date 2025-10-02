import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { AnalysisResult } from '@/types';

// POST: 결과 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, result, answers } = body;

    // 유효성 검사
    if (!userId || !result) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore에 저장
    const resultData = {
      userId,
      result,
      answers: answers || [],
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'analysisResults'), resultData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: '결과가 저장되었습니다',
    });
  } catch (error) {
    console.error('결과 저장 오류:', error);
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// GET: 결과 조회 (userId 파라미터로)
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

    // Firestore에서 사용자의 결과 조회
    const q = query(
      collection(db, 'analysisResults'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const results: AnalysisResult[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        userId: data.userId,
        result: data.result,
        answers: data.answers,
        createdAt: data.createdAt.toDate(),
      });
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('결과 조회 오류:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

