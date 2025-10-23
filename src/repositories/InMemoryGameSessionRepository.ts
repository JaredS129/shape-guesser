import { GameSession, DifficultyLevel, SessionStatistics } from '../models';
import { GameSessionRepository } from './interfaces/GameSessionRepository';
import { generateUUID } from '../utils/idGenerator';

/**
 * In-memory implementation of GameSessionRepository
 * Stores session data in memory (no persistence)
 * Suitable for MVP and can be swapped with API-backed implementation later
 */
export class InMemoryGameSessionRepository implements GameSessionRepository {
  private currentSession: GameSession | null = null;

  /**
   * Get the current active game session
   * @returns The current GameSession or null if none exists
   */
  getCurrentSession(): GameSession | null {
    return this.currentSession;
  }

  /**
   * Create a new game session with the specified difficulty
   * @param difficulty - The difficulty level for the session
   * @returns The newly created GameSession
   */
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

  /**
   * Update an existing game session
   * @param session - The GameSession to update
   */
  updateSession(session: GameSession): void {
    this.currentSession = session;
  }

  /**
   * Clear the current session
   */
  clearSession(): void {
    this.currentSession = null;
  }
}
