import { NextResponse } from 'next/server';
import { generateMCQsFromText } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { text, subject, count } = await req.json();

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide at least 20 characters of learning material or syllabus text' },
        { status: 400 }
      );
    }

    const questions = await generateMCQsFromText(text, subject || 'General Capacity Building', count || 5);

    // Extract dynamic concepts from the text
    const textWords = text.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter((w: string) => w.length > 5);
    const uniqueKeywords = Array.from(new Set(textWords)).slice(0, 6);
    const extractedConcepts = uniqueKeywords.length >= 3 ? uniqueKeywords : [
      'Architectural Reliability',
      'Loss Convergence Rates',
      'Precision-Recall AUC',
      'Validation Checkpoints',
      'Data Drift Monitoring',
    ];

    return NextResponse.json({
      success: true,
      questions,
      extractedConcepts,
    });
  } catch (error) {
    console.error('AI MCQ Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate MCQs' }, { status: 500 });
  }
}
