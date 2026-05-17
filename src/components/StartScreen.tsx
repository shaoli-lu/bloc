// ============================================
// BLOC — Start Screen Overlay
// ============================================
'use client';

import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="overlay animate-fade-in" id="start-screen">
      <div className="overlay-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <h1
            className="logo-text"
            style={{ fontSize: '3.5rem', letterSpacing: '0.25em' }}
          >
            BLOC
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            Puzzle Game
          </p>
        </div>

        {/* Decorative blocks */}
        <div style={{ display: 'flex', gap: '6px', opacity: 0.6 }}>
          {['piece-I', 'piece-T', 'piece-S', 'piece-Z', 'piece-J', 'piece-L', 'piece-O'].map((cls, i) => (
            <div
              key={i}
              className={`cell filled ${cls}`}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={onStart}
          id="btn-start"
          style={{ width: '100%', maxWidth: '240px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
          Start Game
        </button>

        {/* Controls hint */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
          opacity: 0.4,
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
        }}>
          <span>← → move · ↓ soft drop</span>
          <span>↑ rotate · space hard drop</span>
          <span>C hold · P pause</span>
        </div>
      </div>
    </div>
  );
}
