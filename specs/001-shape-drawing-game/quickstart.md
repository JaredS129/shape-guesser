# Quickstart Guide: Shape Drawing Game

**Feature**: Shape Drawing Game
**Last Updated**: 2025-10-22
**For**: Developers implementing this feature

## Overview

This guide provides step-by-step instructions for implementing the Shape Drawing Game feature using Test-Driven Development (TDD) as mandated by the project constitution.

---

## Prerequisites

**Required Knowledge:**
- React 18+ with TypeScript
- HTML5 Canvas API basics
- Vitest testing framework
- Repository pattern

**Development Environment:**
- Node.js 18+ installed
- Git initialized repository
- Code editor with TypeScript support

---

## Phase 1: Project Setup (30 minutes)

### 1.1 Initialize React + TypeScript + Vite

```bash
# Create React app with Vite
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install

# Install Material UI
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 1.2 Install Testing Dependencies

```bash
# Install Vitest and testing utilities
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event vitest-canvas-mock jsdom
npm install -D @vitest/ui @vitest/coverage-v8
```

### 1.3 Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import 'vitest-canvas-mock'
```

### 1.4 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 1.5 Create Project Structure

```bash
mkdir -p src/{components,repositories,services,models,utils}
mkdir -p src/repositories/interfaces
mkdir -p src/test
mkdir -p tests/{unit/services,unit/utils,integration,components}
```

### 1.6 Verify Setup

```bash
# Run development server
npm run dev

# Run tests (should show 0 tests)
npm run test
```

---

## Phase 2: Core Data Models (TDD, 1 hour)

### 2.1 Create Type Definitions

**File**: `src/models/enums.ts`

```typescript
export enum RoundStatus {
  DRAWING = 'DRAWING',
  SUBMITTED = 'SUBMITTED',
  SCORED = 'SCORED',
  COMPLETED = 'COMPLETED'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum ScoringMethod {
  AREA_BASED = 'AREA_BASED',
  EDGE_BASED = 'EDGE_BASED',
  HYBRID = 'HYBRID'
}
```

**File**: `src/models/types.ts`

```typescript
import { DifficultyLevel, RoundStatus, ScoringMethod } from './enums';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  strokeId: string;
  points: Point[];
  timestamp: Date;
  pressure: number[];
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface DrawingMetadata {
  strokeCount: number;
  totalPoints: number;
  drawingDuration: number;
  averageStrokeLength: number;
}

export interface PlayerDrawing {
  drawingId: string;
  strokes: Stroke[];
  canvasBounds: CanvasDimensions;
  isEmpty: boolean;
  bitmap: string | null;
  metadata: DrawingMetadata;
}

export interface ScoreBreakdown {
  areaCoverage: number;
  shapeAccuracy: number;
  positioning: number;
  method: ScoringMethod;
}

export interface SimilarityScore {
  scoreId: string;
  overallScore: number;
  breakdown: ScoreBreakdown;
  calculationTime: number;
  timestamp: Date;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeDisplayProps {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export type ShapeDefinition = PathDefinition | SVGDefinition | FunctionDefinition;

export interface PathDefinition {
  type: 'path';
  commands: any[];
  bounds: BoundingBox;
}

export interface SVGDefinition {
  type: 'svg';
  svgPath: string;
  viewBox: { width: number; height: number };
}

export interface FunctionDefinition {
  type: 'function';
  shapeType: 'circle' | 'rectangle' | 'ellipse';
  parameters: Record<string, number>;
}

export interface TargetShape {
  shapeId: string;
  name: string;
  difficulty: DifficultyLevel;
  definition: ShapeDefinition;
  displayProperties: ShapeDisplayProps;
}

export interface Round {
  roundId: string;
  roundNumber: number;
  targetShape: TargetShape;
  playerDrawing: PlayerDrawing | null;
  similarityScore: SimilarityScore | null;
  status: RoundStatus;
  startTime: Date;
  submitTime: Date | null;
  duration: number | null;
}

export interface SessionStatistics {
  totalRounds: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalDuration: number;
  averageRoundDuration: number;
  scoreHistory: number[];
}

export interface GameSession {
  sessionId: string;
  startTime: Date;
  rounds: Round[];
  statistics: SessionStatistics;
  difficulty: DifficultyLevel;
  currentRound: Round | null;
}
```

