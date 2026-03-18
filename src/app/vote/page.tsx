'use client';

import { useState, useEffect } from 'react';

interface VoteSummary {
  sessionId: string;
  helpCount: number;
  hinderCount: number;
  total: number;
  helpPercentage: number;
  hinderPercentage: number;
  voters: string[];
}

export default function VotePage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [status, setStatus] = useState<'idle' | 'voting' | 'voted' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get sessionId from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session') || 'default';
    setSessionId(session);

    // Fetch initial summary
    fetchSummary(session);
    
    // Poll for updates every 2 seconds
    const interval = setInterval(() => fetchSummary(session), 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async (session: string) => {
    try {
      const res = await fetch(`/api/summary?sessionId=${session}`);
      const data = await res.json();
      if (!data.error) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const submitVote = async (voteType: 'help' | 'hinder') => {
    setStatus('voting');
    setError('');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          voteType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        setStatus('voted');
      } else {
        setError(data.error || 'Failed to submit vote');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="container">
      <h1 className="logo">Treatstorm</h1>
      <p className="subtitle">Help or Hinder the player!</p>

      {status === 'voted' && (
        <div className="status voted">
          Vote submitted! Thank you for participating!
        </div>
      )}

      {status === 'error' && (
        <div className="status error">
          {error || 'Something went wrong. Please try again.'}
        </div>
      )}

      {status === 'voting' && (
        <div className="status pending">
          Submitting your vote...
        </div>
      )}

      <div className="vote-buttons">
        <button
          className="vote-btn help-btn"
          onClick={() => submitVote('help')}
          disabled={status === 'voting' || status === 'voted'}
        >
          HELP
        </button>
        <button
          className="vote-btn hinder-btn"
          onClick={() => submitVote('hinder')}
          disabled={status === 'voting' || status === 'voted'}
        >
          HINDER
        </button>
      </div>

      {summary && (
        <div className="stats">
          <h3>Live Results</h3>
          <div className="progress-bar">
            <div
              className="progress-help"
              style={{ width: `${summary.helpPercentage}%` }}
            />
            <div
              className="progress-hinder"
              style={{ width: `${summary.hinderPercentage}%` }}
            />
          </div>
          <div className="percentage">
            <span className="percentage-help">{summary.helpPercentage}% Help</span>
            <span className="percentage-hinder">{summary.hinderPercentage}% Hinder</span>
          </div>
          <p className="total-votes">{summary.total} votes cast</p>
        </div>
      )}
    </div>
  );
}
