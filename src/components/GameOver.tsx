// ============================================
// BLOC — Game Over Overlay
// ============================================
'use client';

import React, { useEffect, useState } from 'react';

interface GameOverProps {
  score: number;
  lines: number;
  level: number;
  onRestart: () => void;
}

export default function GameOver({ score, lines, level, onRestart }: GameOverProps) {
  const [highScore, setHighScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bloc-highscore');
    const prev = stored ? parseInt(stored, 10) : 0;
    if (score > prev) {
      localStorage.setItem('bloc-highscore', score.toString());
      setHighScore(score);
      setIsNewHigh(true);
    } else {
      setHighScore(prev);
      setIsNewHigh(false);
    }
  }, [score]);

  return (
    <div className="overlay animate-fade-in" id="game-over-screen">
      <div className="overlay-card glass animate-fade-in-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-coral), var(--accent-magenta))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Game Over
          </h2>
          {isNewHigh && (
            <div style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--accent-amber)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>
              ★ New High Score! ★
            </div>
          )}
        </div>

        {/* Score summary */}
        <div
          className="glass-light"
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Score</span>
            <span className="stat-value" style={{ fontSize: '1.4rem' }}>{score.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Lines</span>
            <span className="stat-value" style={{ fontSize: '1rem' }}>{lines}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Level</span>
            <span className="stat-value" style={{ fontSize: '1rem' }}>{level}</span>
          </div>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Best</span>
            <span className="stat-value" style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={onRestart}
          id="btn-restart"
          style={{ width: '100%', maxWidth: '240px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Play Again
        </button>
      </div>
    </div>
  );
}
