import { TargetShape, DifficultyLevel } from '../../models';

/**
 * Repository interface for managing shape definitions
 * Provides abstraction layer for future backend integration
 */
export interface ShapeRepository {
  /**
   * Get all shapes for a specific difficulty level
   * @param level - The difficulty level to filter by
   * @returns Array of TargetShape objects matching the difficulty
   */
  getShapesByDifficulty(level: DifficultyLevel): TargetShape[];

  /**
   * Get a random shape for the specified difficulty level
   * @param level - The difficulty level
   * @returns A randomly selected TargetShape
   */
  getRandomShape(level: DifficultyLevel): TargetShape;

  /**
   * Get all available shapes
   * @returns Array of all TargetShape objects
   */
  getAllShapes(): TargetShape[];
}
