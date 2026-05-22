// ============================================
// BLOC — Main Game Page (Mobile-First)
// ============================================
'use client';

import React, { useRef } from 'react';
import { useGame } from '@/game/useGame';
import Board from '@/components/Board';
import MiniPreview from '@/components/MiniPreview';
import TouchControls from '@/components/TouchControls';
import StartScreen from '@/components/StartScreen';
import GameOver from '@/components/GameOver';
import PauseOverlay from '@/components/PauseOverlay';
import { useDragControls } from '@/game/useDragControls';

export default function BlocGame() {
  const {
    gameState,
    isStarted,
    scorePopups,
    isMounted,
    startGame,
    restartGame,
    handleMoveLeft,
    handleMoveRight,
    handleSoftDrop,
    handleHardDrop,
    handleRotate,
    handleHold,
    handlePause,
  } = useGame();

  const boardRef = useRef<HTMLDivElement>(null);

  // Board drag controls — makes the board the primary touch surface
  useDragControls(boardRef, {
    onMoveLeft: handleMoveLeft,
    onMoveRight: handleMoveRight,
    onSoftDrop: handleSoftDrop,
    onHardDrop: handleHardDrop,
    onRotate: handleRotate,
    onHold: handleHold,
    enabled: isStarted && !gameState.isGameOver && !gameState.isPaused,
  });

  return (
    <main className="bloc-main">
      {/* Top Bar: Hold, Logo + Score, Next */}
      <div className="top-bar">
        <MiniPreview type={isMounted ? gameState.holdPiece : null} label="Hold" />

        <div className="top-center">
          <h1 className="logo-text" style={{ fontSize: '1.1rem' }}>BLOC</h1>
          <div className="top-stats">
            <div className="top-stat">
              <span className="stat-label">Score</span>
              <span className="stat-value" id="score-display" style={{ fontSize: '1rem' }}>
                {gameState.score.toLocaleString()}
              </span>
            </div>
            <div className="top-stat">
              <span className="stat-label">Lines</span>
              <span className="stat-value" style={{ fontSize: '0.85rem' }}>{gameState.lines}</span>
            </div>
            <div className="top-stat">
              <span className="stat-label">Lvl</span>
              <span className="level-badge" id="level-display">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <polygon points="5,0 10,10 0,10" fill="currentColor" />
                </svg>
                {gameState.level}
              </span>
            </div>
          </div>
        </div>

        <MiniPreview type={isMounted ? (gameState.nextPieces[0] || null) : null} label="Next" />
      </div>

      {/* Board — touch drag surface */}
      <div
        ref={boardRef}
        className="board-wrapper"
        style={{ touchAction: 'none', cursor: 'grab' }}
      >
        <Board
          board={gameState.board}
          currentPiece={isMounted ? gameState.currentPiece : null}
          clearingRows={gameState.clearingRows}
        />
        {/* Score popups */}
        {scorePopups.map(popup => (
          <div
            key={popup.id}
            className="score-popup"
            style={{
              left: `${popup.x}%`,
              top: `${popup.y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {popup.text}
          </div>
        ))}

        {/* Gesture hint — fades out after game starts */}
        {isStarted && !gameState.isGameOver && !gameState.isPaused && (
          <div className="gesture-hint" aria-hidden="true">
            <span>← drag →</span>
            <span>tap = rotate</span>
            <span>↓ flick = drop</span>
          </div>
        )}

        {/* Next pieces queue (2nd and 3rd) */}
        <div className="next-queue">
          {(isMounted ? gameState.nextPieces.slice(1, 3) : [null, null]).map((type, i) => (
            <MiniPreview key={i} type={type as any} label="" />
          ))}
        </div>
      </div>

      {/* Touch Controls */}
      <TouchControls
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
        onSoftDrop={handleSoftDrop}
        onHardDrop={handleHardDrop}
        onRotate={handleRotate}
        onHold={handleHold}
        onPause={handlePause}
        isPaused={gameState.isPaused}
      />

      {/* Overlays */}
      {!isStarted && <StartScreen onStart={startGame} />}
      {isStarted && gameState.isPaused && <PauseOverlay onResume={handlePause} />}
      {isStarted && gameState.isGameOver && (
        <GameOver
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          onRestart={restartGame}
        />
      )}
    </main>
  );
}
