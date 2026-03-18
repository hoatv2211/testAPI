import { NextRequest, NextResponse } from 'next/server';
import { addVote, getSessionSummary } from '@/lib/voteStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, voteType, playerId } = body;

    if (!sessionId || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and voteType are required' },
        { status: 400 }
      );
    }

    if (voteType !== 'help' && voteType !== 'hinder') {
      return NextResponse.json(
        { error: 'Invalid voteType. Must be "help" or "hinder"' },
        { status: 400 }
      );
    }

    const vote = addVote(sessionId, voteType, playerId);
    const summary = getSessionSummary(sessionId);

    return NextResponse.json({
      success: true,
      vote,
      summary,
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Vote API is running. Use POST to submit votes.',
    endpoints: {
      POST: '/api/vote - Submit a vote',
      GET: '/api/vote - This info',
    },
  });
}
