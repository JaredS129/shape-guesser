import { GameSession, DifficultyLevel } from '../../models';

/**
 * Repository interface for managing game sessions
 * Provides abstraction layer for future backend integration
 */
export interface GameSessionRepository {
  /**
   * Get the current active game session
   * @returns The current GameSession or null if none exists
   */
  getCurrentSession(): GameSession | null;

  /**
   * Create a new game session with the specified difficulty
   * @param difficulty - The difficulty level for the session
   * @returns The newly created GameSession
   */
  createSession(difficulty: DifficultyLevel): GameSession;

  /**
   * Update an existing game session
   * @param session - The GameSession to update
   */
  updateSession(session: GameSession): void;

  /**
   * Clear the current session
   */
  clearSession(): void;
}
