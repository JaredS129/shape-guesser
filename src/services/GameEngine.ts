import {
  Round,
  GameSession,
  PlayerDrawing,
  RoundStatus,
  TargetShape
} from '../models';
import { GameSessionRepository } from '../repositories/interfaces/GameSessionRepository';
import { ShapeRepository } from '../repositories/interfaces/ShapeRepository';
import { generateUUID } from '../utils/idGenerator';
import { createSimilarityScore } from './ScoringService';

/**
 * Game Engine - Orchestrates game logic and round management
 * Handles round lifecycle: start → submit → complete
 */
export class GameEngine {
  constructor(
    _sessionRepository: GameSessionRepository,
    private shapeRepository: ShapeRepository
  ) {
    // sessionRepository reserved for future use
  }

  /**
   * Start a new round with a random target shape
   * @param session - The current game session
   * @returns A new Round in DRAWING status
   */
  startRound(session: GameSession): Round {
    // Get random shape based on session difficulty
    const targetShape: TargetShape = this.shapeRepository.getRandomShape(session.difficulty);

    // Determine round number (next in sequence)
    const roundNumber = session.rounds.length + 1;

    // Create new round
    const round: Round = {
      roundId: generateUUID(),
      roundNumber,
      targetShape,
      playerDrawing: null,
      similarityScore: null,
      status: RoundStatus.DRAWING,
      startTime: new Date(),
      submitTime: null,
      duration: null
    };

    return round;
  }

  /**
   * Submit player drawing and calculate similarity score
   * @param round - The current round
   * @param drawing - The player's drawing
   * @returns Updated round with score and SCORED status
   */
  submitDrawing(round: Round, drawing: PlayerDrawing): Round {
    // Calculate similarity score
    const similarityScore = createSimilarityScore(drawing, round.targetShape);

    // Update round with drawing and score
    const updatedRound: Round = {
      ...round,
      playerDrawing: drawing,
      similarityScore,
      status: RoundStatus.SCORED,
      submitTime: new Date()
    };

    return updatedRound;
  }

  /**
   * Complete a round and finalize its state
   * @param round - The scored round
   * @returns Completed round with duration calculated
   */
  completeRound(round: Round): Round {
    // Calculate duration in seconds
    const duration = round.submitTime
      ? (round.submitTime.getTime() - round.startTime.getTime()) / 1000
      : 0;

    // Mark round as completed
    const completedRound: Round = {
      ...round,
      status: RoundStatus.COMPLETED,
      duration
    };

    return completedRound;
  }
}
