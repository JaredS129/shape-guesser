import { TargetShape, DifficultyLevel } from '../models';
import { ShapeRepository } from './interfaces/ShapeRepository';
import {
  getAllShapes as getShapeDefinitions,
  getShapesByDifficulty as filterShapesByDifficulty,
  getRandomShape as selectRandomShape
} from '../utils/shapeDefinitions';

/**
 * In-memory implementation of ShapeRepository
 * Wraps the shape definitions utility functions
 * Suitable for MVP and can be swapped with API-backed implementation later
 */
export class InMemoryShapeRepository implements ShapeRepository {
  /**
   * Get all shapes for a specific difficulty level
   * @param level - The difficulty level to filter by
   * @returns Array of TargetShape objects matching the difficulty
   */
  getShapesByDifficulty(level: DifficultyLevel): TargetShape[] {
    return filterShapesByDifficulty(level);
  }

  /**
   * Get a random shape for the specified difficulty level
   * @param level - The difficulty level
   * @returns A randomly selected TargetShape
   */
  getRandomShape(level: DifficultyLevel): TargetShape {
    return selectRandomShape(level);
  }

  /**
   * Get all available shapes
   * @returns Array of all TargetShape objects
   */
  getAllShapes(): TargetShape[] {
    return getShapeDefinitions();
  }
}
