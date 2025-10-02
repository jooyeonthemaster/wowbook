import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { WeatherDiary, ProgramStats, AdminStats, WeatherMood } from '@/types';

export async function GET() {
  try {
    // 모든 기상 일지 조회
    const diariesSnapshot = await getDocs(collection(db, 'weatherDiaries'));
    const allDiaries: WeatherDiary[] = [];

    diariesSnapshot.forEach((doc) => {
      const data = doc.data();
      allDiaries.push({
        id: doc.id,
        userId: data.userId,
        programId: data.programId,
        programTitle: data.programTitle,
        mood: data.mood,
        content: data.content,
        createdAt: data.createdAt.toDate(),
      });
    });

    // 고유 사용자 수
    const uniqueUsers = new Set(allDiaries.map(d => d.userId)).size;

    // 프로그램별 통계 계산
    const programMap = new Map<string, WeatherDiary[]>();

    allDiaries.forEach(diary => {
      if (!programMap.has(diary.programId)) {
        programMap.set(diary.programId, []);
      }
      programMap.get(diary.programId)!.push(diary);
    });

    const programStats: ProgramStats[] = [];

    programMap.forEach((diaries, programId) => {
      const uniqueProgramUsers = new Set(diaries.map(d => d.userId)).size;

      // 날씨 분포 계산
      const moodDistribution = {
        sunny: 0,
        'partly-cloudy': 0,
        cloudy: 0,
        rainy: 0,
        stormy: 0,
        snowy: 0,
      };

      diaries.forEach(diary => {
        moodDistribution[diary.mood]++;
      });

      // 가장 많은 날씨 찾기
      let topMood: WeatherMood = 'sunny';
      let maxCount = 0;

      (Object.keys(moodDistribution) as WeatherMood[]).forEach(mood => {
        if (moodDistribution[mood] > maxCount) {
          maxCount = moodDistribution[mood];
          topMood = mood;
        }
      });

      programStats.push({
        programId,
        programTitle: diaries[0].programTitle,
        totalDiaries: diaries.length,
        uniqueUsers: uniqueProgramUsers,
        moodDistribution,
        topMood,
        diaries: diaries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      });
    });

    // 프로그램별 일지 개수로 정렬
    programStats.sort((a, b) => b.totalDiaries - a.totalDiaries);

    const stats: AdminStats = {
      totalDiaries: allDiaries.length,
      totalUsers: uniqueUsers,
      programStats,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Admin 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
