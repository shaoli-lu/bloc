// ============================================
// BLOC — Game Engine (Pure Logic)
// ============================================

export const ROWS = 20;
export const COLS = 10;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type CellValue = PieceType | null;

export type Board = CellValue[][];

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: PieceType;
  shape: number[][];
  position: Position;
  rotation: number;
}

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPieces: PieceType[];
  holdPiece: PieceType | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  clearingRows: number[];
  combo: number;
}

// ---- Tetromino Shapes (SRS) ----
const SHAPES: Record<PieceType, number[][][]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ],
};

// ---- SRS Wall Kick Data ----
const WALL_KICKS: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '1>0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '1>2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '2>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '2>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '3>2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '3>0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '0>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
};

const I_WALL_KICKS: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '1>0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '1>2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
  '2>1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '2>3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '3>2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '3>0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '0>3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
};

// ---- Scoring ----
const LINE_SCORES = [0, 100, 300, 500, 800]; // 0, single, double, triple, tetris
const COMBO_BONUS = 50;
const SOFT_DROP_SCORE = 1;
const HARD_DROP_SCORE = 2;

// ---- Bag Randomizer (7-bag) ----
function shuffleBag(): PieceType[] {
  const bag: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

// ---- Helpers ----
export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function createPiece(type: PieceType): Piece {
  const shape = SHAPES[type][0];
  const col = Math.floor((COLS - shape[0].length) / 2);
  return {
    type,
    shape,
    rotation: 0,
    position: { row: type === 'I' ? -1 : 0, col },
  };
}

function isValidPosition(board: Board, piece: Piece, rowOffset = 0, colOffset = 0): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const newRow = piece.position.row + r + rowOffset;
      const newCol = piece.position.col + c + colOffset;
      if (newRow < 0) continue; // allow spawning above board
      if (newRow >= ROWS || newCol < 0 || newCol >= COLS) return false;
      if (board[newRow][newCol]) return false;
    }
  }
  return true;
}

export function getGhostPosition(board: Board, piece: Piece): number {
  let offset = 0;
  while (isValidPosition(board, piece, offset + 1, 0)) {
    offset++;
  }
  return offset;
}

function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const row = piece.position.row + r;
      const col = piece.position.col + c;
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        newBoard[row][col] = piece.type;
      }
    }
  }
  return newBoard;
}

function findFullRows(board: Board): number[] {
  const fullRows: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every(cell => cell !== null)) {
      fullRows.push(r);
    }
  }
  return fullRows;
}

function clearRows(board: Board, rows: number[]): Board {
  const newBoard = board.map(row => [...row]);
  const sortedRows = [...rows].sort((a, b) => a - b);
  for (const row of sortedRows) {
    newBoard.splice(row, 1);
    newBoard.unshift(Array(COLS).fill(null));
  }
  return newBoard;
}

// ---- Game State Factory ----
export function createInitialState(): GameState {
  const bag1 = shuffleBag();
  const bag2 = shuffleBag();
  const allPieces = [...bag1, ...bag2];
  const firstType = allPieces.shift()!;

  return {
    board: createEmptyBoard(),
    currentPiece: createPiece(firstType),
    nextPieces: allPieces,
    holdPiece: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    isGameOver: false,
    isPaused: false,
    clearingRows: [],
    combo: -1,
  };
}

// ---- Actions ----
function getNextPiece(state: GameState): { piece: Piece; nextPieces: PieceType[] } {
  const nextPieces = [...state.nextPieces];
  if (nextPieces.length < 7) {
    nextPieces.push(...shuffleBag());
  }
  const nextType = nextPieces.shift()!;
  return { piece: createPiece(nextType), nextPieces };
}

export function moveLeft(state: GameState): GameState {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state;
  if (isValidPosition(state.board, state.currentPiece, 0, -1)) {
    return {
      ...state,
      currentPiece: {
        ...state.currentPiece,
        position: {
          ...state.currentPiece.position,
          col: state.currentPiece.position.col - 1,
        },
      },
    };
  }
  return state;
}

export function moveRight(state: GameState): GameState {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state;
  if (isValidPosition(state.board, state.currentPiece, 0, 1)) {
    return {
      ...state,
      currentPiece: {
        ...state.currentPiece,
        position: {
          ...state.currentPiece.position,
          col: state.currentPiece.position.col + 1,
        },
      },
    };
  }
  return state;
}

export function moveDown(state: GameState): { state: GameState; locked: boolean } {
  if (!state.currentPiece || state.isGameOver || state.isPaused) {
    return { state, locked: false };
  }
  if (isValidPosition(state.board, state.currentPiece, 1, 0)) {
    return {
      state: {
        ...state,
        currentPiece: {
          ...state.currentPiece,
          position: {
            ...state.currentPiece.position,
            row: state.currentPiece.position.row + 1,
          },
        },
      },
      locked: false,
    };
  }
  // Lock the piece
  return { state: lockAndSpawnNext(state), locked: true };
}

