import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserStatus, Role } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const where: any = {};
    if (role && role !== 'ALL') where.role = role as Role;
    if (status && status !== 'ALL') where.status = status as UserStatus;

    const users = await prisma.user.findMany({
      where,
      include: {
        traineeProfile: true,
        trainerProfile: true,
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, status, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (status) data.status = status as UserStatus;
    if (role) data.role = role as Role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      include: { traineeProfile: true, trainerProfile: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
