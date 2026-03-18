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
    // Get host IP from server
    const fetchHostInfo = async () => {
      try {
        const res = await fetch('/api/host');
        const data = await res.json();
        setHostInfo(data);
        setVoteUrl(`${data.url}/vote?session=${sessionId}`);
      } catch (err) {
        // Fallback to localhost
        setHostInfo({ ip: 'localhost', port: 3000, url: 'http://localhost:3000' });
        setVoteUrl(`http://localhost:3000/vote?session=${sessionId}`);
      }
    };

    fetchHostInfo();

    // Fetch live summary
    fetchSummary();
    const interval = setInterval(fetchSummary, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

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
        </div>
      )}

      <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
        <p>Treatstorm QR Voting System</p>
        {hostInfo && <p>Server: {hostInfo.ip}:{hostInfo.port}</p>}
      </div>
    </div>
  );
}
