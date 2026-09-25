import { NextResponse } from 'next/server';
import { getAILearningAssistantResponse } from '@/lib/ai-engine';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.prompt || body.query;
    const traineeId = body.traineeId;

    if (!message) {
      return NextResponse.json({ error: 'Message or prompt is required' }, { status: 400 });
    }

    let resolvedTraineeId = traineeId;
    if (!resolvedTraineeId) {
      const defaultUser = await prisma.user.findFirst({ where: { role: 'TRAINEE' } });
      resolvedTraineeId = defaultUser?.id || '';
    }

    const reply = await getAILearningAssistantResponse(resolvedTraineeId, message);

    return NextResponse.json({
      success: true,
      reply,
      response: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI assistant error:', error);
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}