**File**: `src/models/index.ts`

```typescript
export * from './types';
export * from './enums';
```

### 2.2 Create Utility Functions (TDD)

**Test First**: `tests/unit/utils/idGenerator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../../src/utils/idGenerator';

describe('generateUUID', () => {
  it('should generate a valid UUID v4', () => {
    const uuid = generateUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });
});
```

**Run Test (Should Fail - RED)**:
```bash
npm run test
```

**Implementation**: `src/utils/idGenerator.ts`

```typescript
export function generateUUID(): string {
  return crypto.randomUUID();
}
```

**Run Test Again (Should Pass - GREEN)**: Tests should now pass.

### 2.3 Create Shape Definitions (TDD)

**Test First**: `tests/unit/utils/shapeDefinitions.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { DifficultyLevel } from '../../../src/models';
import { getAllShapes, getShapesByDifficulty } from '../../../src/utils/shapeDefinitions';

describe('shapeDefinitions', () => {
  it('should have at least 10 shapes total', () => {
    const shapes = getAllShapes();
    expect(shapes.length).toBeGreaterThanOrEqual(10);
  });

  it('should have at least 4 easy shapes', () => {
    const easyShapes = getShapesByDifficulty(DifficultyLevel.EASY);
    expect(easyShapes.length).toBeGreaterThanOrEqual(4);
  });

  it('should have shapes with proper difficulty classification', () => {
    const mediumShapes = getShapesByDifficulty(DifficultyLevel.MEDIUM);
    mediumShapes.forEach(shape => {
      expect(shape.difficulty).toBe(DifficultyLevel.MEDIUM);
    });
  });

  it('should have unique shape IDs', () => {
    const shapes = getAllShapes();
    const ids = shapes.map(s => s.shapeId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(shapes.length);
  });
});
```

**Run Test (Should Fail - RED)**: Create the implementation.

**Implementation**: `src/utils/shapeDefinitions.ts`

```typescript
import { TargetShape, DifficultyLevel } from '../models';

const shapes: TargetShape[] = [
  // Easy shapes
  {
    shapeId: 'circle',
    name: 'Circle',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'function',
      shapeType: 'circle',
      parameters: { radius: 50 }
    },
    displayProperties: {
      fillColor: '#2196F3',
      strokeColor: '#1976D2',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'square',
    name: 'Square',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'function',
      shapeType: 'rectangle',
      parameters: { width: 100, height: 100 }
    },
    displayProperties: {
      fillColor: '#4CAF50',
      strokeColor: '#388E3C',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  // Add remaining shapes (triangle, rectangle, pentagon, hexagon, etc.)
  // ... (implement all 10+ shapes as defined in data-model.md)
];

export function getAllShapes(): TargetShape[] {
  return shapes;
}

export function getShapesByDifficulty(level: DifficultyLevel): TargetShape[] {
  return shapes.filter(shape => shape.difficulty === level);
}

export function getRandomShape(level: DifficultyLevel): TargetShape {
  const filtered = getShapesByDifficulty(level);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
```

**Run Test (Should Pass - GREEN)**: Implement all shapes to pass tests.

---

## Phase 3: Repository Layer (TDD, 1 hour)

### 3.1 Define Repository Interfaces

**File**: `src/repositories/interfaces/GameSessionRepository.ts`

```typescript
import { GameSession, DifficultyLevel } from '../../models';

export interface GameSessionRepository {
  getCurrentSession(): GameSession | null;
  createSession(difficulty: DifficultyLevel): GameSession;
  updateSession(session: GameSession): void;
  clearSession(): void;
}
```

**File**: `src/repositories/interfaces/ShapeRepository.ts`

```typescript
import { TargetShape, DifficultyLevel } from '../../models';

export interface ShapeRepository {
  getShapesByDifficulty(level: DifficultyLevel): TargetShape[];
  getRandomShape(level: DifficultyLevel): TargetShape;
  getAllShapes(): TargetShape[];
}
```

### 3.2 Implement In-Memory Repositories (TDD)

