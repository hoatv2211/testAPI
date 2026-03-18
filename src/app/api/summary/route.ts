import { NextRequest, NextResponse } from 'next/server';
import { getSessionSummary, clearSession } from '@/lib/voteStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameter: sessionId' },
        { status: 400 }
      );
    }

    const summary = getSessionSummary(sessionId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      clearSession(sessionId);
      return NextResponse.json({
        success: true,
        message: `Session ${sessionId} has been reset`,
      });
    }

    clearSession();
    return NextResponse.json({
      success: true,
      message: 'All sessions have been cleared',
    });
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
