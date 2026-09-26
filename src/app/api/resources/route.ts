import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResourceType } from '@prisma/client';
import { invalidateCache, getCached, setCached } from '@/lib/server-cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const cacheKey = `resources_${courseId || 'ALL'}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { success: true, resources: cached },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
      );
    }

    const whereClause: Record<string, unknown> = {};
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const resources = await prisma.learningResource.findMany({
      where: whereClause,
      include: {
        course: { select: { id: true, title: true, subject: true, category: true } },
        trainer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    setCached(cacheKey, resources, 30000);

    return NextResponse.json(
      { success: true, resources },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Fetch resources error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning resources' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, trainerId, title, description, resourceType, fileUrl, duration } = body;

    if (!title || !courseId) {
      return NextResponse.json({ error: 'Title and courseId are required' }, { status: 400 });
    }

    let finalTrainerId = trainerId;
    if (!finalTrainerId) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      finalTrainerId = course?.trainerId;
    }

    if (!finalTrainerId) {
      const firstTrainer = await prisma.user.findFirst({ where: { role: 'TRAINER' } });
      finalTrainerId = firstTrainer?.id;
    }

    if (!finalTrainerId) {
      return NextResponse.json({ error: 'No valid trainer found to attach resource' }, { status: 400 });
    }

    // Validate resourceType
    let validResourceType: ResourceType = ResourceType.PDF;
    if (resourceType && ['PDF', 'PPT', 'VIDEO', 'DOCUMENT', 'NOTES'].includes(resourceType)) {
      validResourceType = resourceType as ResourceType;
    }

    const newResource = await prisma.learningResource.create({
      data: {
        courseId,
        trainerId: finalTrainerId,
        title,
        description: description || `Curriculum resource for course.`,
        resourceType: validResourceType,
        fileUrl: fileUrl || 'https://arxiv.org/pdf/1802.01528.pdf',
        duration: duration || '30 Mins',
        visibility: true,
      },
      include: {
        course: { select: { id: true, title: true } },
        trainer: { select: { id: true, name: true } },
      },
    });

    invalidateCache('resources_');
    invalidateCache('courses_');

    return NextResponse.json({ success: true, resource: newResource });
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json({ error: 'Failed to create learning resource' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resource id is required' }, { status: 400 });
    }

    await prisma.learningResource.delete({
      where: { id },
    });

    invalidateCache('resources_');
    invalidateCache('courses_');

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
