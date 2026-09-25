import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeCompetencyGaps } from '@/lib/ai-engine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let traineeId = searchParams.get('traineeId');

    if (!traineeId) {
      // Default to first trainee for instant demo view if not specified
      const defaultTrainee = await prisma.user.findFirst({
        where: { role: 'TRAINEE' },
      });
      traineeId = defaultTrainee?.id || '';
    }

    if (!traineeId) {
      return NextResponse.json({ error: 'Trainee not found' }, { status: 404 });
    }

    const analysis = await analyzeCompetencyGaps(traineeId);
    const gaps = await prisma.competencyGap.findMany({
      where: { traineeId },
      include: { competency: true },
    });

    const competencies = await prisma.traineeCompetency.findMany({
      where: { traineeId },
      include: { competency: true },
      orderBy: { competency: { name: 'asc' } },
    });

    return NextResponse.json({
      success: true,
      analysis,
      gaps,
      competencies,
    });
  } catch (error) {
    console.error('Competency analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze competencies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { traineeId, competencyId, currentLevel, assessmentScore } = await req.json();

    if (!traineeId || !competencyId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updated = await prisma.traineeCompetency.upsert({
      where: {
        traineeId_competencyId: {
          traineeId,
          competencyId,
        },
      },
      create: {
        traineeId,
        competencyId,
        currentLevel: currentLevel || 1,
        targetLevel: 4,
        assessmentScore: assessmentScore || 50,
        gap: Math.max(0, 4 - (currentLevel || 1)),
        verified: true,
      },
      update: {
        currentLevel: currentLevel !== undefined ? currentLevel : undefined,
        assessmentScore: assessmentScore !== undefined ? assessmentScore : undefined,
        gap: currentLevel !== undefined ? Math.max(0, 4 - currentLevel) : undefined,
        verified: true,
        lastEvaluatedAt: new Date(),
      },
      include: { competency: true },
    });

    // Re-run gap analysis
    const analysis = await analyzeCompetencyGaps(traineeId);

    return NextResponse.json({
      success: true,
      updated,
      analysis,
    });
  } catch (error) {
    console.error('Competency update error:', error);
    return NextResponse.json({ error: 'Failed to update competency' }, { status: 500 });
  }
}
