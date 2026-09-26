import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CourseStatus, Difficulty } from '@prisma/client';
import { getCached, setCached, invalidateCache } from '@/lib/server-cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const traineeId = searchParams.get('traineeId');

    const cacheKey = `courses_${category || 'ALL'}_${search || ''}_${traineeId || ''}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { success: true, courses: cached },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
      );
    }

    const whereClause: Record<string, unknown> = {
      status: CourseStatus.PUBLISHED,
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        trainer: {
          include: { trainerProfile: true },
        },
        resources: true,
        assessments: true,
        enrollments: traineeId ? { where: { traineeId } } : true,
      },
      orderBy: { createdAt: 'desc' },
    });

    setCached(cacheKey, courses, 30000);

    return NextResponse.json(
      {
        success: true,
        courses,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { trainerId, title, description, subject, category, difficulty, durationHours, thumbnailUrl, targetSkills } = data;

    if (!trainerId || !title || !description || !subject) {
      return NextResponse.json({ error: 'Missing required course fields' }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        trainerId,
        title,
        description,
        subject,
        category: category || 'General Capacity Building',
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        durationHours: Number(durationHours) || 10,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        targetSkills: targetSkills || subject,
        status: CourseStatus.PUBLISHED,
      },
      include: {
        trainer: { include: { trainerProfile: true } },
      },
    });

    invalidateCache('courses_');
    invalidateCache('recs_');

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { courseId, traineeId } = await req.json();

    if (!courseId || !traineeId) {
      return NextResponse.json({ error: 'courseId and traineeId are required' }, { status: 400 });
    }

    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        courseId_traineeId: {
          courseId,
          traineeId,
        },
      },
      create: {
        courseId,
        traineeId,
        progress: 0,
        status: 'ACTIVE',
      },
      update: {
        status: 'ACTIVE',
      },
      include: { course: true },
    });

    invalidateCache('courses_');
    invalidateCache('recs_');

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const courseId = data.courseId || data.id;
    const { title, description, subject, category, difficulty, durationHours, thumbnailUrl, targetSkills, status } = data;

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(subject ? { subject } : {}),
        ...(category ? { category } : {}),
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(durationHours ? { durationHours: Number(durationHours) } : {}),
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
        ...(targetSkills ? { targetSkills } : {}),
        ...(status ? { status: status as CourseStatus } : {}),
      },
      include: {
        trainer: { include: { trainerProfile: true } },
        resources: true,
        assessments: true,
      },
    });

    invalidateCache('courses_');
    invalidateCache('recs_');

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('Course update error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // Clean dependent entities
    await prisma.feedback.deleteMany({ where: { courseId } });
    await prisma.learningResource.deleteMany({ where: { courseId } });
    await prisma.courseEnrollment.deleteMany({ where: { courseId } });
    await prisma.certificate.deleteMany({ where: { courseId } });

    const assessments = await prisma.assessment.findMany({ where: { courseId }, select: { id: true } });
    for (const a of assessments) {
      await prisma.assessmentAnswer.deleteMany({ where: { attempt: { assessmentId: a.id } } });
      await prisma.assessmentAttempt.deleteMany({ where: { assessmentId: a.id } });
      await prisma.question.deleteMany({ where: { assessmentId: a.id } });
    }
    await prisma.assessment.deleteMany({ where: { courseId } });
    await prisma.recommendation.deleteMany({ where: { courseId } });

    await prisma.course.delete({
      where: { id: courseId },
    });

    invalidateCache('courses_');
    invalidateCache('recs_');

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Course deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
