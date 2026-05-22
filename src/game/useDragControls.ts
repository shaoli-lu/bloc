// ============================================
// BLOC — Drag Controls Hook
// Inspired by play.tetris.com touch UX
// ============================================
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface DragControlHandlers {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotate: (dir: 1 | -1) => void;
  onHold: () => void;
  enabled: boolean;
}

// Pixels the finger must move per column step (roughly cell size)
const COL_THRESHOLD = 28;
// Pixels per soft-drop row step
const ROW_THRESHOLD = 28;
// Max distance to count as a tap (no intentional drag)
const TAP_MAX_DIST = 12;
// Max ms to count as a tap
const TAP_MAX_MS = 250;
// Min px/ms to count as a hard-drop flick
const FLICK_VELOCITY = 0.8;
// Min px for a flick to be valid
const FLICK_MIN_DIST = 40;
// Min px upward for hold gesture
const HOLD_MIN_DIST = 50;

export function useDragControls(
  elementRef: React.RefObject<HTMLElement | null>,
  handlers: DragControlHandlers
) {
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);

  // Accumulated sub-threshold movement
  const accXRef = useRef(0);
  const accYRef = useRef(0);

  // Track last velocity for flick detection
  const lastTouchRef = useRef<{ y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!handlers.enabled) return;
    e.preventDefault();
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    lastTouchRef.current = { y: t.clientY, time: Date.now() };
    accXRef.current = 0;
    accYRef.current = 0;
  }, [handlers.enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!handlers.enabled || !touchStartRef.current) return;
    e.preventDefault();

    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    // Update velocity tracking
    lastTouchRef.current = { y: t.clientY, time: Date.now() };

    // Determine dominant axis for this gesture
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      // Horizontal movement dominates — move piece left/right
      // Accumulate into accX
      const totalX = dx;
      const steps = Math.trunc(totalX / COL_THRESHOLD);
      const remainder = totalX - steps * COL_THRESHOLD;

      const prevSteps = Math.trunc(accXRef.current / COL_THRESHOLD);
      accXRef.current = totalX;
      const newSteps = Math.trunc(accXRef.current / COL_THRESHOLD);
      const delta = newSteps - prevSteps;

      if (delta > 0) {
        for (let i = 0; i < delta; i++) handlers.onMoveRight();
      } else if (delta < 0) {
        for (let i = 0; i < -delta; i++) handlers.onMoveLeft();
      }
      void remainder; // suppress unused warning
    } else {
      // Vertical movement dominates — soft drop
      if (dy > 0) {
        const prevSteps = Math.trunc(accYRef.current / ROW_THRESHOLD);
        accYRef.current = dy;
        const newSteps = Math.trunc(accYRef.current / ROW_THRESHOLD);
        const delta = newSteps - prevSteps;
        for (let i = 0; i < delta; i++) handlers.onSoftDrop();
      }
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!handlers.enabled || !touchStartRef.current) return;
    e.preventDefault();

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const totalDist = Math.sqrt(dx * dx + dy * dy);

    // Tap → rotate
    if (totalDist < TAP_MAX_DIST && dt < TAP_MAX_MS) {
      handlers.onRotate(1);
      touchStartRef.current = null;
      return;
    }

    // Upward swipe → hold
    if (dy < -HOLD_MIN_DIST && absDy > absDx) {
      handlers.onHold();
      touchStartRef.current = null;
      return;
    }

    // Downward flick → hard drop
    if (dy > FLICK_MIN_DIST && absDy > absDx && lastTouchRef.current) {
      const timeSinceLastMove = Date.now() - lastTouchRef.current.time;
      // If finger is still moving fast (low time since last move event)
      // or overall velocity is high, treat as flick
      const overallVelocity = dy / dt;
      if (overallVelocity > FLICK_VELOCITY || timeSinceLastMove < 80) {
        handlers.onHardDrop();
        touchStartRef.current = null;
        return;
      }
    }

    touchStartRef.current = null;
    accXRef.current = 0;
    accYRef.current = 0;
  }, [handlers]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
