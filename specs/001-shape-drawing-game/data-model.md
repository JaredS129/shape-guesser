# Data Model: Shape Drawing Game

**Feature**: Shape Drawing Game
**Date**: 2025-10-22
**Status**: Design Complete

## Overview

This document defines the domain entities, their attributes, relationships, and state transitions for the shape drawing game. All entities are represented as TypeScript interfaces/types and managed in-memory using React Context (no backend persistence in MVP).

---

## Entity Definitions

### 1. GameSession

Represents a continuous play session with multiple rounds.

```typescript
interface GameSession {
  sessionId: string;                    // Unique identifier (UUID)
  startTime: Date;                      // When session began
  rounds: Round[];                      // All completed rounds
  statistics: SessionStatistics;        // Aggregated session stats
  difficulty: DifficultyLevel;          // Selected difficulty
  currentRound: Round | null;           // Active round (null if between rounds)
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| sessionId | string | Yes | Unique session identifier | UUID v4 format |
| startTime | Date | Yes | Session start timestamp | ISO 8601 datetime |
| rounds | Round[] | Yes | Collection of completed rounds | Empty array on init |
| statistics | SessionStatistics | Yes | Calculated session stats | Computed from rounds |
| difficulty | DifficultyLevel | Yes | Game difficulty setting | Enum: Easy/Medium/Hard |
| currentRound | Round \| null | Yes | Currently active round | Null when not in round |

**Relationships:**
- Has many `Round` (one-to-many)
- Has one `SessionStatistics` (one-to-one, computed)

**State Lifecycle:**
1. **Initialized**: `sessionId` generated, empty `rounds`, `currentRound` null
2. **Round Active**: `currentRound` populated with new Round
3. **Round Complete**: Round moved from `currentRound` to `rounds` array
4. **Session End**: Statistics finalized, no current round

---

### 2. Round

Represents a single attempt at drawing a shape.

```typescript
interface Round {
  roundId: string;                      // Unique round identifier (UUID)
  roundNumber: number;                  // Sequential number in session (1-based)
  targetShape: TargetShape;             // The hidden shape to match
  playerDrawing: PlayerDrawing | null;  // User's drawing (null before submission)
  similarityScore: SimilarityScore | null; // Grading result (null before submission)
  status: RoundStatus;                  // Current state of round
  startTime: Date;                      // When round began
  submitTime: Date | null;              // When drawing submitted (null if not submitted)
  duration: number | null;              // Time in seconds (null until submitted)
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| roundId | string | Yes | Unique round identifier | UUID v4 format |
| roundNumber | number | Yes | Position in session | Positive integer ≥ 1 |
| targetShape | TargetShape | Yes | Shape to be drawn | See TargetShape definition |
| playerDrawing | PlayerDrawing \| null | Yes | User's drawing data | Null until submission |
| similarityScore | SimilarityScore \| null | Yes | Scoring result | Null until calculated |
| status | RoundStatus | Yes | Round lifecycle state | Enum value |
| startTime | Date | Yes | Round start time | ISO 8601 datetime |
| submitTime | Date \| null | Yes | Drawing submission time | ISO 8601 or null |
| duration | number \| null | Yes | Seconds elapsed | Non-negative number or null |

**Relationships:**
- Belongs to one `GameSession` (many-to-one)
- Has one `TargetShape` (one-to-one)
- Has one `PlayerDrawing` (one-to-one, nullable)
- Has one `SimilarityScore` (one-to-one, nullable)

**State Lifecycle:**
```
DRAWING → SUBMITTED → SCORED → COMPLETED
```

1. **DRAWING**: Round active, player drawing on canvas
2. **SUBMITTED**: Drawing submitted, awaiting scoring
3. **SCORED**: Score calculated, ready to display results
4. **COMPLETED**: Results shown, ready for next round

**Enum: RoundStatus**
```typescript
enum RoundStatus {
  DRAWING = 'DRAWING',      // Player actively drawing
  SUBMITTED = 'SUBMITTED',  // Drawing submitted, scoring in progress
  SCORED = 'SCORED',        // Score calculated, showing results
  COMPLETED = 'COMPLETED'   // Results viewed, ready for next round
}
```

---

### 3. TargetShape

Represents the hidden shape the player must draw.

```typescript
interface TargetShape {
  shapeId: string;                      // Unique shape identifier
  name: string;                         // Human-readable name (e.g., "Circle")
  difficulty: DifficultyLevel;          // Classification level
  definition: ShapeDefinition;          // Geometric specification
  displayProperties: ShapeDisplayProps; // Visual rendering configuration
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| shapeId | string | Yes | Unique shape identifier | Kebab-case string |
| name | string | Yes | Display name | Capitalized string, 3-20 chars |
| difficulty | DifficultyLevel | Yes | Complexity classification | Enum value |
| definition | ShapeDefinition | Yes | Geometric data | See ShapeDefinition |
| displayProperties | ShapeDisplayProps | Yes | Rendering config | See ShapeDisplayProps |

**Relationships:**
- Referenced by `Round` (many rounds can use same shape)

**Shape Definition Types:**

```typescript
type ShapeDefinition = PathDefinition | SVGDefinition | FunctionDefinition;

// Path-based shape (most common)
interface PathDefinition {
  type: 'path';
  commands: PathCommand[];  // SVG path commands
  bounds: BoundingBox;      // Normalized bounding box
}

// SVG string definition
interface SVGDefinition {
  type: 'svg';
  svgPath: string;          // SVG path string
  viewBox: { width: number; height: number };
}

// Function-based shape (for perfect circles, etc.)
interface FunctionDefinition {
  type: 'function';
  shapeType: 'circle' | 'rectangle' | 'ellipse';
  parameters: Record<string, number>;  // e.g., { radius: 50 }
}

interface BoundingBox {
  x: number;      // Normalized 0-1
  y: number;      // Normalized 0-1
  width: number;  // Normalized 0-1
  height: number; // Normalized 0-1
}
```

**Display Properties:**

```typescript
interface ShapeDisplayProps {
  fillColor: string;        // Hex color for filled shape display
  strokeColor: string;      // Hex color for outline
  strokeWidth: number;      // Stroke width in pixels
  opacity: number;          // Opacity 0-1
}
```

**Enum: DifficultyLevel**
```typescript
enum DifficultyLevel {
  EASY = 'EASY',      // Simple geometric forms (circle, square, triangle, rectangle)
  MEDIUM = 'MEDIUM',  // Complex forms (pentagon, hexagon, star, heart)
  HARD = 'HARD'       // Composite/irregular patterns
}
```

**Predefined Shapes (Minimum Required: 10)**

Easy:
- circle
- square
- triangle
- rectangle

Medium:
- pentagon
- hexagon
- star
- heart
- diamond
- oval

Hard:
- house (composite shape)
- arrow
- crescent
- irregular-polygon

---

### 4. PlayerDrawing

Represents the user's drawn input.

```typescript
interface PlayerDrawing {
  drawingId: string;                    // Unique drawing identifier (UUID)
  strokes: Stroke[];                    // Collection of drawn strokes
  canvasBounds: CanvasDimensions;       // Canvas size at draw time
  isEmpty: boolean;                     // True if no strokes
  bitmap: string | null;                // Base64 data URL of canvas bitmap (null until converted)
  metadata: DrawingMetadata;            // Additional drawing info
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| drawingId | string | Yes | Unique identifier | UUID v4 format |
| strokes | Stroke[] | Yes | All drawn strokes | Can be empty array |
| canvasBounds | CanvasDimensions | Yes | Canvas dimensions | Positive integers |
| isEmpty | boolean | Yes | No strokes present | Computed from strokes.length |
| bitmap | string \| null | Yes | Canvas image data | Base64 data URL or null |
| metadata | DrawingMetadata | Yes | Additional info | See DrawingMetadata |

**Stroke Definition:**

```typescript
interface Stroke {
  strokeId: string;           // Unique stroke identifier (UUID)
  points: Point[];            // Sequence of x,y coordinates
  timestamp: Date;            // When stroke was drawn
  pressure: number[];         // Pressure values (for touch) - length matches points
}

interface Point {
  x: number;                  // X coordinate (canvas pixels)
  y: number;                  // Y coordinate (canvas pixels)
}
```

**Canvas Dimensions:**

```typescript
interface CanvasDimensions {
  width: number;              // Canvas width in pixels
  height: number;             // Canvas height in pixels
}
```

**Drawing Metadata:**

```typescript
interface DrawingMetadata {
  strokeCount: number;        // Total number of strokes
  totalPoints: number;        // Total points across all strokes
  drawingDuration: number;    // Time spent drawing in seconds
  averageStrokeLength: number; // Average points per stroke
}
```

**Relationships:**
- Belongs to one `Round` (one-to-one)

**Validation Rules:**
- `isEmpty` is true when `strokes.length === 0`
- `bitmap` must be valid base64 data URL when not null
- Each stroke must have at least 2 points
- Points must be within `canvasBounds`

---

### 5. SimilarityScore

Represents the grading result comparing player drawing to target shape.

```typescript
interface SimilarityScore {
  scoreId: string;                      // Unique score identifier (UUID)
  overallScore: number;                 // Final score 0-100
  breakdown: ScoreBreakdown;            // Detailed scoring components
  calculationTime: number;              // Time taken to calculate (milliseconds)
  timestamp: Date;                      // When score was calculated
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| scoreId | string | Yes | Unique identifier | UUID v4 format |
| overallScore | number | Yes | Final similarity score | Integer 0-100 inclusive |
| breakdown | ScoreBreakdown | Yes | Component scores | See ScoreBreakdown |
| calculationTime | number | Yes | Processing time | Non-negative milliseconds |
| timestamp | Date | Yes | Calculation time | ISO 8601 datetime |

**Score Breakdown:**

```typescript
interface ScoreBreakdown {
  areaCoverage: number;       // Percentage of area overlap (0-100)
  shapeAccuracy: number;      // How well shape outline matches (0-100)
  positioning: number;        // Centering and placement score (0-100)
  method: ScoringMethod;      // Algorithm used
}

enum ScoringMethod {
  AREA_BASED = 'AREA_BASED',  // Internal area coverage comparison (MVP approach)
  EDGE_BASED = 'EDGE_BASED',  // Outline matching (future)
  HYBRID = 'HYBRID'           // Weighted combination (future)
}
```

**Relationships:**
- Belongs to one `Round` (one-to-one)

**Calculation Rules:**
- `overallScore` = primary weight on `areaCoverage` per FR-011
- MVP uses AREA_BASED method exclusively
- Score of 0 assigned for empty drawings (per FR-012)
- Scores deterministic: same drawing → same score (per SC-002)

---

### 6. SessionStatistics

Aggregated statistics for a game session.

```typescript
interface SessionStatistics {
  totalRounds: number;                  // Number of completed rounds
  averageScore: number;                 // Mean score across all rounds
  bestScore: number;                    // Highest score achieved
  worstScore: number;                   // Lowest score achieved
  totalDuration: number;                // Total session time in seconds
  averageRoundDuration: number;         // Mean time per round
  scoreHistory: number[];               // Scores in chronological order
}
```

**Attributes:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| totalRounds | number | Yes | Completed rounds count | Non-negative integer |
| averageScore | number | Yes | Mean similarity score | 0-100, rounded to 1 decimal |
| bestScore | number | Yes | Maximum score | 0-100 integer |
| worstScore | number | Yes | Minimum score | 0-100 integer |
| totalDuration | number | Yes | Session duration | Non-negative seconds |
| averageRoundDuration | number | Yes | Mean round time | Non-negative seconds |
| scoreHistory | number[] | Yes | Ordered scores | Array of 0-100 integers |

**Relationships:**
- Belongs to one `GameSession` (one-to-one, computed)

**Computation Rules:**
- All statistics computed from `GameSession.rounds` array
- Updated after each round completion
- `averageScore` = sum of all scores / totalRounds
- `bestScore` = max(scoreHistory)
- `worstScore` = min(scoreHistory)
- Statistics are 0/empty when `totalRounds === 0`

---

## Entity Relationships Diagram

```
GameSession (1) ─────< (many) Round
    │                     │
    │                     ├──> (1) TargetShape
    │                     ├──> (1) PlayerDrawing
    │                     │        └──> (many) Stroke
    │                     └──> (1) SimilarityScore
    │
    └──> (1) SessionStatistics
```

---

## State Management Implementation

### Repository Interfaces

```typescript
// Abstract repository interface for future backend swap
interface GameSessionRepository {
  getCurrentSession(): GameSession | null;
  createSession(difficulty: DifficultyLevel): GameSession;
  updateSession(session: GameSession): void;
  clearSession(): void;
}

interface ShapeRepository {
  getShapesByDifficulty(level: DifficultyLevel): TargetShape[];
  getRandomShape(level: DifficultyLevel): TargetShape;
  getAllShapes(): TargetShape[];
}
```

### In-Memory Implementation (MVP)

```typescript
// Context-based in-memory repository
class InMemoryGameSessionRepository implements GameSessionRepository {
  private currentSession: GameSession | null = null;

