import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryShapeRepository } from '../../../src/repositories/InMemoryShapeRepository';
import { DifficultyLevel } from '../../../src/models';

describe('InMemoryShapeRepository', () => {
  let repository: InMemoryShapeRepository;

  beforeEach(() => {
    repository = new InMemoryShapeRepository();
  });

  describe('getAllShapes', () => {
    it('should return all available shapes', () => {
      const shapes = repository.getAllShapes();
      expect(shapes.length).toBeGreaterThanOrEqual(10);
    });

    it('should return array of TargetShape objects', () => {
      const shapes = repository.getAllShapes();
      shapes.forEach(shape => {
        expect(shape).toHaveProperty('shapeId');
        expect(shape).toHaveProperty('name');
        expect(shape).toHaveProperty('difficulty');
        expect(shape).toHaveProperty('definition');
        expect(shape).toHaveProperty('displayProperties');
      });
    });
  });

  describe('getShapesByDifficulty', () => {
    it('should return only shapes with specified difficulty level', () => {
      const easyShapes = repository.getShapesByDifficulty(DifficultyLevel.EASY);
      easyShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.EASY);
      });

      const mediumShapes = repository.getShapesByDifficulty(DifficultyLevel.MEDIUM);
      mediumShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.MEDIUM);
      });

      const hardShapes = repository.getShapesByDifficulty(DifficultyLevel.HARD);
      hardShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.HARD);
      });
    });

    it('should return at least 3 shapes for each difficulty level', () => {
      expect(repository.getShapesByDifficulty(DifficultyLevel.EASY).length).toBeGreaterThanOrEqual(3);
      expect(repository.getShapesByDifficulty(DifficultyLevel.MEDIUM).length).toBeGreaterThanOrEqual(3);
      expect(repository.getShapesByDifficulty(DifficultyLevel.HARD).length).toBeGreaterThanOrEqual(3);
    });

    it('should return non-empty array for valid difficulty levels', () => {
      expect(repository.getShapesByDifficulty(DifficultyLevel.EASY).length).toBeGreaterThan(0);
      expect(repository.getShapesByDifficulty(DifficultyLevel.MEDIUM).length).toBeGreaterThan(0);
      expect(repository.getShapesByDifficulty(DifficultyLevel.HARD).length).toBeGreaterThan(0);
    });
  });

  describe('getRandomShape', () => {
    it('should return a shape with the requested difficulty', () => {
      const shape = repository.getRandomShape(DifficultyLevel.EASY);
      expect(shape.difficulty).toBe(DifficultyLevel.EASY);

      const mediumShape = repository.getRandomShape(DifficultyLevel.MEDIUM);
      expect(mediumShape.difficulty).toBe(DifficultyLevel.MEDIUM);

      const hardShape = repository.getRandomShape(DifficultyLevel.HARD);
      expect(hardShape.difficulty).toBe(DifficultyLevel.HARD);
    });

    it('should return a valid TargetShape object', () => {
      const shape = repository.getRandomShape(DifficultyLevel.MEDIUM);
      expect(shape).toHaveProperty('shapeId');
      expect(shape).toHaveProperty('name');
      expect(shape).toHaveProperty('difficulty');
      expect(shape).toHaveProperty('definition');
      expect(shape).toHaveProperty('displayProperties');
    });

    it('should return different shapes over multiple calls', () => {
      const shapes = new Set();
      for (let i = 0; i < 20; i++) {
        const shape = repository.getRandomShape(DifficultyLevel.MEDIUM);
        shapes.add(shape.shapeId);
      }
      // With enough calls, we should see at least 2 different shapes (if there are multiple)
      const mediumShapes = repository.getShapesByDifficulty(DifficultyLevel.MEDIUM);
      if (mediumShapes.length > 1) {
        expect(shapes.size).toBeGreaterThan(1);
      }
    });

    it('should return one of the shapes from the difficulty level', () => {
      const availableShapes = repository.getShapesByDifficulty(DifficultyLevel.HARD);
      const randomShape = repository.getRandomShape(DifficultyLevel.HARD);

      const shapeIds = availableShapes.map(s => s.shapeId);
      expect(shapeIds).toContain(randomShape.shapeId);
    });
  });
});
