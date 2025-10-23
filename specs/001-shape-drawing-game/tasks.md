---

description: "Task list for Shape Drawing Game implementation"
---

# Tasks: Shape Drawing Game

**Input**: Design documents from `/specs/001-shape-drawing-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: TDD is mandatory per constitution. All tests MUST be written BEFORE implementation (Red-Green-Refactor cycle).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend-only web app**: `src/`, `tests/` at repository root
- All paths relative to repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize React app with Vite and TypeScript template
- [x] T002 Install core dependencies (React 18+, Material UI v5+)
- [x] T003 Install testing dependencies (Vitest, React Testing Library, vitest-canvas-mock, jsdom, @vitest/ui, @vitest/coverage-v8)
- [x] T004 [P] Create vitest.config.ts with jsdom environment and setupFiles configuration
- [x] T005 [P] Create src/test/setup.ts with @testing-library/jest-dom and vitest-canvas-mock imports
- [x] T006 [P] Update package.json scripts (test, test:ui, test:run, test:coverage, dev, build)
- [x] T007 Create project directory structure (src/{components,repositories,services,models,utils,context}, tests/{unit,integration,components})
- [x] T008 [P] Create src/repositories/interfaces/ directory for repository contracts
- [x] T009 [P] Create tsconfig.json with strict mode enabled

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Domain Models & Types

- [x] T010 [P] Create src/models/enums.ts with RoundStatus, DifficultyLevel, ScoringMethod enums
- [x] T011 [P] Create src/models/types.ts with all TypeScript interfaces (Point, Stroke, PlayerDrawing, TargetShape, Round, GameSession, SimilarityScore, SessionStatistics, etc.)
- [x] T012 [P] Create src/models/index.ts to export all types and enums

### Utility Functions (TDD)

- [x] T013 Write tests for generateUUID function in tests/unit/utils/idGenerator.test.ts
- [x] T014 Implement src/utils/idGenerator.ts with generateUUID function (should FAIL tests first, then pass)
- [x] T015 Write tests for shape definitions in tests/unit/utils/shapeDefinitions.test.ts (at least 10 shapes, proper difficulty classification)
- [x] T016 Implement src/utils/shapeDefinitions.ts with predefined shapes for Easy/Medium/Hard difficulties (circle, square, triangle, rectangle, pentagon, hexagon, star, heart, diamond, oval, house, arrow, crescent, irregular-polygon)
- [x] T017 Implement getAllShapes, getShapesByDifficulty, getRandomShape functions in src/utils/shapeDefinitions.ts

### Repository Interfaces

- [x] T018 [P] Create src/repositories/interfaces/GameSessionRepository.ts interface (getCurrentSession, createSession, updateSession, clearSession)
- [x] T019 [P] Create src/repositories/interfaces/ShapeRepository.ts interface (getShapesByDifficulty, getRandomShape, getAllShapes)
- [x] T020 [P] Create src/repositories/interfaces/index.ts to export all repository interfaces

### Repository Implementations (TDD)

- [x] T021 Write tests for InMemoryGameSessionRepository in tests/unit/repositories/InMemoryGameSessionRepository.test.ts
- [x] T022 Implement src/repositories/InMemoryGameSessionRepository.ts (should FAIL tests first, then pass)
- [x] T023 Write tests for InMemoryShapeRepository in tests/unit/repositories/InMemoryShapeRepository.test.ts
- [x] T024 Implement src/repositories/InMemoryShapeRepository.ts (should FAIL tests first, then pass)

### Core Services (TDD)

- [x] T025 Write tests for calculateAreaSimilarity in tests/unit/services/ScoringService.test.ts (empty drawing returns 0, perfect match returns 100, deterministic, completes <1 second)
- [x] T026 Implement convertDrawingToBitmap helper function in src/services/ScoringService.ts
- [x] T027 Implement convertShapeToBitmap helper function in src/services/ScoringService.ts
- [x] T028 Implement countOverlappingPixels helper function in src/services/ScoringService.ts
- [x] T029 Implement calculateAreaSimilarity function in src/services/ScoringService.ts (should FAIL tests first, then pass)
- [x] T030 Implement createSimilarityScore function in src/services/ScoringService.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Shape Drawing and Grading (Priority: P1) 🎯 MVP

**Goal**: Implement core game loop where player draws a shape and receives a similarity score

**Independent Test**: Start game → draw on canvas → submit → receive score (0-100) → see target shape revealed and side-by-side comparison

### Tests for User Story 1 (TDD - Write FIRST, Ensure FAIL) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T031 [P] [US1] Write unit tests for GameEngine.startRound in tests/unit/services/GameEngine.test.ts
- [x] T032 [P] [US1] Write unit tests for GameEngine.submitDrawing in tests/unit/services/GameEngine.test.ts
- [x] T033 [P] [US1] Write unit tests for GameEngine.completeRound in tests/unit/services/GameEngine.test.ts
- [x] T034 [P] [US1] Write component tests for DrawingCanvas in tests/components/DrawingCanvas.test.tsx (renders canvas, captures strokes, undo last stroke, clear all, submit calls callback)
- [x] T035 [P] [US1] Write component tests for ResultsDisplay in tests/components/ResultsDisplay.test.tsx (displays score, shows target shape, shows player drawing, side-by-side comparison)
- [x] T036 [P] [US1] Write integration test for complete game flow in tests/integration/gameFlow.test.tsx (start → draw → submit → score → results)

### Implementation for User Story 1

- [x] T037 [P] [US1] Implement GameEngine.startRound in src/services/GameEngine.ts (creates Round with random TargetShape, sets status to DRAWING)
- [x] T038 [P] [US1] Implement GameEngine.submitDrawing in src/services/GameEngine.ts (accepts PlayerDrawing, calculates SimilarityScore, updates Round status)
- [x] T039 [US1] Implement GameEngine.completeRound in src/services/GameEngine.ts (finalizes Round, moves to completed rounds, calculates duration)
- [x] T040 [US1] Create GameContext with useReducer for game state management in src/context/GameContext.tsx (manages GameSession, current Round, actions for startRound/submitDrawing/completeRound)
- [x] T041 [US1] Create GameProvider component that wraps repository access in src/context/GameContext.tsx
- [x] T042 [US1] Implement DrawingCanvas component in src/components/DrawingCanvas.tsx (canvas with React ref, mouse/touch handlers, stroke capture, render strokes on every update)
- [x] T043 [US1] Add undo last stroke functionality to DrawingCanvas in src/components/DrawingCanvas.tsx
- [x] T044 [US1] Add clear all functionality to DrawingCanvas in src/components/DrawingCanvas.tsx
- [x] T045 [US1] Add submit button with PlayerDrawing creation in DrawingCanvas in src/components/DrawingCanvas.tsx (convert canvas to bitmap via toDataURL)
- [x] T046 [US1] Implement ResultsDisplay component in src/components/ResultsDisplay.tsx (displays score, target shape visual, player drawing visual, side-by-side comparison using Material UI Card/Typography)
- [x] T047 [US1] Implement ShapeRenderer helper component in src/components/ShapeRenderer.tsx (renders TargetShape definition to canvas for display)
- [x] T048 [US1] Create GameContainer orchestration component in src/components/GameContainer.tsx (manages game flow state, renders DrawingCanvas during DRAWING, renders ResultsDisplay after SCORED)
- [x] T049 [US1] Wire GameContainer into App.tsx with GameProvider wrapper
- [x] T050 [US1] Add Material UI theme and basic layout styling to App.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - user can play one complete round of the game

---

## Phase 4: User Story 2 - Multiple Rounds and Score Tracking (Priority: P2)

**Goal**: Enable multiple consecutive rounds with session statistics tracking

**Independent Test**: Complete round → click "Play Another Round" → new shape appears → complete multiple rounds → view average score, best score, total rounds played

### Tests for User Story 2 (TDD - Write FIRST, Ensure FAIL) ⚠️

- [x] T051 [P] [US2] Write tests for calculateSessionStatistics in tests/unit/services/StatisticsService.test.ts (average score, best/worst score, total duration)
- [x] T052 [P] [US2] Write component tests for SessionStats in tests/components/SessionStats.test.tsx (displays rounds count, average score, best score, score history)
- [x] T053 [P] [US2] Write integration test for multi-round flow in tests/integration/multiRoundFlow.test.tsx (complete round 1 → start round 2 → verify different shape → complete round 2 → verify statistics updated)

### Implementation for User Story 2

- [x] T054 [P] [US2] Implement calculateSessionStatistics function in src/services/StatisticsService.ts
- [x] T055 [US2] Add "Play Another Round" action to GameContext reducer in src/context/GameContext.tsx
- [x] T056 [US2] Update GameEngine to prevent duplicate shapes within session in src/services/GameEngine.ts (track used shapes, select from remaining)
- [x] T057 [US2] Implement SessionStats component in src/components/SessionStats.tsx (displays total rounds, average score, best score using Material UI Chip/Typography)
- [x] T058 [US2] Add ScoreHistory sub-component to SessionStats in src/components/SessionStats.tsx (displays chronological score list)
- [x] T059 [US2] Update ResultsDisplay to include "Play Another Round" button in src/components/ResultsDisplay.tsx
- [x] T060 [US2] Update GameContainer to show SessionStats during results phase in src/components/GameContainer.tsx
- [x] T061 [US2] Update GameContainer to handle "Play Another Round" action and start new round in src/components/GameContainer.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - user can play multiple rounds and track performance

---

## Phase 5: User Story 3 - Shape Difficulty Levels (Priority: P3)

**Goal**: Add difficulty selection (Easy/Medium/Hard) with appropriate shape complexity per level

**Independent Test**: Start new session → select difficulty → verify shapes match difficulty → complete rounds → verify statistics tracked per difficulty

### Tests for User Story 3 (TDD - Write FIRST, Ensure FAIL) ⚠️

- [ ] T062 [P] [US3] Write component tests for DifficultySelector in tests/components/DifficultySelector.test.tsx (renders three options, calls callback on selection, highlights selected difficulty)
- [ ] T063 [P] [US3] Write tests for difficulty-aware shape selection in tests/unit/services/GameEngine.test.ts (Easy returns simple shapes, Medium returns complex, Hard returns composite)
- [ ] T064 [P] [US3] Write integration test for difficulty-based gameplay in tests/integration/difficultyFlow.test.tsx (select Easy → verify simple shapes → select Hard → verify complex shapes)

### Implementation for User Story 3

- [ ] T065 [P] [US3] Implement DifficultySelector component in src/components/DifficultySelector.tsx (three Material UI Button/Card options for Easy/Medium/Hard with descriptions)
- [ ] T066 [US3] Update GameContext to store selected difficulty in GameSession in src/context/GameContext.tsx
- [ ] T067 [US3] Update GameEngine.startRound to use session difficulty when selecting random shape in src/services/GameEngine.ts
- [ ] T068 [US3] Add difficulty-based statistics tracking to SessionStatistics in src/models/types.ts (add per-difficulty score arrays)
- [ ] T069 [US3] Update StatisticsService to calculate stats per difficulty in src/services/StatisticsService.ts
- [ ] T070 [US3] Update SessionStats component to display per-difficulty statistics in src/components/SessionStats.tsx (toggle view between overall and per-difficulty)
- [ ] T071 [US3] Add DifficultySelector to GameContainer at session start in src/components/GameContainer.tsx (show before first round, persist for session)
- [ ] T072 [US3] Add difficulty indicator to game UI in src/components/GameContainer.tsx (show current difficulty in header)

**Checkpoint**: All user stories should now be independently functional - complete feature set with difficulty customization

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T073 [P] Add loading state while score is being calculated in src/components/ResultsDisplay.tsx (Material UI CircularProgress)
- [ ] T074 [P] Add error boundary component in src/components/ErrorBoundary.tsx for graceful error handling
- [ ] T075 [P] Add empty canvas submission edge case handling in src/services/ScoringService.ts (ensure score of 0 per FR-012)
- [ ] T076 [P] Add canvas bounds validation in src/components/DrawingCanvas.tsx (clamp points to canvas dimensions)
- [ ] T077 [P] Optimize canvas rendering performance in src/components/DrawingCanvas.tsx (use requestAnimationFrame, minimize redraws)
- [ ] T078 [P] Add touch event support to DrawingCanvas in src/components/DrawingCanvas.tsx (touchstart, touchmove, touchend handlers)
- [ ] T079 [P] Add responsive design adjustments in src/App.tsx (adjust canvas size for tablet/desktop)
- [ ] T080 [P] Add visual feedback for undo/clear/submit actions in src/components/DrawingCanvas.tsx (button disabled states, confirmation for clear)
- [ ] T081 [P] Improve shape rendering quality in src/components/ShapeRenderer.tsx (anti-aliasing, stroke optimization)
- [ ] T082 [P] Add game instructions/help text in src/components/HelpDialog.tsx (Material UI Dialog with instructions)
- [ ] T083 [P] Add accessibility attributes to all interactive elements (ARIA labels, keyboard navigation support)
- [ ] T084 Run full test suite with coverage (npm run test:coverage, ensure >80% coverage on services/repositories)
- [ ] T085 Perform visual QA testing across browsers (Chrome, Firefox, Safari, Edge)
- [ ] T086 Validate all functional requirements FR-001 through FR-013 are met
- [ ] T087 Validate all success criteria SC-001 through SC-008 are met
- [ ] T088 Performance testing (verify 60fps canvas, <1s scoring, <50ms input latency)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 but should be independently testable (can test multi-round flow in isolation)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds difficulty to US1/US2 but should be independently testable

### Within Each User Story

- **Tests MUST be written and FAIL before implementation** (TDD Red-Green-Refactor)
- Models/types before services
- Services before components
- Components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **All Setup tasks marked [P]** can run in parallel (T004, T005, T006, T008, T009)
- **All Foundational tasks marked [P]** can run in parallel within their groups:
  - Domain models: T010, T011, T012
  - Repository interfaces: T018, T019, T020
  - Test files: T013, T015, T021, T023, T025, T031-T036, T051-T053, T062-T064
- **Once Foundational phase completes**, all user stories can start in parallel (if team capacity allows):
  - Team member A: User Story 1
  - Team member B: User Story 2
  - Team member C: User Story 3
- **Within each user story**, all test files marked [P] can run in parallel
- **All Polish tasks marked [P]** can run in parallel (T073-T083)

---

## Parallel Example: User Story 1

```bash
# Launch all test files for User Story 1 together (TDD - write these first):
Task T031: tests/unit/services/GameEngine.test.ts
Task T032: tests/unit/services/GameEngine.test.ts (different describe block)
Task T033: tests/unit/services/GameEngine.test.ts (different describe block)
Task T034: tests/components/DrawingCanvas.test.tsx
Task T035: tests/components/ResultsDisplay.test.tsx
Task T036: tests/integration/gameFlow.test.tsx

