// ============================================
// BLOC — Touch Controls Component (minimal)
// Left/Right/Rotate/Drop now handled by board drag
// ============================================
'use client';

import React from 'react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotate: (dir: 1 | -1) => void;
  onHold: () => void;
  onPause: () => void;
  isPaused: boolean;
}

export default function TouchControls({
  onHold,
  onPause,
  onRotate,
  onHardDrop,
  isPaused,
}: TouchControlsProps) {
  return (
    <div
      className="touch-controls"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 24px 12px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      {/* Hold */}
      <button
        className="touch-btn"
        onPointerDown={(e) => { e.preventDefault(); onHold(); }}
        id="btn-hold"
        aria-label="Hold piece"
        style={{ width: '52px', height: '52px', fontSize: '0.65rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em', flexDirection: 'column', gap: '3px' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
        HOLD
      </button>

      {/* Rotate CCW */}
      <button
        className="touch-btn touch-btn-lg"
        onPointerDown={(e) => { e.preventDefault(); onRotate(-1); }}
        id="btn-rotate-ccw"
        aria-label="Rotate counter-clockwise"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      {/* Hard Drop */}
      <button
        className="touch-btn touch-btn-lg"
        onPointerDown={(e) => { e.preventDefault(); onHardDrop(); }}
        id="btn-hard-drop"
        aria-label="Hard drop"
        style={{
          background: 'rgba(0, 229, 255, 0.12)',
          borderColor: 'rgba(0, 229, 255, 0.25)',
          width: '56px',
          height: '56px',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6l-7 7-7-7" />
          <path d="M19 13l-7 7-7-7" />
        </svg>
      </button>

      {/* Rotate CW */}
      <button
        className="touch-btn touch-btn-lg"
        onPointerDown={(e) => { e.preventDefault(); onRotate(1); }}
        id="btn-rotate-cw"
        aria-label="Rotate clockwise"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6" />
          <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
        </svg>
      </button>

      {/* Pause */}
      <button
        className="touch-btn"
        onPointerDown={(e) => { e.preventDefault(); onPause(); }}
        id="btn-pause"
        aria-label={isPaused ? 'Resume' : 'Pause'}
        style={{ width: '52px', height: '52px' }}
      >
        {isPaused ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="3" width="5" height="18" rx="1" />
            <rect x="14" y="3" width="5" height="18" rx="1" />
          </svg>
        )}
      </button>
    </div>
  );
}
