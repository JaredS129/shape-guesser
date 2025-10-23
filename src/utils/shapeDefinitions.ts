import { TargetShape, DifficultyLevel } from '../models';

/**
 * Predefined target shapes for the game
 * Includes at least 10 shapes across three difficulty levels
 */
const shapes: TargetShape[] = [
  // EASY shapes (simple geometric forms)
  {
    shapeId: 'circle',
    name: 'Circle',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'function',
      shapeType: 'circle',
      parameters: { radius: 80 }
    },
    displayProperties: {
      fillColor: '#2196F3',
      strokeColor: '#1976D2',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'square',
    name: 'Square',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'function',
      shapeType: 'rectangle',
      parameters: { width: 150, height: 150 }
    },
    displayProperties: {
      fillColor: '#4CAF50',
      strokeColor: '#388E3C',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'triangle',
    name: 'Triangle',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 L 180,180 L 20,180 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#FF9800',
      strokeColor: '#F57C00',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'rectangle',
    name: 'Rectangle',
    difficulty: DifficultyLevel.EASY,
    definition: {
      type: 'function',
      shapeType: 'rectangle',
      parameters: { width: 200, height: 120 }
    },
    displayProperties: {
      fillColor: '#9C27B0',
      strokeColor: '#7B1FA2',
      strokeWidth: 2,
      opacity: 0.8
    }
  },

  // MEDIUM shapes (complex forms)
  {
    shapeId: 'pentagon',
    name: 'Pentagon',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 L 175,80 L 145,165 L 55,165 L 25,80 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#E91E63',
      strokeColor: '#C2185B',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'hexagon',
    name: 'Hexagon',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 L 170,60 L 170,140 L 100,180 L 30,140 L 30,60 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#00BCD4',
      strokeColor: '#0097A7',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'star',
    name: 'Star',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 L 115,75 L 170,75 L 125,110 L 145,165 L 100,130 L 55,165 L 75,110 L 30,75 L 85,75 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#FFEB3B',
      strokeColor: '#FBC02D',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'heart',
    name: 'Heart',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'svg',
      svgPath: 'M 100,170 C 60,140 20,100 20,60 C 20,30 40,10 70,10 C 85,10 95,20 100,30 C 105,20 115,10 130,10 C 160,10 180,30 180,60 C 180,100 140,140 100,170 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#F44336',
      strokeColor: '#D32F2F',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'diamond',
    name: 'Diamond',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 L 180,100 L 100,180 L 20,100 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#3F51B5',
      strokeColor: '#303F9F',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'oval',
    name: 'Oval',
    difficulty: DifficultyLevel.MEDIUM,
    definition: {
      type: 'function',
      shapeType: 'ellipse',
      parameters: { radiusX: 100, radiusY: 60 }
    },
    displayProperties: {
      fillColor: '#8BC34A',
      strokeColor: '#689F38',
      strokeWidth: 2,
      opacity: 0.8
    }
  },

  // HARD shapes (composite/irregular patterns)
  {
    shapeId: 'house',
    name: 'House',
    difficulty: DifficultyLevel.HARD,
    definition: {
      type: 'svg',
      svgPath: 'M 50,100 L 50,180 L 150,180 L 150,100 L 150,100 M 30,100 L 100,40 L 170,100 M 80,130 L 80,180 M 120,130 L 120,180 L 120,160 L 80,160',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#795548',
      strokeColor: '#5D4037',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'arrow',
    name: 'Arrow',
    difficulty: DifficultyLevel.HARD,
    definition: {
      type: 'svg',
      svgPath: 'M 20,100 L 120,100 L 120,60 L 180,110 L 120,160 L 120,120 L 20,120 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#FF5722',
      strokeColor: '#E64A19',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'crescent',
    name: 'Crescent',
    difficulty: DifficultyLevel.HARD,
    definition: {
      type: 'svg',
      svgPath: 'M 100,20 A 80,80 0 1,0 100,180 A 60,60 0 1,1 100,20 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#FFC107',
      strokeColor: '#FFA000',
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  {
    shapeId: 'irregular-polygon',
    name: 'Irregular Polygon',
    difficulty: DifficultyLevel.HARD,
    definition: {
      type: 'svg',
      svgPath: 'M 50,50 L 150,40 L 180,110 L 140,170 L 60,160 L 30,100 Z',
      viewBox: { width: 200, height: 200 }
    },
    displayProperties: {
      fillColor: '#607D8B',
      strokeColor: '#455A64',
      strokeWidth: 2,
      opacity: 0.8
    }
  }
];

/**
 * Get all available shapes
 * @returns Array of all target shapes
 */
export function getAllShapes(): TargetShape[] {
  return shapes;
}

/**
 * Get shapes filtered by difficulty level
 * @param level - The difficulty level to filter by
 * @returns Array of shapes matching the difficulty level
 */
export function getShapesByDifficulty(level: DifficultyLevel): TargetShape[] {
  return shapes.filter(shape => shape.difficulty === level);
}

/**
 * Get a random shape for the specified difficulty level
 * @param level - The difficulty level
 * @returns A random TargetShape of the specified difficulty
 */
export function getRandomShape(level: DifficultyLevel): TargetShape {
  const filtered = getShapesByDifficulty(level);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
