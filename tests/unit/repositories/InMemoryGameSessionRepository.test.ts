import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGameSessionRepository } from '../../../src/repositories/InMemoryGameSessionRepository';
import { DifficultyLevel, Round } from '../../../src/models';

describe('InMemoryGameSessionRepository', () => {
  let repository: InMemoryGameSessionRepository;

  beforeEach(() => {
    repository = new InMemoryGameSessionRepository();
  });

  describe('getCurrentSession', () => {
    it('should return null when no session exists', () => {
      expect(repository.getCurrentSession()).toBeNull();
    });

    it('should return the current session after creation', () => {
      const session = repository.createSession(DifficultyLevel.EASY);
      const retrieved = repository.getCurrentSession();
      expect(retrieved).toEqual(session);
    });
  });

  describe('createSession', () => {
    it('should create a new session with given difficulty', () => {
      const session = repository.createSession(DifficultyLevel.EASY);

      expect(session.sessionId).toBeTruthy();
      expect(session.difficulty).toBe(DifficultyLevel.EASY);
      expect(session.rounds).toEqual([]);
      expect(session.currentRound).toBeNull();
      expect(session.startTime).toBeInstanceOf(Date);
    });

    it('should create session with empty statistics', () => {
      const session = repository.createSession(DifficultyLevel.MEDIUM);

      expect(session.statistics.totalRounds).toBe(0);
      expect(session.statistics.averageScore).toBe(0);
      expect(session.statistics.bestScore).toBe(0);
      expect(session.statistics.worstScore).toBe(0);
      expect(session.statistics.totalDuration).toBe(0);
      expect(session.statistics.averageRoundDuration).toBe(0);
      expect(session.statistics.scoreHistory).toEqual([]);
    });

    it('should generate unique session IDs', () => {
      const session1 = repository.createSession(DifficultyLevel.EASY);
      repository.clearSession();
      const session2 = repository.createSession(DifficultyLevel.EASY);

      expect(session1.sessionId).not.toBe(session2.sessionId);
    });

    it('should replace existing session when creating new one', () => {
      const session1 = repository.createSession(DifficultyLevel.EASY);
      const session2 = repository.createSession(DifficultyLevel.HARD);

      const current = repository.getCurrentSession();
      expect(current).toEqual(session2);
      expect(current?.difficulty).toBe(DifficultyLevel.HARD);
    });
  });

  describe('updateSession', () => {
    it('should update existing session', () => {
      const session = repository.createSession(DifficultyLevel.EASY);
      const mockRound: Partial<Round> = {
        roundId: 'test-round',
        roundNumber: 1
      };

      const updated = {
        ...session,
        rounds: [mockRound as Round]
      };

      repository.updateSession(updated);
      const retrieved = repository.getCurrentSession();

      expect(retrieved?.rounds.length).toBe(1);
      expect(retrieved?.rounds[0].roundId).toBe('test-round');
    });

    it('should update session statistics', () => {
      const session = repository.createSession(DifficultyLevel.MEDIUM);
      const updatedStats = {
        ...session.statistics,
        totalRounds: 5,
        averageScore: 75.5,
        bestScore: 95
      };

      repository.updateSession({
        ...session,
        statistics: updatedStats
      });

      const retrieved = repository.getCurrentSession();
      expect(retrieved?.statistics.totalRounds).toBe(5);
      expect(retrieved?.statistics.averageScore).toBe(75.5);
      expect(retrieved?.statistics.bestScore).toBe(95);
    });
  });

  describe('clearSession', () => {
    it('should clear the current session', () => {
      repository.createSession(DifficultyLevel.HARD);
      repository.clearSession();

      expect(repository.getCurrentSession()).toBeNull();
    });

    it('should allow creating new session after clearing', () => {
      repository.createSession(DifficultyLevel.EASY);
      repository.clearSession();
      const newSession = repository.createSession(DifficultyLevel.MEDIUM);

      expect(repository.getCurrentSession()).toEqual(newSession);
      expect(newSession.difficulty).toBe(DifficultyLevel.MEDIUM);
    });
  });
});
