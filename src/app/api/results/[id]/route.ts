import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// GET: 특정 결과 ID로 조회 (공유된 링크 접근용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: '결과 ID가 필요합니다' },
        { status: 400 }
      );
    }

    // Firestore에서 해당 ID의 결과 조회
    const docRef = doc(db, 'analysisResults', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: '결과를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    return NextResponse.json({
      success: true,
      result: {
        id: docSnap.id,
        userId: data.userId,
        result: data.result,
        answers: data.answers,
        createdAt: data.createdAt.toDate(),
      },
    });
  } catch (error) {
    console.error('결과 조회 오류:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

