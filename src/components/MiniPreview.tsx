// ============================================
// BLOC — Mini Preview Component (Hold + Next)
// ============================================
'use client';

import React from 'react';
import { PieceType, getShapeForType } from '@/game/engine';

interface MiniPreviewProps {
  type: PieceType | null;
  label: string;
}

export default function MiniPreview({ type, label }: MiniPreviewProps) {
  const shape = type ? getShapeForType(type) : null;

  // Center the shape in a 4x4 grid
  const grid: (PieceType | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

  if (shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const offsetR = Math.floor((4 - rows) / 2);
    const offsetC = Math.floor((4 - cols) / 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c]) {
          grid[offsetR + r][offsetC + c] = type;
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <span className="stat-label">{label}</span>
      <div
        className="glass-light"
        style={{
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          display: 'inline-block',
        }}
      >
        <div className="mini-grid">
          {grid.map((row, ri) =>
            row.map((cell, ci) => {
              let className = 'mini-cell';
              if (cell) {
                className += ` filled piece-${cell}`;
              }
              return <div key={`${ri}-${ci}`} className={className} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
