import { DifficultyLevel, RoundStatus, ScoringMethod } from './enums';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  strokeId: string;
  points: Point[];
  timestamp: Date;
  pressure: number[];
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface DrawingMetadata {
  strokeCount: number;
  totalPoints: number;
  drawingDuration: number;
  averageStrokeLength: number;
}

export interface PlayerDrawing {
  drawingId: string;
  strokes: Stroke[];
  canvasBounds: CanvasDimensions;
  isEmpty: boolean;
  bitmap: string | null;
  metadata: DrawingMetadata;
}

export interface ScoreBreakdown {
  areaCoverage: number;
  shapeAccuracy: number;
  positioning: number;
  method: ScoringMethod;
}

export interface SimilarityScore {
  scoreId: string;
  overallScore: number;
  breakdown: ScoreBreakdown;
  calculationTime: number;
  timestamp: Date;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeDisplayProps {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export type ShapeDefinition = PathDefinition | SVGDefinition | FunctionDefinition;

export interface PathDefinition {
  type: 'path';
  commands: PathCommand[];
  bounds: BoundingBox;
}

export interface PathCommand {
  command: string;
  points: number[];
}

export interface SVGDefinition {
  type: 'svg';
  svgPath: string;
  viewBox: { width: number; height: number };
}

export interface FunctionDefinition {
  type: 'function';
  shapeType: 'circle' | 'rectangle' | 'ellipse';
  parameters: Record<string, number>;
}

export interface TargetShape {
  shapeId: string;
  name: string;
  difficulty: DifficultyLevel;
  definition: ShapeDefinition;
  displayProperties: ShapeDisplayProps;
}

export interface Round {
  roundId: string;
  roundNumber: number;
  targetShape: TargetShape;
  playerDrawing: PlayerDrawing | null;
  similarityScore: SimilarityScore | null;
  status: RoundStatus;
  startTime: Date;
  submitTime: Date | null;
  duration: number | null;
}

export interface SessionStatistics {
  totalRounds: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalDuration: number;
  averageRoundDuration: number;
  scoreHistory: number[];
}

export interface GameSession {
  sessionId: string;
  startTime: Date;
  rounds: Round[];
  statistics: SessionStatistics;
  difficulty: DifficultyLevel;
  currentRound: Round | null;
}