  getCurrentSession(): GameSession | null {
    return this.currentSession;
  }

  createSession(difficulty: DifficultyLevel): GameSession {
    this.currentSession = {
      sessionId: generateUUID(),
      startTime: new Date(),
      rounds: [],
      statistics: createEmptyStatistics(),
      difficulty,
      currentRound: null,
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

---

## Data Validation Rules

### Cross-Entity Constraints

1. **Round Sequence**: `Round.roundNumber` must be sequential within `GameSession.rounds`
2. **Score Calculation**: `SimilarityScore` only created after `PlayerDrawing` submitted
3. **Empty Drawing**: If `PlayerDrawing.isEmpty === true`, then `SimilarityScore.overallScore === 0`
4. **Round Duration**: `Round.duration = (submitTime - startTime) in seconds`
5. **Statistics Consistency**: `SessionStatistics.totalRounds === GameSession.rounds.length`
6. **Difficulty Matching**: `Round.targetShape.difficulty === GameSession.difficulty`

### Business Rules

1. **Shape Selection**: Never repeat same shape within a session until all shapes exhausted
2. **Score Range**: All scores strictly between 0-100 inclusive
3. **Undo Limit**: Can only undo last stroke (no multi-level undo history)
4. **Session Continuity**: Closing browser ends session (no persistence)
5. **Performance**: Scoring calculation must complete within 1 second (per SC-008)

---

## TypeScript Type Exports

All types should be exported from `src/models/index.ts` for centralized imports:

```typescript
// src/models/index.ts
export type {
  GameSession,
  Round,
  TargetShape,
  PlayerDrawing,
  SimilarityScore,
  SessionStatistics,
  Stroke,
  Point,
  ShapeDefinition,
  PathDefinition,
  SVGDefinition,
  FunctionDefinition,
  BoundingBox,
  ShapeDisplayProps,
  CanvasDimensions,
  DrawingMetadata,
  ScoreBreakdown,
} from './types';

export {
  RoundStatus,
  DifficultyLevel,
  ScoringMethod,
} from './enums';

export type {
  GameSessionRepository,
  ShapeRepository,
} from './repositories/interfaces';
```

---

## Summary

This data model provides:
- Clear entity definitions with TypeScript interfaces
- Well-defined relationships and lifecycle states
- Repository pattern for future backend migration
- Validation rules aligned with functional requirements
- Testable structure supporting TDD workflow

All entities are designed for in-memory storage in the MVP, with repository abstractions enabling straightforward migration to backend API in future iterations.
