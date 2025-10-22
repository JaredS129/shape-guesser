# Research: Shape Drawing Game Technical Decisions

**Feature**: Shape Drawing Game
**Date**: 2025-10-22
**Status**: Complete

## Overview

This document captures technical research and decisions made during the planning phase to resolve NEEDS CLARIFICATION items from the Technical Context section.

---

## Decision 1: Canvas Rendering Library

### Question
Which canvas library should be used for the drawing interface: native HTML5 Canvas, react-canvas-draw, Konva, or Fabric.js?

### Decision
**Native HTML5 Canvas with React refs**

### Rationale

**Performance Requirements Met:**
- Achieves required 60fps canvas rendering through direct Canvas API access
- Input latency well under 50ms threshold (can draw directly in event handlers)
- Zero bundle size overhead (0 KB) - critical for fast load times
- Native `toDataURL()` highly optimized for bitmap export needed by scoring algorithm

**Feature Requirements Alignment:**
- Stroke capture: Simple array of stroke objects in React state
- Undo last stroke: Trivial array manipulation (`strokes.slice(0, -1)`)
- Clear all: Simple state reset (`setStrokes([])`)
- Bitmap conversion: Native API (`canvas.toDataURL()`)

**Architecture Benefits:**
- No external dependencies to maintain or upgrade
- No risk of library abandonment (unlike react-canvas-draw, unmaintained since 2021)
- Future-proof - works with any React version
- Full control for game-specific optimizations
- Aligns with constitution principle of simplicity

**Complexity Assessment:**
- Project requirements are straightforward: capture simple shape drawings
- Not building a complex design tool - don't need layers, transformations, animations
- Konva (98.4 KB) and Fabric.js (95.7 KB) are overkill for this use case
- Implementation effort is medium but provides maximum control and performance

### Alternatives Considered

**react-canvas-draw:**
- ❌ Rejected: Unmaintained for 4 years (last published 2021), security concerns, compatibility risks with React 18+

**Konva with react-konva:**
- ⚠️ Second choice: Excellent library with good React integration (13,499 stars, 693K weekly downloads)
- Pros: Declarative React patterns, built-in optimizations, active maintenance
- Cons: 98.4 KB bundle size, abstraction overhead, overkill for simple drawing game
- Could revisit if complex shape manipulation needed in future

**Fabric.js with react-fabricjs:**
- ❌ Rejected: Poor React integration (unofficial wrapper unmaintained), 95.7 KB bundle, designed for complex design tools not games, no tree-shaking support

### Implementation Notes

```typescript
// Basic structure approach
interface Stroke {
  points: { x: number; y: number }[];
  timestamp: number;
}

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  // Redraw all strokes when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Clear and redraw logic
  }, [strokes]);

  // Features
  const undo = () => setStrokes(prev => prev.slice(0, -1));
  const clear = () => setStrokes([]);
  const toBitmap = () => canvasRef.current.toDataURL();

  return <canvas ref={canvasRef} />;
};
```

### Testing Approach
- Use canvas mocking library (`vitest-canvas-mock`) for unit tests
- Verify canvas API method calls
- Test stroke capture, undo, clear logic with mocked canvas

---

## Decision 2: Testing Framework

### Question
Which testing framework should be used: Jest + React Testing Library, Vitest + React Testing Library, or Vitest + RTL + Playwright?

### Decision
**Vitest + React Testing Library**

### Rationale

**TDD Workflow Excellence (Critical for Constitution Compliance):**
- Constitution mandates TDD as NON-NEGOTIABLE principle
- Vitest's watch mode is 10-20x faster than Jest - essential for tight TDD feedback loop
- Near-instant test startup with HMR-enabled watch mode
- Smart watch mode reruns only affected tests, not full suite
- Superior developer experience for Red-Green-Refactor cycle

**Project Scale Match:**
- Small-medium codebase (2000-3000 LOC) doesn't require Jest's massive ecosystem
- Vitest provides all needed features without complexity overhead
- Jest's advantages (more Stack Overflow answers) matter less at this scale

**Modern Stack Alignment:**
- Native TypeScript support out of the box (zero configuration)
- First-class ES modules support (no transform setup needed)
- Built for modern React 18+ workflows
- Reuses Vite configuration if present

**Performance Benefits:**
- 3-5x faster test execution than Jest
- 30% lower memory usage (~800MB vs 1.2GB)
- Instant feedback during development
- Lower CI costs

**Setup Simplicity:**
- Minimal configuration required (reuse vite.config.ts)
- Time to first test: 10-20 minutes vs Jest's 30-60 minutes
- No Babel or ts-jest configuration needed
- Perfect for establishing TDD habits from day one

**Canvas Testing Adequacy:**
- `vitest-canvas-mock` uses jest-canvas-mock under the hood
- Sufficient for scoring algorithm and game logic tests
- Supports canvas API mocking and snapshot testing
- Real DOM environment via jsdom

### Alternatives Considered

**Jest + React Testing Library:**
- ❌ Rejected: Much slower watch mode (critical for TDD workflow), complex TypeScript setup, higher memory usage
- Pros: Largest community (34.5M weekly downloads), most Stack Overflow answers, mature ecosystem
- Cons: 3-5x slower tests, 10-20x slower watch mode, stagnant development momentum, ESM challenges

**Vitest + RTL + Playwright (E2E):**
- ⚠️ Future consideration: May add Playwright if project grows beyond 5,000 LOC or complex visual regression needs emerge
- Pros: Complete testing pyramid, real browser canvas testing, visual regression capabilities
- Cons: Overkill for MVP, higher complexity, longer CI times, two frameworks to maintain
- Decision: Start simple, add E2E layer only when needed

### Implementation Setup

**Dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event vitest-canvas-mock jsdom
npm install -D @vitest/ui @vitest/coverage-v8
```

**Configuration (vitest.config.ts):**
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

**Setup file (src/test/setup.ts):**
```typescript
import '@testing-library/jest-dom'
import 'vitest-canvas-mock'
```

**Package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Testing Strategy

**Unit Tests (services/, utils/):**
- Pure JavaScript logic (scoring, game engine, shape comparison)
- Mock canvas data structures
- Fast, isolated tests
- Primary TDD focus

**Component Tests (components/):**
- React components with canvas interactions
- Use vitest-canvas-mock for canvas API
- Verify rendering, event handling, state management
- User event simulation with @testing-library/user-event

**Integration Tests (integration/):**
- Complete user flows (draw → submit → score → next round)
- Multiple components working together
- Session state management across rounds
- Critical path validation

---

## Decision 3: State Management Approach

### Question
How should application state be managed for game sessions and rounds?

### Decision
**React Context + useReducer for game state, local component state for UI concerns**

### Rationale

**Simplicity and Constitution Alignment:**
- No external state management library needed (0 KB overhead)
- React's built-in Context API sufficient for single-player game state
- Follows constitution principle: start simple, YAGNI
- Easier to test with standard React testing patterns

**Separation of Concerns:**
- Game session state (rounds, scores, statistics) in Context
- UI state (canvas drawing, modals, animations) in local component state
- Repository pattern abstracts state persistence interface
- Future backend migration: swap Context provider with API-backed repository

**Scale Appropriate:**
- Single-player game with limited state complexity
- No global state conflicts (one user, one session)
- No performance concerns (not thousands of state updates/second)
- Context re-render optimization straightforward with useMemo

**TDD Benefits:**
- Easy to test Context providers in isolation
- useReducer makes state transitions explicit and testable
- No additional mocking complexity from external libraries

### Implementation Structure

```typescript
// GameContext for session-wide state
interface GameState {
  currentRound: Round | null;
  rounds: Round[];
  statistics: SessionStatistics;
  difficulty: DifficultyLevel;
}

// GameReducer for state transitions
type GameAction =
  | { type: 'START_ROUND'; payload: Round }
  | { type: 'COMPLETE_ROUND'; payload: SimilarityScore }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyLevel };

// Repository pattern for future backend swap
interface GameSessionRepository {
  getCurrentSession(): GameSession | null;
  updateSession(session: GameSession): void;
  clearSession(): void;
}
```

### Alternatives Considered

**Redux/Redux Toolkit:**
- ❌ Rejected: Overkill for single-player game, adds bundle size (~45 KB), unnecessary boilerplate, violates simplicity principle

**Zustand:**
- ⚠️ Minimal option: Small bundle (~3 KB), simple API
- Rejected because: React Context is sufficient, unnecessary dependency, doesn't add meaningful value at this scale

**Jotai/Recoil:**
- ❌ Rejected: Atomic state management overkill for simple game state, adds complexity without benefit

---

## Additional Technical Decisions

### TypeScript Usage
- **Decision**: Full TypeScript for all source code
- **Rationale**: Type safety improves TDD workflow, catches errors at compile time, better IDE support, aligns with constitution's descriptive naming principle
- **Configuration**: Strict mode enabled

### Build Tool
- **Decision**: Vite
- **Rationale**: Fast development server, native ESM, excellent TypeScript support, synergy with Vitest, modern build pipeline
- **Note**: Implicit from Vitest choice; both share configuration

### Material UI Setup
- **Decision**: Use Material UI v5+ with emotion (default styling solution)
- **Components needed**: Button, Card, Typography, Container, Dialog, Chip
- **Rationale**: User specified Material UI; emotion is MUI v5 default
- **Bundle impact**: Tree-shaking reduces size; only import used components

### Shape Similarity Algorithm
- **Decision**: Implement custom area-based comparison using canvas pixel data
- **Approach**:
  1. Convert both target and drawn shapes to equal-sized bitmaps
  2. Compare pixel coverage in overlapping regions
  3. Calculate percentage match (0-100 scale)
- **Rationale**: Matches FR-011 requirement (area coverage comparison), no external library needed, full control over algorithm, deterministic and testable
- **Performance**: Can complete within 1 second requirement by capping bitmap resolution (e.g., 200x200px)

---

## Summary of Resolved Clarifications

| Original Question | Decision | Impact |
|-------------------|----------|--------|
| Canvas rendering library | Native HTML5 Canvas | 0 KB bundle, maximum performance, full control |
| Testing framework | Vitest + React Testing Library | Fast TDD workflow, minimal setup, modern stack alignment |
| State management | React Context + useReducer | Zero dependencies, simple, testable, future-proof |
| TypeScript configuration | Strict mode TypeScript | Type safety, better DX, compile-time error catching |
| Build tool | Vite | Fast dev server, ESM support, Vitest integration |
| Scoring algorithm | Custom area-based pixel comparison | Meets requirements, deterministic, testable |

---

## Technical Context (Updated)

**Language/Version**: TypeScript 5.x with React 18+
**Primary Dependencies**: React 18+, Material UI v5+, Vite
**Storage**: N/A (client-side React Context for in-memory state)
**Testing**: Vitest + React Testing Library + vitest-canvas-mock
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) supporting HTML5 Canvas and ES6+
**Project Type**: Web (frontend-only single-page application)
**Performance Goals**: Canvas rendering at 60fps, similarity calculation under 1 second, UI response under 50ms
**Constraints**: Client-side only (no backend), offline-capable after initial load, responsive design
**Scale/Scope**: Single-user sessions, 10-20 target shapes, 3-5 main components, ~2000-3000 LOC

All NEEDS CLARIFICATION items resolved. Ready for Phase 1 design.
