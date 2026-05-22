// ============================================
// BLOC — Start Screen Overlay
// ============================================
'use client';

import React, { useEffect, useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      onStart();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="overlay animate-fade-in" id="start-screen">
      <div className="overlay-card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
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
          <span className="animate-pulse" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em'
          }}>
            press any key to start
          </span>
        </div>

        {/* Controls hint — touch vs keyboard */}
        <ControlsHint />
      </div>
    </div>
  );
}

function ControlsHint() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  const touchRows = [
    { icon: '↔', label: 'Drag left / right — move' },
    { icon: '👆', label: 'Tap board — rotate' },
    { icon: '⚡', label: 'Flick down — hard drop' },
    { icon: '↑', label: 'Swipe up — hold' },
    { icon: '↺↻', label: 'Buttons — rotate  ·  ⏸ pause' },
  ];

  const keyRows = [
    { icon: '← →', label: 'Move  ·  A / D' },
    { icon: '↑', label: 'Rotate  ·  W / X / E' },
    { icon: '↓', label: 'Soft drop  ·  S' },
    { icon: '␣', label: 'Hard drop' },
    { icon: 'C', label: 'Hold  ·  P / Esc pause' },
  ];

  const rows = isTouch ? touchRows : keyRows;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '2px',
        textAlign: 'center',
      }}>
        {isTouch ? 'Touch Controls' : 'Keyboard Controls'}
      </p>
      {rows.map(({ icon, label }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 10px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--accent-cyan)',
            minWidth: '30px',
            textAlign: 'center',
          }}>
            {icon}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
