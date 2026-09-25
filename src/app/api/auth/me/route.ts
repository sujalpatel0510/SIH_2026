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
