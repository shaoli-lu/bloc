// ============================================
// BLOC — useGame Hook
// ============================================
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GameState,
  createInitialState,
  moveLeft,
  moveRight,
  moveDown,
  softDrop,
  hardDrop,
  rotate,
  holdPiece as holdPieceAction,
  togglePause,
  getDropInterval,
} from './engine';

export interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [isStarted, setIsStarted] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const gameStateRef = useRef(gameState);
  const dropTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevScoreRef = useRef(0);
  const popupIdRef = useRef(0);

  // Handle client hydration
  useEffect(() => {
    setIsMounted(true);
    setGameState(createInitialState());
  }, []);

  // Keep ref in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Score popup
  useEffect(() => {
    const diff = gameState.score - prevScoreRef.current;
    if (diff > 0 && isStarted && diff >= 100) {
      const popup: ScorePopup = {
        id: ++popupIdRef.current,
        text: `+${diff}`,
        x: 50,
        y: 40,
      };
      setScorePopups(prev => [...prev, popup]);
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.id !== popup.id));
      }, 800);
    }
    prevScoreRef.current = gameState.score;
  }, [gameState.score, isStarted]);

  // Drop timer
  useEffect(() => {
    if (!isStarted || gameState.isGameOver || gameState.isPaused) {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      return;
    }

    const interval = getDropInterval(gameState.level);
    dropTimerRef.current = setInterval(() => {
      setGameState(prev => {
        const result = moveDown(prev);
        return result.state;
      });
    }, interval);

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
    };
  }, [isStarted, gameState.isGameOver, gameState.isPaused, gameState.level]);

  // Keyboard controls
  useEffect(() => {
    if (!isStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current.isGameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setGameState(prev => moveLeft(prev));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setGameState(prev => moveRight(prev));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setGameState(prev => softDrop(prev).state);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
        case 'e':
        case 'E':
          e.preventDefault();
          setGameState(prev => rotate(prev, 1));
          break;
        case 'z':
        case 'Z':
        case 'q':
        case 'Q':
          e.preventDefault();
          setGameState(prev => rotate(prev, -1));
          break;
        case ' ':
          e.preventDefault();
          setGameState(prev => hardDrop(prev));
          break;
        case 'c':
        case 'C':
        case 'Shift':
          e.preventDefault();
          setGameState(prev => holdPieceAction(prev));
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          setGameState(prev => togglePause(prev));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted]);

  const startGame = useCallback(() => {
    setGameState(createInitialState());
    setIsStarted(true);
    prevScoreRef.current = 0;
  }, []);

  const restartGame = useCallback(() => {
    setGameState(createInitialState());
    setIsStarted(true);
    prevScoreRef.current = 0;
  }, []);

  const handleMoveLeft = useCallback(() => {
    setGameState(prev => moveLeft(prev));
  }, []);

  const handleMoveRight = useCallback(() => {
    setGameState(prev => moveRight(prev));
  }, []);

  const handleSoftDrop = useCallback(() => {
    setGameState(prev => softDrop(prev).state);
  }, []);

  const handleHardDrop = useCallback(() => {
    setGameState(prev => hardDrop(prev));
  }, []);

  const handleRotate = useCallback((direction: 1 | -1 = 1) => {
    setGameState(prev => rotate(prev, direction));
  }, []);

  const handleHold = useCallback(() => {
    setGameState(prev => holdPieceAction(prev));
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => togglePause(prev));
  }, []);

  return {
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
  };
}
