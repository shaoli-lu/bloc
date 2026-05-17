// ============================================
// BLOC — Pause Overlay
// ============================================
'use client';

import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
}

export default function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="overlay animate-fade-in" id="pause-screen">
      <div className="overlay-card glass animate-fade-in-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent-cyan)">
            <rect x="5" y="3" width="5" height="18" rx="1" />
            <rect x="14" y="3" width="5" height="18" rx="1" />
          </svg>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            Paused
          </h2>
        </div>

        <button
          className="btn-primary"
          onClick={onResume}
          id="btn-resume"
          style={{ width: '100%', maxWidth: '200px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
          Resume
        </button>

        <div style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}>
          Press P or ESC to resume
        </div>
      </div>
    </div>
  );
}
