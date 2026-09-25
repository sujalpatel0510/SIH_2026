import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { Role, UserStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, department, qualifications, experience, skills, careerGoal } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'TRAINER' ? Role.TRAINER : Role.TRAINEE;

    // For quick test demo convenience, newly registered users default to APPROVED unless specified
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: assignedRole,
        status: UserStatus.APPROVED,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        ...(assignedRole === Role.TRAINEE
          ? {
              traineeProfile: {
                create: {
                  qualifications: qualifications || 'Bachelor of Technology',
                  experience: experience || 'Fresher / Early Career',
                  skills: skills || 'Python, Problem Solving',
                  careerGoal: careerGoal || 'Senior Technical Lead',
                  department: department || 'Engineering',
                },
              },
            }
          : {
              trainerProfile: {
                create: {
                  qualifications: qualifications || 'M.Tech / Ph.D. in Computer Science',
                  experience: experience || '5+ Years Technical Training',
                  expertise: skills || 'Full Stack Systems, AI/ML',
                  subjects: department || 'Computer Science & Engineering',
                  rating: 5.0,
                },
              },
            }),
      },
      include: {
        traineeProfile: true,
        trainerProfile: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        traineeProfile: user.traineeProfile,
        trainerProfile: user.trainerProfile,
      },
      token,
    });

    response.cookies.set('cp_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