# Watch all tests fail (RED), then implement in order to make them pass (GREEN):
Task T037-T050: Implementation tasks
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (complete round, verify scoring)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (multi-round gameplay)
4. Add User Story 3 → Test independently → Deploy/Demo (difficulty levels)
5. Phase 6: Polish → Final testing → Production release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (pair/mob on critical foundation)
2. Once Foundational is done:
   - Developer A: User Story 1 (TDD workflow)
   - Developer B: User Story 2 (TDD workflow)
   - Developer C: User Story 3 (TDD workflow)
3. Stories complete and integrate independently
4. Team collaborates on Phase 6: Polish

---

## TDD Workflow (CRITICAL - Constitution Requirement)

**Every task MUST follow Red-Green-Refactor:**

1. **RED**: Write test that FAILS
   - Run `npm run test` and verify test failure
   - Do NOT proceed to implementation until test is failing

2. **GREEN**: Write minimal code to make test PASS
   - Implement functionality
   - Run `npm run test` and verify test passes
   - Commit once test is green

3. **REFACTOR**: Improve code quality while keeping tests GREEN
   - Clean up implementation
   - Ensure descriptive naming (constitution requirement)
   - Keep functions small and focused (constitution requirement)
   - Run tests after each refactor to ensure still passing

**Watch mode during development:**
```bash
npm run test  # Runs in watch mode, auto-reruns on file changes
```

