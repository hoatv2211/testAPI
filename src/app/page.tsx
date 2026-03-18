'use client';

import { useState, useEffect } from 'react';

interface VoteSummary {
  sessionId: string;
  helpCount: number;
  hinderCount: number;
  total: number;
  helpPercentage: number;
  hinderPercentage: number;
}

interface HostInfo {
  ip: string;
  port: number;
  url: string;
}

export default function Home() {
  const [sessionId] = useState<string>('default');
  const [voteUrl, setVoteUrl] = useState<string>('');
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);

  useEffect(() => {
    const baseUrl = 'https://test-api-nine-rouge.vercel.app';
    setVoteUrl(`${baseUrl}/vote?session=${sessionId}`);

    // Fetch live summary
    fetchSummary();
    const interval = setInterval(fetchSummary, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleReset = async () => {
    try {
      await fetch(`/api/vote?sessionId=${sessionId}`, { method: 'DELETE' });
      fetchSummary();
    } catch (err) {
      console.error('Error resetting votes:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/summary?sessionId=${sessionId}`);
      const data = await res.json();
      if (!data.error) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  return (
    <div className="container">
      <h1 className="logo">Treatstorm</h1>
      <p className="subtitle">Scan to Vote!</p>

      <div className="qr-section">
        <h3>Scan QR Code to Join</h3>
        <div className="qr-placeholder">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(voteUrl)}`}
            alt="Vote QR Code"
          />
        </div>
        <p className="qr-link">{voteUrl}</p>
      </div>

      {summary && (
        <div className="stats" style={{ marginTop: '2rem' }}>
          <h3>Live Crowd Vote</h3>
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
            <span className="percentage-help">{summary.helpCount} HELP</span>
            <span className="percentage-hinder">{summary.hinderCount} HINDER</span>
          </div>
          <p className="total-votes">{summary.total} votes</p>
          <button
            onClick={handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Reset Votes
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
        <p>Treatstorm QR Voting System</p>
        {hostInfo && <p>Server: {hostInfo.ip}:{hostInfo.port}</p>}
      </div>
    </div>
  );
}