**Test First**: `tests/unit/repositories/InMemoryGameSessionRepository.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGameSessionRepository } from '../../../src/repositories/InMemoryGameSessionRepository';
import { DifficultyLevel } from '../../../src/models';

describe('InMemoryGameSessionRepository', () => {
  let repository: InMemoryGameSessionRepository;

  beforeEach(() => {
    repository = new InMemoryGameSessionRepository();
  });

  it('should return null when no session exists', () => {
    expect(repository.getCurrentSession()).toBeNull();
  });

  it('should create a new session with given difficulty', () => {
    const session = repository.createSession(DifficultyLevel.EASY);

    expect(session.sessionId).toBeTruthy();
    expect(session.difficulty).toBe(DifficultyLevel.EASY);
    expect(session.rounds).toEqual([]);
    expect(session.currentRound).toBeNull();
  });

  it('should store and retrieve created session', () => {
    const created = repository.createSession(DifficultyLevel.MEDIUM);
    const retrieved = repository.getCurrentSession();

    expect(retrieved).toEqual(created);
  });

  it('should update existing session', () => {
    const session = repository.createSession(DifficultyLevel.EASY);
    const updated = { ...session, rounds: [/* mock round */] };

    repository.updateSession(updated);
    const retrieved = repository.getCurrentSession();

    expect(retrieved?.rounds.length).toBe(1);
  });

  it('should clear session', () => {
    repository.createSession(DifficultyLevel.HARD);
    repository.clearSession();

    expect(repository.getCurrentSession()).toBeNull();
  });
});
```

**Run Test (Should Fail - RED)**: Implement the repository.

**Implementation**: `src/repositories/InMemoryGameSessionRepository.ts`

```typescript
import { GameSession, DifficultyLevel, SessionStatistics } from '../models';
import { GameSessionRepository } from './interfaces/GameSessionRepository';
import { generateUUID } from '../utils/idGenerator';

export class InMemoryGameSessionRepository implements GameSessionRepository {
  private currentSession: GameSession | null = null;

  getCurrentSession(): GameSession | null {
    return this.currentSession;
  }

  createSession(difficulty: DifficultyLevel): GameSession {
    const emptyStatistics: SessionStatistics = {
      totalRounds: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalDuration: 0,
      averageRoundDuration: 0,
      scoreHistory: []
    };

    this.currentSession = {
      sessionId: generateUUID(),
      startTime: new Date(),
      rounds: [],
      statistics: emptyStatistics,
      difficulty,
      currentRound: null
    };

    return this.currentSession;
  }

  updateSession(session: GameSession): void {
    this.currentSession = session;
  }

  clearSession(): void {
    this.currentSession = null;
  }
}
```

**Run Test (Should Pass - GREEN)**: Tests should pass.

**Repeat TDD Process** for `InMemoryShapeRepository` (similar pattern).

---

## Phase 4: Business Logic Services (TDD, 2-3 hours)

### 4.1 Scoring Service (Critical Component)

**Test First**: `tests/unit/services/ScoringService.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateAreaSimilarity } from '../../../src/services/ScoringService';
import { PlayerDrawing, TargetShape } from '../../../src/models';

describe('ScoringService - calculateAreaSimilarity', () => {
  it('should return 0 for empty drawing', () => {
    const emptyDrawing: PlayerDrawing = {
      /* mock empty drawing */
      isEmpty: true,
      strokes: []
    };
    const targetShape: TargetShape = {
      /* mock target */
    };

    const score = calculateAreaSimilarity(emptyDrawing, targetShape);

    expect(score).toBe(0);
  });

  it('should return 100 for perfect match', () => {
    // Mock perfect drawing matching target
    const score = calculateAreaSimilarity(perfectDrawing, targetShape);
    expect(score).toBe(100);
  });

  it('should return score between 0-100 for partial match', () => {
    const score = calculateAreaSimilarity(partialDrawing, targetShape);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('should be deterministic for same input', () => {
    const score1 = calculateAreaSimilarity(drawing, target);
    const score2 = calculateAreaSimilarity(drawing, target);
    expect(score1).toBe(score2);
  });

  it('should complete within 1 second', () => {
    const startTime = Date.now();
    calculateAreaSimilarity(drawing, target);
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(1000);
  });
});
```

**Run Test (Should Fail - RED)**: Implement scoring algorithm.

**Implementation**: `src/services/ScoringService.ts`

