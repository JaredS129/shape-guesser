# Implementation Plan: Shape Drawing Game

**Branch**: `001-shape-drawing-game` | **Date**: 2025-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-shape-drawing-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A browser-based shape guessing game where players draw shapes on a canvas and receive scores based on how closely their drawings match hidden target shapes. The MVP is a frontend-only React application using Material UI components, with area-based similarity scoring. Game state is managed client-side in memory (no persistence), and the architecture uses repository pattern for future backend integration.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18+
**Primary Dependencies**: React 18+, Material UI v5+, Vite (build tool), Native HTML5 Canvas
**Storage**: N/A (client-side React Context for in-memory state management only, no persistence)
**Testing**: Vitest + React Testing Library + vitest-canvas-mock
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) supporting HTML5 Canvas and ES6+
**Project Type**: Web (frontend-only single-page application)
**Performance Goals**: Canvas rendering at 60fps, similarity calculation completing within 1 second, UI response under 50ms
**Constraints**: Client-side only (no backend), must work offline after initial load, responsive design for desktop and tablet
**Scale/Scope**: Single-user sessions, ~10-20 target shapes, 3-5 main components, estimated 2000-3000 LOC

**Key Technical Decisions** (see [research.md](./research.md) for details):
- **Canvas**: Native HTML5 Canvas with React refs (0 KB, maximum performance, full control)
- **Testing**: Vitest (10-20x faster watch mode, essential for TDD workflow)
- **State Management**: React Context + useReducer (zero dependencies, simple, testable)
- **Scoring Algorithm**: Custom area-based pixel comparison (deterministic, meets FR-011)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Descriptive Naming
- ✅ **PASS**: All identifiers (components, functions, variables) will use descriptive names
- Example: `calculateAreaSimilarityScore`, `DrawingCanvas`, `targetShapeDefinition`

### II. Test-Driven Development (TDD) (NON-NEGOTIABLE)
- ✅ **PASS**: Tests will be written before implementation
- Unit tests for scoring algorithm, similarity calculation, game state management
- Integration tests for user flows (draw → submit → score)
- Component tests for canvas, results display, session statistics

### III. Clean Function Design
- ✅ **PASS**: Functions will be small, focused, single-responsibility
- Scoring logic separated from rendering
- State management separated from UI components
- Repository pattern isolates data access for future backend migration

### Constitution Compliance Summary
**Status**: ✅ ALL GATES PASS

No violations or complexity deviations required. The frontend-only architecture with repository pattern aligns with clean separation of concerns and facilitates future extensibility.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # React components (Canvas, Results, Stats, etc.)
├── repositories/         # Data access layer (in-memory, future: API)
│   ├── GameSessionRepository.ts
│   ├── ShapeRepository.ts
│   └── interfaces/       # Repository contracts
├── services/             # Business logic
│   ├── ScoringService.ts
│   ├── GameEngine.ts
│   └── ShapeComparator.ts
├── models/               # Domain entities (TypeScript interfaces/types)
│   ├── GameSession.ts
│   ├── Round.ts
│   ├── Shape.ts
│   └── Drawing.ts
├── utils/                # Helper functions
│   ├── canvasHelpers.ts
│   └── shapeDefinitions.ts
├── App.tsx
└── index.tsx

tests/
├── unit/                 # Pure logic tests
│   ├── services/
│   └── utils/
├── integration/          # User flow tests
│   └── gameFlow.test.tsx
└── components/           # Component tests
    ├── DrawingCanvas.test.tsx
    └── ResultsDisplay.test.tsx

public/
└── index.html
```

**Structure Decision**: Frontend-only web application structure. Repository pattern used to abstract data access (currently in-memory, easily swappable for API calls later). Clear separation between UI (components), business logic (services), and data access (repositories) aligns with constitution's separation of concerns principle.

## Complexity Tracking

No constitution violations or complexity deviations. All principles satisfied.

## Design Artifacts

This implementation plan is supported by the following design documents:

- **[research.md](./research.md)**: Technical research and decision rationale
  - Canvas library selection (Native HTML5 Canvas)
  - Testing framework choice (Vitest + React Testing Library)
  - State management approach (React Context + useReducer)
  - Scoring algorithm design (area-based pixel comparison)

- **[data-model.md](./data-model.md)**: Complete domain model specification
  - Entity definitions (GameSession, Round, TargetShape, PlayerDrawing, SimilarityScore)
  - TypeScript interfaces and types
  - Repository interfaces for data access abstraction
  - State lifecycle and validation rules

- **[quickstart.md](./quickstart.md)**: TDD implementation guide
  - Step-by-step setup instructions
  - Phase-by-phase development roadmap
  - Test-first code examples
  - Validation checklist

## Next Steps

1. **Begin Implementation**: Follow [quickstart.md](./quickstart.md) TDD workflow
2. **Generate Tasks**: Run `/speckit.tasks` to create detailed task breakdown
3. **Implement User Story 1 (P1)**: Core drawing and grading functionality
4. **Validate MVP**: Ensure all FR requirements and success criteria met
5. **Extend to P2/P3**: Add multi-round tracking and difficulty levels
