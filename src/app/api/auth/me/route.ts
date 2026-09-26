import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie') || '';
    let token = '';

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const match = cookieHeader.match(/cp_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        traineeProfile: true,
        trainerProfile: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        traineeProfile: user.traineeProfile,
        trainerProfile: user.trainerProfile,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie') || '';
    let token = '';

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const match = cookieHeader.match(/cp_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarUrl, traineeProfile, trainerProfile } = body;

    // Update base user
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name ? { name } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
      },
      include: {
        traineeProfile: true,
        trainerProfile: true,
      },
    });

    // Update trainee profile if passed
    if (traineeProfile && updatedUser.role === 'TRAINEE') {
      await prisma.traineeProfile.upsert({
        where: { userId: decoded.userId },
        create: {
          userId: decoded.userId,
          qualifications: traineeProfile.qualifications,
          experience: traineeProfile.experience,
          interests: traineeProfile.interests,
          skills: traineeProfile.skills,
          careerGoal: traineeProfile.careerGoal,
          department: traineeProfile.department,
          phone: traineeProfile.phone,
        },
        update: {
          qualifications: traineeProfile.qualifications,
          experience: traineeProfile.experience,
          interests: traineeProfile.interests,
          skills: traineeProfile.skills,
          careerGoal: traineeProfile.careerGoal,
          department: traineeProfile.department,
          phone: traineeProfile.phone,
        },
      });
    }

    // Update trainer profile if passed
    if (trainerProfile && updatedUser.role === 'TRAINER') {
      await prisma.trainerProfile.upsert({
        where: { userId: decoded.userId },
        create: {
          userId: decoded.userId,
          qualifications: trainerProfile.qualifications,
          experience: trainerProfile.experience,
          expertise: trainerProfile.expertise,
          subjects: trainerProfile.subjects,
          certifications: trainerProfile.certifications,
          bio: trainerProfile.bio,
        },
        update: {
          qualifications: trainerProfile.qualifications,
          experience: trainerProfile.experience,
          expertise: trainerProfile.expertise,
          subjects: trainerProfile.subjects,
          certifications: trainerProfile.certifications,
          bio: trainerProfile.bio,
        },
      });
    }

    const finalUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        traineeProfile: true,
        trainerProfile: true,
        notifications: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json({
      success: true,
      user: finalUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