---

## Task Validation Checklist

Before considering implementation complete:

- [ ] All tasks T001-T088 completed and checked off
- [ ] All unit tests pass (`npm run test:run`)
- [ ] All component tests pass
- [ ] All integration tests pass
- [ ] Test coverage >80% on services and repositories (`npm run test:coverage`)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Constitution compliance verified:
  - [ ] All identifiers use descriptive names (calculateAreaSimilarity, DrawingCanvas, etc.)
  - [ ] Functions are small and focused (typically <20 lines)
  - [ ] Tests were written BEFORE implementation (TDD followed throughout)
- [ ] User Story 1 (P1) fully functional end-to-end
- [ ] User Story 2 (P2) fully functional and independently testable
- [ ] User Story 3 (P3) fully functional and independently testable
- [ ] Performance requirements met:
  - [ ] Canvas renders at 60fps (visual inspection + profiling)
  - [ ] Score calculation <1 second (measured in tests)
  - [ ] Input latency <50ms (visual inspection)
- [ ] All functional requirements (FR-001 through FR-013) implemented and tested
- [ ] Edge cases handled (empty canvas, clear, undo, boundaries)
- [ ] Browser compatibility verified (Chrome, Firefox, Safari, Edge)

---

## Notes

- **[P] tasks** = different files, no dependencies, safe to parallelize
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is NON-NEGOTIABLE**: Verify tests fail before implementing (Red-Green-Refactor)
- Commit after each task or logical group (green tests)
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Summary

