// ============================================
// BLOC — Stats Panel Component
// ============================================
'use client';

import React from 'react';

interface StatsPanelProps {
  score: number;
  lines: number;
  level: number;
}

export default function StatsPanel({ score, lines, level }: StatsPanelProps) {
  return (
    <div
      className="glass-light"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span className="stat-label">Score</span>
        <span className="stat-value" id="score-display">{score.toLocaleString()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span className="stat-label">Lines</span>
          <span className="stat-value" style={{ fontSize: '0.95rem' }}>{lines}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
          <span className="stat-label">Level</span>
          <span className="level-badge" id="level-display">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polygon points="5,0 10,10 0,10" fill="currentColor" />
            </svg>
            {level}
          </span>
        </div>
      </div>
    </div>
  );
}
