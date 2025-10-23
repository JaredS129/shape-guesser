import { describe, it, expect } from 'vitest';
import {
  calculateAreaSimilarity,
  createSimilarityScore
} from '../../../src/services/ScoringService';
import {
  PlayerDrawing,
  TargetShape,
  DifficultyLevel,
  ScoringMethod
} from '../../../src/models';

describe('ScoringService', () => {
  // Helper to create a mock PlayerDrawing
  const createMockDrawing = (isEmpty: boolean = false, bitmap: string | null = null): PlayerDrawing => ({
    drawingId: 'test-drawing-id',
    strokes: isEmpty ? [] : [
      {
        strokeId: 'stroke-1',
        points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
        timestamp: new Date(),
        pressure: [1.0, 1.0]
      }
    ],
    canvasBounds: { width: 200, height: 200 },
    isEmpty,
    bitmap: bitmap || (isEmpty ? null : 'data:image/png;base64,mockdata'),
    metadata: {
      strokeCount: isEmpty ? 0 : 1,
      totalPoints: isEmpty ? 0 : 2,
      drawingDuration: 10,
      averageStrokeLength: isEmpty ? 0 : 2
    }
  });

  // Helper to create a mock TargetShape
  const createMockShape = (): TargetShape => ({
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
  });

  describe('calculateAreaSimilarity', () => {
    it('should return 0 for empty drawing', () => {
      const emptyDrawing = createMockDrawing(true);
      const targetShape = createMockShape();

      const score = calculateAreaSimilarity(emptyDrawing, targetShape);

      expect(score).toBe(0);
    });

    it('should return a score between 0 and 100', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const score = calculateAreaSimilarity(drawing, targetShape);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return an integer score', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const score = calculateAreaSimilarity(drawing, targetShape);

      expect(Number.isInteger(score)).toBe(true);
    });

    it('should be deterministic for same input', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const score1 = calculateAreaSimilarity(drawing, targetShape);
      const score2 = calculateAreaSimilarity(drawing, targetShape);

      expect(score1).toBe(score2);
    });

    it('should complete within 1 second', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const startTime = Date.now();
      calculateAreaSimilarity(drawing, targetShape);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000);
    });

    it('should handle drawings with no bitmap data', () => {
      const drawing = createMockDrawing(false, null);
      const targetShape = createMockShape();

      // Should either calculate from strokes or return a default score
      const score = calculateAreaSimilarity(drawing, targetShape);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('createSimilarityScore', () => {
    it('should create a complete SimilarityScore object', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore).toHaveProperty('scoreId');
      expect(similarityScore).toHaveProperty('overallScore');
      expect(similarityScore).toHaveProperty('breakdown');
      expect(similarityScore).toHaveProperty('calculationTime');
      expect(similarityScore).toHaveProperty('timestamp');
    });

    it('should generate unique score IDs', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const score1 = createSimilarityScore(drawing, targetShape);
      const score2 = createSimilarityScore(drawing, targetShape);

      expect(score1.scoreId).not.toBe(score2.scoreId);
    });

    it('should have overallScore between 0 and 100', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore.overallScore).toBeGreaterThanOrEqual(0);
      expect(similarityScore.overallScore).toBeLessThanOrEqual(100);
    });

    it('should use AREA_BASED scoring method', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore.breakdown.method).toBe(ScoringMethod.AREA_BASED);
    });

    it('should have positive calculation time', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore.calculationTime).toBeGreaterThanOrEqual(0);
    });

    it('should have calculation time under 1000ms', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore.calculationTime).toBeLessThan(1000);
    });

    it('should have valid timestamp', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const beforeTime = new Date();
      const similarityScore = createSimilarityScore(drawing, targetShape);
      const afterTime = new Date();

      expect(similarityScore.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(similarityScore.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should have breakdown with all components', () => {
      const drawing = createMockDrawing(false);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(drawing, targetShape);

      expect(similarityScore.breakdown).toHaveProperty('areaCoverage');
      expect(similarityScore.breakdown).toHaveProperty('shapeAccuracy');
      expect(similarityScore.breakdown).toHaveProperty('positioning');
      expect(similarityScore.breakdown).toHaveProperty('method');
    });

    it('should return 0 score for empty drawing', () => {
      const emptyDrawing = createMockDrawing(true);
      const targetShape = createMockShape();

      const similarityScore = createSimilarityScore(emptyDrawing, targetShape);

      expect(similarityScore.overallScore).toBe(0);
      expect(similarityScore.breakdown.areaCoverage).toBe(0);
    });
  });
});