**Total Tasks**: 88
- Phase 1 (Setup): 9 tasks
- Phase 2 (Foundational): 21 tasks (CRITICAL PATH)
- Phase 3 (User Story 1 - P1): 20 tasks (MVP)
- Phase 4 (User Story 2 - P2): 11 tasks
- Phase 5 (User Story 3 - P3): 11 tasks
- Phase 6 (Polish): 16 tasks

**Parallel Opportunities**: 43 tasks marked [P] can run in parallel within their phase constraints

**MVP Scope**: Phases 1-3 (50 tasks) = Basic shape drawing and grading game

**Independent Test Criteria**:
- **US1**: Start round → draw → submit → receive score → see comparison
- **US2**: Complete multiple rounds → verify different shapes → see statistics
- **US3**: Select difficulty → verify appropriate shapes → track per-difficulty stats

**Estimated Timeline** (single developer, TDD workflow):
- Phase 1: 2-3 hours
- Phase 2: 8-10 hours (foundation is critical)
- Phase 3 (MVP): 12-15 hours
- Phase 4: 6-8 hours
- Phase 5: 6-8 hours
- Phase 6: 4-6 hours
- **Total**: ~38-50 hours for complete feature implementation

Ready for implementation using `/speckit.implement` or manual TDD workflow following this task list.