```typescript
import { PlayerDrawing, TargetShape, SimilarityScore, ScoringMethod } from '../models';
import { generateUUID } from '../utils/idGenerator';

export function calculateAreaSimilarity(
  drawing: PlayerDrawing,
  target: TargetShape
): number {
  // Handle empty drawing (per FR-012)
  if (drawing.isEmpty) {
    return 0;
  }

  // Algorithm: Convert both to bitmaps, compare pixel overlap
  const drawingBitmap = convertDrawingToBitmap(drawing);
  const targetBitmap = convertShapeToBitmap(target);

  const overlapPixels = countOverlappingPixels(drawingBitmap, targetBitmap);
  const totalTargetPixels = countFilledPixels(targetBitmap);

  const similarity = (overlapPixels / totalTargetPixels) * 100;
  return Math.round(Math.min(100, Math.max(0, similarity)));
}

export function createSimilarityScore(
  drawing: PlayerDrawing,
  target: TargetShape
): SimilarityScore {
  const startTime = Date.now();
  const overallScore = calculateAreaSimilarity(drawing, target);
  const calculationTime = Date.now() - startTime;

  return {
    scoreId: generateUUID(),
    overallScore,
    breakdown: {
      areaCoverage: overallScore,
      shapeAccuracy: overallScore, // Simplified for MVP
      positioning: overallScore,   // Simplified for MVP
      method: ScoringMethod.AREA_BASED
    },
    calculationTime,
    timestamp: new Date()
  };
}

// Helper functions (implement based on algorithm)
function convertDrawingToBitmap(drawing: PlayerDrawing): ImageData {
  // Use drawing.bitmap or render strokes to canvas
}

function convertShapeToBitmap(target: TargetShape): ImageData {
  // Render target shape to canvas, extract ImageData
}

function countOverlappingPixels(bitmap1: ImageData, bitmap2: ImageData): number {
  // Compare pixel data, count overlapping filled pixels
}

function countFilledPixels(bitmap: ImageData): number {
  // Count non-transparent pixels
}
```

**Run Test (Should Pass - GREEN)**: Refine algorithm until tests pass.

### 4.2 Game Engine Service

Follow same TDD pattern for `GameEngine.ts`:
- Write tests for round lifecycle (start, submit, complete)
- Write tests for statistics calculation
- Write tests for difficulty-based shape selection
- Implement each feature to pass tests

---

## Phase 5: React Components (TDD, 3-4 hours)

### 5.1 Drawing Canvas Component

**Test First**: `tests/components/DrawingCanvas.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DrawingCanvas } from '../../src/components/DrawingCanvas';

describe('DrawingCanvas', () => {
  it('should render canvas element', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);
    const canvas = screen.getByRole('img'); // Canvas has img role
    expect(canvas).toBeInTheDocument();
  });

  it('should call onSubmit when submit button clicked', () => {
    const handleSubmit = vi.fn();
    render(<DrawingCanvas onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it('should clear strokes when clear button clicked', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);

    // Draw something (simulate)
    const canvas = screen.getByRole('img');
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    // Clear
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    // Verify canvas cleared (check state or visual)
  });

  it('should support undo last stroke', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);

    // Draw two strokes
    // Undo once
    // Verify only first stroke remains
  });
});
```

**Run Test (Should Fail - RED)**: Implement component.

**Implementation**: `src/components/DrawingCanvas.tsx`

```typescript
import React, { useRef, useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { Stroke, Point, PlayerDrawing } from '../models';
import { generateUUID } from '../utils/idGenerator';

interface DrawingCanvasProps {
  onSubmit: (drawing: PlayerDrawing) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Drawing handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const point = getMousePosition(e);
    setCurrentStroke([point]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const point = getMousePosition(e);
    setCurrentStroke(prev => prev ? [...prev, point] : [point]);
  };

  const handleMouseUp = () => {
    if (currentStroke && currentStroke.length > 1) {
      const stroke: Stroke = {
        strokeId: generateUUID(),
        points: currentStroke,
        timestamp: new Date(),
        pressure: new Array(currentStroke.length).fill(1.0)
      };
      setStrokes([...strokes, stroke]);
    }
    setCurrentStroke(null);
    setIsDrawing(false);
  };

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all completed strokes
    strokes.forEach(stroke => {
      drawStroke(ctx, stroke.points);
    });

    // Draw current stroke
    if (currentStroke) {
      drawStroke(ctx, currentStroke);
    }
  }, [strokes, currentStroke]);

  // Actions
  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke(null);
  };

  const handleUndo = () => {
    if (strokes.length > 0) {
      setStrokes(strokes.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    const drawing: PlayerDrawing = {
      drawingId: generateUUID(),
      strokes,
      canvasBounds: { width: 800, height: 600 },
      isEmpty: strokes.length === 0,
      bitmap: canvasRef.current?.toDataURL() || null,
      metadata: calculateMetadata(strokes)
    };
    onSubmit(drawing);
  };

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
      />
      <Box mt={2}>
        <Button onClick={handleClear} variant="outlined">Clear</Button>
        <Button onClick={handleUndo} variant="outlined" disabled={strokes.length === 0}>
          Undo
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

// Helper functions
function getMousePosition(e: React.MouseEvent): Point {
  const canvas = e.currentTarget as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function drawStroke(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function calculateMetadata(strokes: Stroke[]): DrawingMetadata {
  // Implementation
}
```

