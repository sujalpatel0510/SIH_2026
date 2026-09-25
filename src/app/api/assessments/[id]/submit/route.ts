import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeCompetencyGaps } from '@/lib/ai-engine';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const assessmentId = params.id;
    const { traineeId, answers } = await req.json();

    if (!traineeId || !answers) {
      return NextResponse.json({ error: 'Missing traineeId or answers' }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
        course: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    let totalScore = 0;
    let maxScore = 0;
    const answerRecords: any[] = [];

    for (const q of assessment.questions) {
      maxScore += q.marks;
      const selected = answers[q.id];
      const isCorrect = selected === q.correctOption;
      const marksAwarded = isCorrect ? q.marks : 0;
      totalScore += marksAwarded;

      answerRecords.push({
        questionId: q.id,
        selectedOption: selected || 'NONE',
        isCorrect,
        marksAwarded,
      });
    }

    const percentage = maxScore > 0 ? Number(((totalScore / maxScore) * 100).toFixed(1)) : 0;
    const passed = totalScore >= assessment.passingMarks;

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        traineeId,
        score: totalScore,
        maxScore,
        percentage,
        passed,
        feedback: passed
          ? `Outstanding performance! You passed with ${percentage}%. Your competency benchmark has been upgraded.`
          : `You scored ${percentage}%. Review the recommended modules and attempt again to reach certification standard.`,
        answers: {
          create: answerRecords,
        },
      },
      include: {
        answers: { include: { question: true } },
      },
    });

    // If passed, update course enrollment progress to 100% and generate certificate
    if (passed) {
      await prisma.courseEnrollment.upsert({
        where: {
          courseId_traineeId: {
            courseId: assessment.courseId,
            traineeId,
          },
        },
        create: {
          courseId: assessment.courseId,
          traineeId,
          progress: 100,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        update: {
          progress: 100,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Generate Certificate
      const certCount = await prisma.certificate.count();
      const certNum = `CP-CERT-2026-${(certCount + 1001).toString().padStart(5, '0')}`;
      await prisma.certificate.upsert({
        where: { certificateNumber: certNum },
        create: {
          traineeId,
          courseId: assessment.courseId,
          certificateNumber: certNum,
          title: `${assessment.course.title} — Verified Certification`,
          verificationCode: `VERIFY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        },
        update: {},
      });
    }

    // Update matching competency score & recalculate gaps
    const matchingCompetency = await prisma.competency.findFirst({
      where: {
        name: { contains: assessment.subject.slice(0, 5), mode: 'insensitive' },
      },
    });

    if (matchingCompetency) {
      const newLevel = percentage >= 80 ? 4 : percentage >= 60 ? 3 : 2;
      await prisma.traineeCompetency.upsert({
        where: {
          traineeId_competencyId: {
            traineeId,
            competencyId: matchingCompetency.id,
          },
        },
        create: {
          traineeId,
          competencyId: matchingCompetency.id,
          currentLevel: newLevel,
          targetLevel: 4,
          assessmentScore: percentage,
          gap: Math.max(0, 4 - newLevel),
          verified: true,
        },
        update: {
          assessmentScore: percentage,
          currentLevel: newLevel,
          gap: Math.max(0, 4 - newLevel),
          verified: true,
        },
      });

      // Re-run gap analysis
      await analyzeCompetencyGaps(traineeId);
    }

    return NextResponse.json({
      success: true,
      attempt,
      passed,
      percentage,
      totalScore,
      maxScore,
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json({ error: 'Failed to process assessment submission' }, { status: 500 });
  }
}