export function softDrop(state: GameState): { state: GameState; locked: boolean } {
  const result = moveDown(state);
  if (!result.locked) {
    result.state = { ...result.state, score: result.state.score + SOFT_DROP_SCORE };
  }
  return result;
}

export function hardDrop(state: GameState): GameState {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state;
  const ghostOffset = getGhostPosition(state.board, state.currentPiece);
  const droppedPiece: Piece = {
    ...state.currentPiece,
    position: {
      ...state.currentPiece.position,
      row: state.currentPiece.position.row + ghostOffset,
    },
  };
  const newState = {
    ...state,
    currentPiece: droppedPiece,
    score: state.score + ghostOffset * HARD_DROP_SCORE,
  };
  return lockAndSpawnNext(newState);
}

export function rotate(state: GameState, direction: 1 | -1 = 1): GameState {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state;
  const piece = state.currentPiece;
  const fromRot = piece.rotation;
  const toRot = ((fromRot + direction) % 4 + 4) % 4;
  const newShape = SHAPES[piece.type][toRot];
  const kickKey = `${fromRot}>${toRot}`;
  const kicks = piece.type === 'I' ? I_WALL_KICKS[kickKey] : WALL_KICKS[kickKey];

  if (!kicks) return state;

  for (const [dx, dy] of kicks) {
    const testPiece: Piece = {
      ...piece,
      shape: newShape,
      rotation: toRot,
      position: { row: piece.position.row - dy, col: piece.position.col + dx },
    };
    if (isValidPosition(state.board, testPiece)) {
      return { ...state, currentPiece: testPiece };
    }
  }
  return state;
}

export function holdPiece(state: GameState): GameState {
  if (!state.currentPiece || !state.canHold || state.isGameOver || state.isPaused) return state;
  const currentType = state.currentPiece.type;
  if (state.holdPiece) {
    const swapPiece = createPiece(state.holdPiece);
    return {
      ...state,
      currentPiece: swapPiece,
      holdPiece: currentType,
      canHold: false,
    };
  } else {
    const { piece, nextPieces } = getNextPiece(state);
    return {
      ...state,
      currentPiece: piece,
      holdPiece: currentType,
      canHold: false,
      nextPieces,
    };
  }
}

function lockAndSpawnNext(state: GameState): GameState {
  if (!state.currentPiece) return state;

  const board = lockPiece(state.board, state.currentPiece);
  const fullRows = findFullRows(board);

  if (fullRows.length > 0) {
    const linesCleared = fullRows.length;
    const newCombo = state.combo + 1;
    const lineScore = LINE_SCORES[linesCleared] * state.level;
    const comboScore = newCombo > 0 ? COMBO_BONUS * newCombo * state.level : 0;
    const totalScore = state.score + lineScore + comboScore;
    const totalLines = state.lines + linesCleared;
    const newLevel = Math.floor(totalLines / 10) + 1;

    return {
      ...state,
      board,
      currentPiece: null,
      score: totalScore,
      lines: totalLines,
      level: newLevel,
      clearingRows: fullRows,
      combo: newCombo,
      canHold: true,
    };
  }

  // No lines cleared
  const { piece, nextPieces } = getNextPiece(state);

  if (!isValidPosition(board, piece)) {
    return {
      ...state,
      board,
      currentPiece: null,
      nextPieces,
      isGameOver: true,
      combo: -1,
      canHold: true,
    };
  }

  return {
    ...state,
    board,
    currentPiece: piece,
    nextPieces,
    clearingRows: [],
    combo: -1,
    canHold: true,
  };
}

export function finalizeClear(state: GameState): GameState {
  if (state.clearingRows.length === 0) return state;

  const clearedBoard = clearRows(state.board, state.clearingRows);
  const { piece, nextPieces } = getNextPiece(state);

  if (!isValidPosition(clearedBoard, piece)) {
    return {
      ...state,
      board: clearedBoard,
      currentPiece: null,
      nextPieces,
      isGameOver: true,
      clearingRows: [],
    };
  }

  return {
    ...state,
    board: clearedBoard,
    currentPiece: piece,
    nextPieces,
    clearingRows: [],
  };
}

export function togglePause(state: GameState): GameState {
  if (state.isGameOver) return state;
  return { ...state, isPaused: !state.isPaused };
}

export function getDropInterval(level: number): number {
  // NES-style speed curve (ms)
  const speeds = [800, 720, 630, 550, 470, 380, 300, 220, 140, 100, 80, 80, 80, 70, 70, 70, 50, 50, 50, 30];
  return speeds[Math.min(level - 1, speeds.length - 1)];
}

export function getShapeForType(type: PieceType): number[][] {
  return SHAPES[type][0];
}
