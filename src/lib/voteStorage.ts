// Shared vote storage for both /api/vote and /api/summary

export interface Vote {
  sessionId: string;
  voteType: 'help' | 'hinder';
  playerId?: string;
  timestamp: number;
}

export interface SessionVotes {
  votes: Vote[];
}

export const voteStorage = new Map<string, SessionVotes>();

export function getOrCreateSession(sessionId: string): SessionVotes {
  if (!voteStorage.has(sessionId)) {
    voteStorage.set(sessionId, { votes: [] });
  }
  return voteStorage.get(sessionId)!;
}

export function addVote(sessionId: string, voteType: 'help' | 'hinder', playerId?: string): Vote {
  const session = getOrCreateSession(sessionId);
  const vote: Vote = {
    sessionId,
    voteType,
    playerId,
    timestamp: Date.now(),
  };
  session.votes.push(vote);
  return vote;
}

export function getSessionSummary(sessionId: string) {
  const session = voteStorage.get(sessionId);
  
  if (!session) {
    return {
      sessionId,
      helpCount: 0,
      hinderCount: 0,
      total: 0,
      helpPercentage: 50,
      hinderPercentage: 50,
      voters: [],
    };
  }

  const votes = session.votes;
  const helpCount = votes.filter(v => v.voteType === 'help').length;
  const hinderCount = votes.filter(v => v.voteType === 'hinder').length;
  const total = helpCount + hinderCount;
  const voters = [...new Set(votes.map(v => v.playerId || 'anonymous'))];

  return {
    sessionId,
    helpCount,
    hinderCount,
    total,
    helpPercentage: total > 0 ? Math.round((helpCount / total) * 100) : 50,
    hinderPercentage: total > 0 ? Math.round((hinderCount / total) * 100) : 50,
    voters,
    lastUpdated: votes.length > 0 ? votes[votes.length - 1].timestamp : null,
  };
}

export function clearSession(sessionId?: string) {
  if (sessionId) {
    voteStorage.delete(sessionId);
  } else {
    voteStorage.clear();
  }
}
