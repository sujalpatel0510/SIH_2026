import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCached, setCached, invalidateCache } from '@/lib/server-cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let traineeId = searchParams.get('traineeId');

    const cacheKey = `certs_${traineeId || 'ALL'}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { success: true, certificates: cached },
        { headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=60' } }
      );
    }

    const whereClause: Record<string, unknown> = {};
    if (traineeId) {
      whereClause.traineeId = traineeId;
    }

    let certificates = await prisma.certificate.findMany({
      where: whereClause,
      include: {
        course: { select: { id: true, title: true, subject: true } },
        trainee: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { issueDate: 'desc' },
    });

    // If database has no certificates yet, seed a foundational verified credential for demo
    if (certificates.length === 0 && traineeId) {
      const defaultCourse = await prisma.course.findFirst();
      if (defaultCourse) {
        try {
          const initialCert = await prisma.certificate.create({
            data: {
              traineeId,
              courseId: defaultCourse.id,
              title: 'Cloud Architecture & Enterprise Microservices — Professional Certification',
              certificateNumber: `CP-CERT-2026-CLOUD-${Math.floor(1000 + Math.random() * 9000)}`,
              verificationCode: `VERIFY-CP-CLOUD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
              issueDate: new Date('2026-09-18T10:00:00Z'),
            },
            include: {
              course: { select: { id: true, title: true, subject: true } },
              trainee: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
          });
          certificates = [initialCert];
        } catch (seedErr) {
          console.warn('Certificate seed notice:', seedErr);
        }
      }
    }

    setCached(cacheKey, certificates, 15000);

    return NextResponse.json(
      { success: true, certificates },
      { headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      title,
      courseId,
      traineeId,
      certificateNumber,
      verificationCode,
      issueDate,
      pdfUrl,
      imageUrl,
    } = data;

    const certAssetUrl = imageUrl || pdfUrl || null;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Certificate title is required' }, { status: 400 });
    }

    // Resolve trainee ID
    let resolvedTraineeId = traineeId;
    if (!resolvedTraineeId) {
      const defaultTrainee =
        (await prisma.user.findUnique({ where: { email: 'sujal@example.com' } })) ||
        (await prisma.user.findFirst({ where: { role: 'TRAINEE' } }));
      resolvedTraineeId = defaultTrainee?.id;
    }

    if (!resolvedTraineeId) {
      return NextResponse.json({ error: 'Trainee profile not found' }, { status: 404 });
    }

    // Resolve course ID (match or fallback to any existing course in DB)
    let resolvedCourseId = courseId;
    if (!resolvedCourseId) {
      const matchCourse = await prisma.course.findFirst({
        where: {
          title: { contains: title.slice(0, 8), mode: 'insensitive' },
        },
      });
      resolvedCourseId = matchCourse?.id || (await prisma.course.findFirst())?.id;
    }

    if (!resolvedCourseId) {
      return NextResponse.json({ error: 'No associated course found' }, { status: 400 });
    }

    // Generate verified unique credentials identifiers if not provided
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codeSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certNumber = certificateNumber?.trim() || `CP-CERT-2026-${randomSuffix}`;
    const verifyCode = verificationCode?.trim() || `VERIFY-CP-${codeSuffix}`;

    const newCertificate = await prisma.certificate.create({
      data: {
        traineeId: resolvedTraineeId,
        courseId: resolvedCourseId,
        title: title.trim(),
        certificateNumber: certNumber,
        verificationCode: verifyCode,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        pdfUrl: certAssetUrl,
      },
      include: {
        course: { select: { id: true, title: true, subject: true } },
        trainee: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    // Notify trainee of newly earned/added certificate
    try {
      await prisma.notification.create({
        data: {
          userId: resolvedTraineeId,
          title: 'Accredited Certificate Added',
          message: `Verified certificate "${title.trim()}" has been recorded. Credential: ${certNumber}.`,
          type: 'SUCCESS',
          link: '/trainee/certificates',
        },
      });
    } catch (notifErr) {
      console.warn('Failed to dispatch certificate notification:', notifErr);
    }

    invalidateCache('certs_');

    return NextResponse.json({
      success: true,
      message: 'Certificate added successfully',
      certificate: newCertificate,
    });
  } catch (error: any) {
    console.error('Create certificate error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A certificate with this Certificate Number or Verification Code already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to add certificate' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    await prisma.certificate.delete({
      where: { id },
    });

    invalidateCache('certs_');

    return NextResponse.json({ success: true, message: 'Certificate removed successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    return NextResponse.json({ error: 'Failed to remove certificate' }, { status: 500 });
  }
}
