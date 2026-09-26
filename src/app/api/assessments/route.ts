import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Difficulty } from '@prisma/client';
import { getCached, setCached, invalidateCache } from '@/lib/server-cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const traineeId = searchParams.get('traineeId');

    const cacheKey = `assessments_${courseId || ''}_${traineeId || ''}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { success: true, assessments: cached },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
      );
    }

    const whereClause: Record<string, unknown> = {};
    if (courseId) whereClause.courseId = courseId;

    const assessments = await prisma.assessment.findMany({
      where: whereClause,
      include: {
        course: true,
        trainer: { select: { id: true, name: true, avatarUrl: true } },
        questions: true,
        attempts: traineeId
          ? {
              where: { traineeId },
              include: { trainee: { select: { id: true, name: true, email: true, avatarUrl: true } } },
            }
          : {
              include: { trainee: { select: { id: true, name: true, email: true, avatarUrl: true } } },
            },
      },
      orderBy: { createdAt: 'desc' },
    });

    setCached(cacheKey, assessments, 30000);

    return NextResponse.json(
      { success: true, assessments },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Fetch assessments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { courseId, trainerId, title, subject, description, durationMinutes, totalMarks, passingMarks, deadline, difficulty, questions } = data;

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Title and at least 1 question are required' }, { status: 400 });
    }

    let resolvedCourseId = courseId;
    if (!resolvedCourseId) {
      const matchCourse = await prisma.course.findFirst({
        where: subject ? { subject: { contains: subject.slice(0, 5), mode: 'insensitive' } } : undefined,
      });
      resolvedCourseId = matchCourse?.id || (await prisma.course.findFirst())?.id;
    }

    let resolvedTrainerId = trainerId;
    if (!resolvedTrainerId) {
      const course = await prisma.course.findUnique({ where: { id: resolvedCourseId } });
      resolvedTrainerId = course?.trainerId || (await prisma.user.findFirst({ where: { role: 'TRAINER' } }))?.id;
    }

    const assessment = await prisma.assessment.create({
      data: {
        courseId: resolvedCourseId,
        trainerId: resolvedTrainerId,
        title,
        subject: subject || 'General Assessment',
        description: description || 'Capacity building multiple choice assessment.',
        durationMinutes: Number(durationMinutes) || 20,
        totalMarks: Number(totalMarks) || questions.length * 10,
        passingMarks: Number(passingMarks) || Math.round((questions.length * 10) * 0.6),
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 3600 * 1000),
        difficulty: (difficulty as Difficulty) || Difficulty.INTERMEDIATE,
        status: 'PUBLISHED',
        questions: {
          create: questions.map((q: any) => {
            const optA = q.optionA || q.options?.[0] || 'Option A';
            const optB = q.optionB || q.options?.[1] || 'Option B';
            const optC = q.optionC || q.options?.[2] || 'Option C';
            const optD = q.optionD || q.options?.[3] || 'Option D';
            
            let corOpt = 'A';
            if (['A', 'B', 'C', 'D'].includes(q.correctOption)) {
              corOpt = q.correctOption;
            } else if (q.correctAnswer) {
              if (q.correctAnswer === optA) corOpt = 'A';
              else if (q.correctAnswer === optB) corOpt = 'B';
              else if (q.correctAnswer === optC) corOpt = 'C';
              else if (q.correctAnswer === optD) corOpt = 'D';
            }

            return {
              questionText: q.questionText || 'Question',
              optionA: String(optA),
              optionB: String(optB),
              optionC: String(optC),
              optionD: String(optD),
              correctOption: corOpt,
              marks: Number(q.marks) || 10,
              explanation: q.explanation || '',
              difficulty: (q.difficulty as Difficulty) || Difficulty.INTERMEDIATE,
            };
          }),
        },
      },
      include: { questions: true, course: true, trainer: true },
    });

    // Notify all trainees about this newly published assessment in one batch
    try {
      const allTrainees = await prisma.user.findMany({ where: { role: 'TRAINEE' }, select: { id: true } });
      if (allTrainees.length > 0) {
        await prisma.notification.createMany({
          data: allTrainees.map((t) => ({
            userId: t.id,
            title: 'New Assessment Published',
            message: `New benchmark assessment available: "${title}". Attempt it now to update your verified competency score.`,
            type: 'ALERT',
            link: `/trainee/assessments/${assessment.id}`,
          })),
        });
      }
    } catch (notifErr) {
      console.warn('Failed to dispatch notifications:', notifErr);
    }

    invalidateCache('assessments_');

    return NextResponse.json({ success: true, assessment });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Assessment id is required' }, { status: 400 });
    }

    await prisma.assessmentAnswer.deleteMany({ where: { attempt: { assessmentId: id } } });
    await prisma.assessmentAttempt.deleteMany({ where: { assessmentId: id } });
    await prisma.question.deleteMany({ where: { assessmentId: id } });
    await prisma.assessment.delete({ where: { id } });

    invalidateCache('assessments_');

    return NextResponse.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json({ error: 'Failed to delete assessment' }, { status: 500 });
  }
}
