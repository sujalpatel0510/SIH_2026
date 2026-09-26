import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCached, setCached, invalidateCache } from '@/lib/server-cache';

export async function GET(req: Request) {
  try {
    const cacheKey = 'admin_announcements';
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, announcements: cached });
    }

    let announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (announcements.length === 0) {
      // Seed default initial broadcast
      const initial = await prisma.announcement.create({
        data: {
          title: 'National Digital Capacity Building Initiative Launched',
          content: 'CampusPilot AI has deployed the enterprise Capacity Connect infrastructure across regional training academies. Check your schedules for live mentorship sessions.',
          authorName: 'Central Training Directorate',
          priority: 'HIGH',
          targetRole: 'ALL',
        },
      });
      announcements = [initial];
    }

    setCached(cacheKey, announcements, 15000);
    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, content, priority, targetRole, authorName } = data;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority: priority || 'NORMAL',
        targetRole: targetRole || 'ALL',
        authorName: authorName || 'Central Administration',
      },
    });

    // Notify all users in one batch
    try {
      const allUsers = await prisma.user.findMany({ select: { id: true } });
      if (allUsers.length > 0) {
        await prisma.notification.createMany({
          data: allUsers.map((u) => ({
            userId: u.id,
            title: `Broadcast: ${title}`,
            message: content.slice(0, 120),
            type: priority === 'HIGH' ? 'ALERT' : 'INFO',
            link: '/admin/announcements',
          })),
        });
      }
    } catch (e) {
      console.warn('Announcement notification warning:', e);
    }

    invalidateCache('admin_announcements');

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    await prisma.announcement.delete({ where: { id } });
    invalidateCache('admin_announcements');

    return NextResponse.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