**Run Test (Should Pass - GREEN)**: Refine component.

### 5.2 Additional Components

Follow same TDD process for:
- `ResultsDisplay.tsx` - Shows score and comparison
- `SessionStats.tsx` - Displays session statistics
- `DifficultySelector.tsx` - Difficulty level chooser
- `GameContainer.tsx` - Main game orchestration component

---

## Phase 6: Integration & Polish (2 hours)

### 6.1 Game Context Provider

```typescript
// src/context/GameContext.tsx
import React, { createContext, useReducer, useContext } from 'react';
import { GameSession, DifficultyLevel } from '../models';
import { InMemoryGameSessionRepository } from '../repositories/InMemoryGameSessionRepository';

// Define context, reducer, provider
// Wire up to repository layer
```

### 6.2 Main App Integration

```typescript
// src/App.tsx
import { GameProvider } from './context/GameContext';
import { GameContainer } from './components/GameContainer';

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}
```

### 6.3 Run Full Test Suite

```bash
# Run all tests
npm run test:run

# Check coverage
npm run test:coverage

# Should aim for >80% coverage on critical paths (services, repositories)
```

---

## Validation Checklist

Before considering implementation complete:

- [ ] All unit tests pass
- [ ] All component tests pass
- [ ] All integration tests pass
- [ ] Test coverage >80% on services and repositories
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Constitution compliance verified:
  - [ ] All identifiers use descriptive names
  - [ ] Functions are small and focused (<20 lines typical)
  - [ ] Tests were written before implementation (TDD followed)
- [ ] User Story 1 (P1) fully functional end-to-end
- [ ] Performance requirements met:
  - [ ] Canvas renders at 60fps
  - [ ] Score calculation <1 second
  - [ ] Input latency <50ms
- [ ] All functional requirements (FR-001 through FR-013) implemented
- [ ] Edge cases handled (empty canvas, clear, undo)

---

## Next Steps After Implementation

1. **Generate tasks**: Run `/speckit.tasks` to create implementation task list
2. **Implement tasks**: Follow TDD workflow, mark tasks complete as you go
3. **User Story 2 (P2)**: Extend to multiple rounds and statistics tracking
4. **User Story 3 (P3)**: Add difficulty levels
5. **Polish**: Improve UI/UX with Material UI components, animations, feedback

---

## Troubleshooting

**Issue**: Canvas not rendering strokes
- Check `useEffect` dependencies include `strokes` and `currentStroke`
- Verify `drawStroke` function is called correctly
- Check browser console for canvas context errors

**Issue**: Tests failing with "canvas.getContext is not a function"
- Ensure `vitest-canvas-mock` is imported in `src/test/setup.ts`
- Verify `setupFiles` configured in `vitest.config.ts`

**Issue**: Scoring calculation too slow
- Reduce bitmap resolution (e.g., 200x200 instead of 800x600)
- Optimize pixel comparison loop
- Consider using WebWorker for scoring (future enhancement)

**Issue**: TypeScript errors in models
- Run `npm run build` to check full type coverage
- Ensure all imports from `src/models/index.ts`

---

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [Material UI Components](https://mui.com/material-ui/getting-started/)
- [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [TDD Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Remember**: Follow TDD religiously. Red → Green → Refactor. Tests first, always.
