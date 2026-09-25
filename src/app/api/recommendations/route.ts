import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRecommendations } from '@/lib/ai-engine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let traineeId = searchParams.get('traineeId');

    if (!traineeId) {
      const defaultTrainee =
        (await prisma.user.findUnique({ where: { email: 'sujal@example.com' } })) ||
        (await prisma.user.findFirst({ where: { role: 'TRAINEE' } }));
      traineeId = defaultTrainee?.id || '';
    }

    if (!traineeId) {
      return NextResponse.json({ error: 'Trainee not found' }, { status: 404 });
    }

    const recommendations = await generateRecommendations(traineeId);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
