import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from '../../../src/services/GameEngine';
import { InMemoryGameSessionRepository } from '../../../src/repositories/InMemoryGameSessionRepository';
import { InMemoryShapeRepository } from '../../../src/repositories/InMemoryShapeRepository';
import { DifficultyLevel, RoundStatus, PlayerDrawing } from '../../../src/models';

describe('GameEngine', () => {
  let gameEngine: GameEngine;
  let sessionRepo: InMemoryGameSessionRepository;
  let shapeRepo: InMemoryShapeRepository;

  beforeEach(() => {
    sessionRepo = new InMemoryGameSessionRepository();
    shapeRepo = new InMemoryShapeRepository();
    gameEngine = new GameEngine(sessionRepo, shapeRepo);
  });

  describe('startRound', () => {
    it('should create a new round with a random target shape', () => {
      // Create a session first
      const session = sessionRepo.createSession(DifficultyLevel.EASY);

      const round = gameEngine.startRound(session);

      expect(round).toBeDefined();
      expect(round.roundId).toBeTruthy();
      expect(round.targetShape).toBeDefined();
      expect(round.targetShape.difficulty).toBe(DifficultyLevel.EASY);
      expect(round.status).toBe(RoundStatus.DRAWING);
      expect(round.roundNumber).toBe(1);
    });

    it('should set round status to DRAWING', () => {
      const session = sessionRepo.createSession(DifficultyLevel.MEDIUM);
      const round = gameEngine.startRound(session);

      expect(round.status).toBe(RoundStatus.DRAWING);
    });

    it('should initialize round with null drawing and score', () => {
      const session = sessionRepo.createSession(DifficultyLevel.HARD);
      const round = gameEngine.startRound(session);

      expect(round.playerDrawing).toBeNull();
      expect(round.similarityScore).toBeNull();
      expect(round.submitTime).toBeNull();
      expect(round.duration).toBeNull();
    });

    it('should set startTime to current time', () => {
      const beforeTime = new Date();
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);
      const afterTime = new Date();

      expect(round.startTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(round.startTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should increment round number for subsequent rounds', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);

      const round1 = gameEngine.startRound(session);
      expect(round1.roundNumber).toBe(1);

      // Simulate completing first round
      session.rounds.push(round1);

      const round2 = gameEngine.startRound(session);
      expect(round2.roundNumber).toBe(2);
    });

    it('should use session difficulty for shape selection', () => {
      const easySession = sessionRepo.createSession(DifficultyLevel.EASY);
      const easyRound = gameEngine.startRound(easySession);
      expect(easyRound.targetShape.difficulty).toBe(DifficultyLevel.EASY);

      const hardSession = sessionRepo.createSession(DifficultyLevel.HARD);
      const hardRound = gameEngine.startRound(hardSession);
      expect(hardRound.targetShape.difficulty).toBe(DifficultyLevel.HARD);
    });
  });

  describe('submitDrawing', () => {
    it('should calculate similarity score for the drawing', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const updatedRound = gameEngine.submitDrawing(round, mockDrawing);

      expect(updatedRound.playerDrawing).toEqual(mockDrawing);
      expect(updatedRound.similarityScore).toBeDefined();
      expect(updatedRound.similarityScore?.overallScore).toBeGreaterThanOrEqual(0);
      expect(updatedRound.similarityScore?.overallScore).toBeLessThanOrEqual(100);
    });

    it('should update round status to SCORED', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const updatedRound = gameEngine.submitDrawing(round, mockDrawing);

      expect(updatedRound.status).toBe(RoundStatus.SCORED);
    });

    it('should set submitTime', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const beforeSubmit = new Date();
      const updatedRound = gameEngine.submitDrawing(round, mockDrawing);
      const afterSubmit = new Date();

      expect(updatedRound.submitTime).toBeDefined();
      expect(updatedRound.submitTime!.getTime()).toBeGreaterThanOrEqual(beforeSubmit.getTime());
      expect(updatedRound.submitTime!.getTime()).toBeLessThanOrEqual(afterSubmit.getTime());
    });

    it('should return 0 score for empty drawing', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const emptyDrawing: PlayerDrawing = {
        drawingId: 'empty',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const updatedRound = gameEngine.submitDrawing(round, emptyDrawing);

      expect(updatedRound.similarityScore?.overallScore).toBe(0);
    });
  });

  describe('completeRound', () => {
    it('should calculate round duration', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      // Simulate drawing submission
      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const scoredRound = gameEngine.submitDrawing(round, mockDrawing);
      const completedRound = gameEngine.completeRound(scoredRound);

      expect(completedRound.duration).toBeDefined();
      expect(completedRound.duration).toBeGreaterThanOrEqual(0);
    });

    it('should update status to COMPLETED', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const scoredRound = gameEngine.submitDrawing(round, mockDrawing);
      const completedRound = gameEngine.completeRound(scoredRound);

      expect(completedRound.status).toBe(RoundStatus.COMPLETED);
    });

    it('should preserve all round data', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);
      const round = gameEngine.startRound(session);

      const mockDrawing: PlayerDrawing = {
        drawingId: 'test-drawing',
        strokes: [],
        canvasBounds: { width: 200, height: 200 },
        isEmpty: true,
        bitmap: null,
        metadata: {
          strokeCount: 0,
          totalPoints: 0,
          drawingDuration: 0,
          averageStrokeLength: 0
        }
      };

      const scoredRound = gameEngine.submitDrawing(round, mockDrawing);
      const completedRound = gameEngine.completeRound(scoredRound);

      expect(completedRound.roundId).toBe(round.roundId);
      expect(completedRound.targetShape).toBe(round.targetShape);
      expect(completedRound.playerDrawing).toBe(mockDrawing);
      expect(completedRound.similarityScore).toBeDefined();
    });
  });

  describe('difficulty-aware shape selection', () => {
    it('should return Easy shapes when session difficulty is Easy', () => {
      const session = sessionRepo.createSession(DifficultyLevel.EASY);

      // Test multiple rounds to ensure consistency
      for (let i = 0; i < 5; i++) {
        const round = gameEngine.startRound(session);
        expect(round.targetShape.difficulty).toBe(DifficultyLevel.EASY);
      }
    });

    it('should return Medium shapes when session difficulty is Medium', () => {
      const session = sessionRepo.createSession(DifficultyLevel.MEDIUM);

      // Test multiple rounds to ensure consistency
      for (let i = 0; i < 5; i++) {
        const round = gameEngine.startRound(session);
        expect(round.targetShape.difficulty).toBe(DifficultyLevel.MEDIUM);
      }
    });

    it('should return Hard shapes when session difficulty is Hard', () => {
      const session = sessionRepo.createSession(DifficultyLevel.HARD);

      // Test multiple rounds to ensure consistency
      for (let i = 0; i < 5; i++) {
        const round = gameEngine.startRound(session);
        expect(round.targetShape.difficulty).toBe(DifficultyLevel.HARD);
      }
    });

    it('should select different shapes for different difficulty levels', () => {
      const easySession = sessionRepo.createSession(DifficultyLevel.EASY);
      const mediumSession = sessionRepo.createSession(DifficultyLevel.MEDIUM);
      const hardSession = sessionRepo.createSession(DifficultyLevel.HARD);

      const easyRound = gameEngine.startRound(easySession);
      const mediumRound = gameEngine.startRound(mediumSession);
      const hardRound = gameEngine.startRound(hardSession);

      // Shapes should have appropriate difficulty
      expect(easyRound.targetShape.difficulty).toBe(DifficultyLevel.EASY);
      expect(mediumRound.targetShape.difficulty).toBe(DifficultyLevel.MEDIUM);
      expect(hardRound.targetShape.difficulty).toBe(DifficultyLevel.HARD);

      // Shape definitions should be different (likely different shape types)
      // Note: This is probabilistic but very likely with sufficient shape variety
      const allSameShape =
        easyRound.targetShape.shapeId === mediumRound.targetShape.shapeId &&
        mediumRound.targetShape.shapeId === hardRound.targetShape.shapeId;

      expect(allSameShape).toBe(false);
    });

    it('should respect difficulty throughout multiple rounds', () => {
      const session = sessionRepo.createSession(DifficultyLevel.MEDIUM);

      const round1 = gameEngine.startRound(session);
      session.rounds.push(round1);

      const round2 = gameEngine.startRound(session);
      session.rounds.push(round2);

      const round3 = gameEngine.startRound(session);

      // All rounds should use Medium difficulty
      expect(round1.targetShape.difficulty).toBe(DifficultyLevel.MEDIUM);
      expect(round2.targetShape.difficulty).toBe(DifficultyLevel.MEDIUM);
      expect(round3.targetShape.difficulty).toBe(DifficultyLevel.MEDIUM);
    });
  });
});
