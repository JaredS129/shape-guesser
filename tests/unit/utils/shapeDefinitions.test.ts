import { describe, it, expect } from 'vitest';
import { DifficultyLevel } from '../../../src/models';
import {
  getAllShapes,
  getShapesByDifficulty,
  getRandomShape
} from '../../../src/utils/shapeDefinitions';

describe('shapeDefinitions', () => {
  describe('getAllShapes', () => {
    it('should have at least 10 shapes total', () => {
      const shapes = getAllShapes();
      expect(shapes.length).toBeGreaterThanOrEqual(10);
    });

    it('should return an array of TargetShape objects', () => {
      const shapes = getAllShapes();
      expect(Array.isArray(shapes)).toBe(true);
      shapes.forEach(shape => {
        expect(shape).toHaveProperty('shapeId');
        expect(shape).toHaveProperty('name');
        expect(shape).toHaveProperty('difficulty');
        expect(shape).toHaveProperty('definition');
        expect(shape).toHaveProperty('displayProperties');
      });
    });

    it('should have unique shape IDs', () => {
      const shapes = getAllShapes();
      const ids = shapes.map(s => s.shapeId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(shapes.length);
    });

    it('should have unique shape names', () => {
      const shapes = getAllShapes();
      const names = shapes.map(s => s.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(shapes.length);
    });
  });

  describe('getShapesByDifficulty', () => {
    it('should have at least 4 easy shapes', () => {
      const easyShapes = getShapesByDifficulty(DifficultyLevel.EASY);
      expect(easyShapes.length).toBeGreaterThanOrEqual(4);
    });

    it('should return only shapes with correct difficulty level', () => {
      const easyShapes = getShapesByDifficulty(DifficultyLevel.EASY);
      easyShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.EASY);
      });

      const mediumShapes = getShapesByDifficulty(DifficultyLevel.MEDIUM);
      mediumShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.MEDIUM);
      });

      const hardShapes = getShapesByDifficulty(DifficultyLevel.HARD);
      hardShapes.forEach(shape => {
        expect(shape.difficulty).toBe(DifficultyLevel.HARD);
      });
    });

    it('should have at least 3 shapes for each difficulty level', () => {
      expect(getShapesByDifficulty(DifficultyLevel.EASY).length).toBeGreaterThanOrEqual(3);
      expect(getShapesByDifficulty(DifficultyLevel.MEDIUM).length).toBeGreaterThanOrEqual(3);
      expect(getShapesByDifficulty(DifficultyLevel.HARD).length).toBeGreaterThanOrEqual(3);
    });

    it('should return empty array for invalid difficulty level', () => {
      const shapes = getShapesByDifficulty('INVALID' as DifficultyLevel);
      expect(shapes).toEqual([]);
    });
  });

  describe('getRandomShape', () => {
    it('should return a shape with the requested difficulty', () => {
      const shape = getRandomShape(DifficultyLevel.EASY);
      expect(shape.difficulty).toBe(DifficultyLevel.EASY);
    });

    it('should return different shapes over multiple calls', () => {
      const shapes = new Set();
      for (let i = 0; i < 20; i++) {
        const shape = getRandomShape(DifficultyLevel.MEDIUM);
        shapes.add(shape.shapeId);
      }
      // With enough calls, we should see at least 2 different shapes (if there are multiple)
      const mediumShapes = getShapesByDifficulty(DifficultyLevel.MEDIUM);
      if (mediumShapes.length > 1) {
        expect(shapes.size).toBeGreaterThan(1);
      }
    });

    it('should return a valid TargetShape object', () => {
      const shape = getRandomShape(DifficultyLevel.HARD);
      expect(shape).toHaveProperty('shapeId');
      expect(shape).toHaveProperty('name');
      expect(shape).toHaveProperty('difficulty');
      expect(shape).toHaveProperty('definition');
      expect(shape).toHaveProperty('displayProperties');
    });
  });

  describe('shape definitions validation', () => {
    it('should have valid display properties for all shapes', () => {
      const shapes = getAllShapes();
      shapes.forEach(shape => {
        expect(shape.displayProperties.fillColor).toMatch(/^#[0-9A-F]{6}$/i);
        expect(shape.displayProperties.strokeColor).toMatch(/^#[0-9A-F]{6}$/i);
        expect(shape.displayProperties.strokeWidth).toBeGreaterThan(0);
        expect(shape.displayProperties.opacity).toBeGreaterThanOrEqual(0);
        expect(shape.displayProperties.opacity).toBeLessThanOrEqual(1);
      });
    });

    it('should have valid definition types', () => {
      const shapes = getAllShapes();
      shapes.forEach(shape => {
        expect(['path', 'svg', 'function']).toContain(shape.definition.type);
      });
    });
  });
});
