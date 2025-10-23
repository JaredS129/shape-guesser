export enum RoundStatus {
  DRAWING = 'DRAWING',      // Player actively drawing
  SUBMITTED = 'SUBMITTED',  // Drawing submitted, scoring in progress
  SCORED = 'SCORED',        // Score calculated, showing results
  COMPLETED = 'COMPLETED'   // Results viewed, ready for next round
}

export enum DifficultyLevel {
  EASY = 'EASY',      // Simple geometric forms (circle, square, triangle, rectangle)
  MEDIUM = 'MEDIUM',  // Complex forms (pentagon, hexagon, star, heart)
  HARD = 'HARD'       // Composite/irregular patterns
}

export enum ScoringMethod {
  AREA_BASED = 'AREA_BASED',  // Internal area coverage comparison (MVP approach)
  EDGE_BASED = 'EDGE_BASED',  // Outline matching (future)
  HYBRID = 'HYBRID'           // Weighted combination (future)
}
