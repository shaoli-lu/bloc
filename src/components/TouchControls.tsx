// ============================================
// BLOC — Touch Controls Component
// ============================================
'use client';

import React, { useCallback, useRef } from 'react';

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
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onHardDrop,
  onRotate,
  onHold,
  onPause,
  isPaused,
}: TouchControlsProps) {
  const repeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRepeat = useCallback((action: () => void) => {
    action();
    repeatTimerRef.current = setInterval(action, 100);
  }, []);

  const stopRepeat = useCallback(() => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  return (
    <div
      className="touch-controls"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '8px 16px 16px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      {/* Top row: Hold, Pause, Rotate */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        <button
          className="touch-btn"
          onTouchStart={(e) => { e.preventDefault(); onHold(); }}
          onClick={onHold}
          id="btn-hold"
          aria-label="Hold piece"
          style={{ width: '48px', height: '48px', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em' }}
        >
          HOLD
        </button>
        <button
          className="touch-btn"
          onTouchStart={(e) => { e.preventDefault(); onPause(); }}
          onClick={onPause}
          id="btn-pause"
          aria-label={isPaused ? 'Resume' : 'Pause'}
          style={{ width: '48px', height: '48px' }}
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
        <button
          className="touch-btn"
          onTouchStart={(e) => { e.preventDefault(); onRotate(-1); }}
          onClick={() => onRotate(-1)}
          id="btn-rotate-ccw"
          aria-label="Rotate counter-clockwise"
          style={{ width: '48px', height: '48px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </div>

      {/* Bottom row: Left, Down, HardDrop, Right, Rotate CW */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          className="touch-btn touch-btn-lg"
          onTouchStart={(e) => { e.preventDefault(); startRepeat(onMoveLeft); }}
          onTouchEnd={stopRepeat}
          onTouchCancel={stopRepeat}
          onClick={onMoveLeft}
          id="btn-left"
          aria-label="Move left"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="touch-btn touch-btn-lg"
          onTouchStart={(e) => { e.preventDefault(); startRepeat(onSoftDrop); }}
          onTouchEnd={stopRepeat}
          onTouchCancel={stopRepeat}
          onClick={onSoftDrop}
          id="btn-down"
          aria-label="Soft drop"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          className="touch-btn touch-btn-lg"
          onTouchStart={(e) => { e.preventDefault(); onHardDrop(); }}
          onClick={onHardDrop}
          id="btn-hard-drop"
          aria-label="Hard drop"
          style={{
            background: 'rgba(0, 229, 255, 0.12)',
            borderColor: 'rgba(0, 229, 255, 0.25)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6l-7 7-7-7" />
            <path d="M19 13l-7 7-7-7" />
          </svg>
        </button>

        <button
          className="touch-btn touch-btn-lg"
          onTouchStart={(e) => { e.preventDefault(); startRepeat(onMoveRight); }}
          onTouchEnd={stopRepeat}
          onTouchCancel={stopRepeat}
          onClick={onMoveRight}
          id="btn-right"
          aria-label="Move right"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          className="touch-btn touch-btn-lg"
          onTouchStart={(e) => { e.preventDefault(); onRotate(1); }}
          onClick={() => onRotate(1)}
          id="btn-rotate-cw"
          aria-label="Rotate clockwise"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
