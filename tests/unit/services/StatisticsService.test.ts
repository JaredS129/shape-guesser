import { describe, it, expect } from 'vitest';
import { calculateSessionStatistics } from '../../../src/services/StatisticsService';
import { Round, DifficultyLevel, RoundStatus, ScoringMethod } from '../../../src/models';

describe('StatisticsService', () => {
  const createMockRound = (roundNumber: number, score: number, duration: number): Round => ({
    roundId: `round-${roundNumber}`,
    roundNumber,
    targetShape: {
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
    playerDrawing: {
      drawingId: `drawing-${roundNumber}`,
      strokes: [],
      canvasBounds: { width: 200, height: 200 },
      isEmpty: false,
      bitmap: 'data:image/png;base64,mock',
      metadata: {
        strokeCount: 1,
        totalPoints: 10,
        drawingDuration: 5,
        averageStrokeLength: 10
      }
    },
    similarityScore: {
      scoreId: `score-${roundNumber}`,
      overallScore: score,
      breakdown: {
        areaCoverage: score,
        shapeAccuracy: score,
        positioning: score,
        method: ScoringMethod.AREA_BASED
      },
      calculationTime: 100,
      timestamp: new Date()
    },
    status: RoundStatus.COMPLETED,
    startTime: new Date(Date.now() - duration * 1000),
    submitTime: new Date(),
    duration
  });

  describe('calculateSessionStatistics', () => {
    it('should return empty statistics for empty rounds array', () => {
      const stats = calculateSessionStatistics([]);

      expect(stats.totalRounds).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.bestScore).toBe(0);
      expect(stats.worstScore).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.averageRoundDuration).toBe(0);
      expect(stats.scoreHistory).toEqual([]);
    });

    it('should calculate correct statistics for single round', () => {
      const rounds = [createMockRound(1, 85, 10)];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.totalRounds).toBe(1);
      expect(stats.averageScore).toBe(85);
      expect(stats.bestScore).toBe(85);
      expect(stats.worstScore).toBe(85);
      expect(stats.totalDuration).toBe(10);
      expect(stats.averageRoundDuration).toBe(10);
      expect(stats.scoreHistory).toEqual([85]);
    });

    it('should calculate average score correctly for multiple rounds', () => {
      const rounds = [
        createMockRound(1, 80, 10),
        createMockRound(2, 90, 12),
        createMockRound(3, 70, 8)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.totalRounds).toBe(3);
      expect(stats.averageScore).toBe(80); // (80 + 90 + 70) / 3 = 80
    });

    it('should identify best score correctly', () => {
      const rounds = [
        createMockRound(1, 75, 10),
        createMockRound(2, 92, 12),
        createMockRound(3, 68, 8),
        createMockRound(4, 88, 11)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.bestScore).toBe(92);
    });

    it('should identify worst score correctly', () => {
      const rounds = [
        createMockRound(1, 75, 10),
        createMockRound(2, 92, 12),
        createMockRound(3, 45, 8),
        createMockRound(4, 88, 11)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.worstScore).toBe(45);
    });

    it('should calculate total duration as sum of all round durations', () => {
      const rounds = [
        createMockRound(1, 80, 10),
        createMockRound(2, 90, 15),
        createMockRound(3, 70, 12)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.totalDuration).toBe(37); // 10 + 15 + 12
    });

    it('should calculate average round duration correctly', () => {
      const rounds = [
        createMockRound(1, 80, 10),
        createMockRound(2, 90, 20),
        createMockRound(3, 70, 15)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.averageRoundDuration).toBe(15); // (10 + 20 + 15) / 3 = 15
    });

    it('should maintain score history in chronological order', () => {
      const rounds = [
        createMockRound(1, 50, 10),
        createMockRound(2, 75, 12),
        createMockRound(3, 90, 8),
        createMockRound(4, 65, 11)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.scoreHistory).toEqual([50, 75, 90, 65]);
    });

    it('should handle rounds with zero scores', () => {
      const rounds = [
        createMockRound(1, 0, 10),
        createMockRound(2, 50, 12),
        createMockRound(3, 100, 8)
      ];
      const stats = calculateSessionStatistics(rounds);

      expect(stats.averageScore).toBe(50); // (0 + 50 + 100) / 3
      expect(stats.worstScore).toBe(0);
      expect(stats.bestScore).toBe(100);
    });

    it('should round average score to one decimal place', () => {
      const rounds = [
        createMockRound(1, 77, 10),
        createMockRound(2, 82, 12),
        createMockRound(3, 91, 8)
      ];
      const stats = calculateSessionStatistics(rounds);

      // (77 + 82 + 91) / 3 = 83.333...
      expect(stats.averageScore).toBeCloseTo(83.3, 1);
    });

    it('should round average round duration to one decimal place', () => {
      const rounds = [
        createMockRound(1, 80, 10),
        createMockRound(2, 90, 11),
        createMockRound(3, 70, 12)
      ];
      const stats = calculateSessionStatistics(rounds);

      // (10 + 11 + 12) / 3 = 11
      expect(stats.averageRoundDuration).toBeCloseTo(11, 1);
    });
  });
});
