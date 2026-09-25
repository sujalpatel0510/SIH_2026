import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const nvidiaKey = process.env.NVIDIA_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

  const isConfigured = (nvidiaKey.trim().length > 0) || (geminiKey.trim().length > 0);
  const activeEngine = nvidiaKey.trim().length > 0 
    ? 'NVIDIA NIM (Llama 3.1 70B)' 
    : geminiKey.trim().length > 0 
    ? 'Google Gemini 1.5 Flash' 
    : 'CampusPilot Neural Reasoning';

  return NextResponse.json({
    isConfigured,
    activeEngine,
    hasNvidia: nvidiaKey.trim().length > 0,
    hasGemini: geminiKey.trim().length > 0,
    model,
    maskedKey: nvidiaKey ? `${nvidiaKey.slice(0, 8)}...${nvidiaKey.slice(-4)}` : '',
  });
}

export async function POST(req: Request) {
  try {
    const { apiKey, model } = await req.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json({ error: 'Please enter a valid NVIDIA API Key (starts with nvapi-...)' }, { status: 400 });
    }

    const cleanKey = apiKey.trim();
    const cleanModel = model?.trim() || 'meta/llama-3.1-70b-instruct';

    // 1. Update runtime process.env immediately
    process.env.NVIDIA_API_KEY = cleanKey;
    process.env.NVIDIA_MODEL = cleanModel;

    // 2. Persist to .env file
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');

      if (envContent.includes('NVIDIA_API_KEY=')) {
        envContent = envContent.replace(/NVIDIA_API_KEY=.*/, `NVIDIA_API_KEY="${cleanKey}"`);
      } else {
        envContent += `\nNVIDIA_API_KEY="${cleanKey}"\n`;
      }

      if (envContent.includes('NVIDIA_MODEL=')) {
        envContent = envContent.replace(/NVIDIA_MODEL=.*/, `NVIDIA_MODEL="${cleanModel}"`);
      } else {
        envContent += `\nNVIDIA_MODEL="${cleanModel}"\n`;
      }

      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: 'NVIDIA AI successfully activated! Live Llama 3.1 70B engine is now answering your questions.',
      activeEngine: `NVIDIA NIM (${cleanModel})`,
    });
  } catch (error) {
    console.error('Save NVIDIA config error:', error);
    return NextResponse.json({ error: 'Failed to update NVIDIA configuration' }, { status: 500 });
  }
}
