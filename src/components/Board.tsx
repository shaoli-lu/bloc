// ============================================
// BLOC — Board Component
// ============================================
'use client';

import React, { useMemo } from 'react';
import { Board as BoardType, Piece, getGhostPosition, CellValue } from '@/game/engine';

interface BoardProps {
  board: BoardType;
  currentPiece: Piece | null;
  clearingRows: number[];
}

export default function Board({ board, currentPiece, clearingRows }: BoardProps) {
  // Build display grid including current piece + ghost
  const displayGrid = useMemo(() => {
    const grid: { value: CellValue; isGhost: boolean; isClearing: boolean }[][] =
      board.map((row, ri) =>
        row.map(cell => ({
          value: cell,
          isGhost: false,
          isClearing: clearingRows.includes(ri),
        }))
      );

    if (currentPiece) {
      // Ghost piece
      const ghostOffset = getGhostPosition(board, currentPiece);
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (!currentPiece.shape[r][c]) continue;
          const row = currentPiece.position.row + r + ghostOffset;
          const col = currentPiece.position.col + c;
          if (row >= 0 && row < 20 && col >= 0 && col < 10 && !grid[row][col].value) {
            grid[row][col] = { value: currentPiece.type, isGhost: true, isClearing: false };
          }
        }
      }

      // Current piece (on top of ghost)
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (!currentPiece.shape[r][c]) continue;
          const row = currentPiece.position.row + r;
          const col = currentPiece.position.col + c;
          if (row >= 0 && row < 20 && col >= 0 && col < 10) {
            grid[row][col] = { value: currentPiece.type, isGhost: false, isClearing: false };
          }
        }
      }
    }

    return grid;
  }, [board, currentPiece, clearingRows]);

  return (
    <div className="game-board" id="game-board">
      {displayGrid.map((row, ri) =>
        row.map((cell, ci) => {
          let className = 'cell';
          if (cell.value) {
            className += ` filled piece-${cell.value}`;
          }
          if (cell.isGhost) {
            className += ' ghost';
          }
          if (cell.isClearing) {
            className += ' clearing';
          }
          return <div key={`${ri}-${ci}`} className={className} />;
        })
      )}
    </div>
  );
}
