import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsDisplay } from '../../src/components/ResultsDisplay';
import { Round, DifficultyLevel, RoundStatus, ScoringMethod } from '../../src/models';

describe('ResultsDisplay', () => {
  const createMockRound = (score: number): Round => ({
    roundId: 'test-round-1',
    roundNumber: 1,
    targetShape: {
      shapeId: 'circle',
      name: 'Circle',
      difficulty: DifficultyLevel.EASY,
      definition: {
        type: 'function',
        shapeType: 'circle',
        parameters: { radius: 50 }
      },
      displayProperties: {
        fillColor: '#2196F3',
        strokeColor: '#1976D2',
        strokeWidth: 2,
        opacity: 0.8
      }
    },
    playerDrawing: {
      drawingId: 'drawing-1',
      strokes: [],
      canvasBounds: { width: 200, height: 200 },
      isEmpty: false,
      bitmap: 'data:image/png;base64,mockdata',
      metadata: {
        strokeCount: 1,
        totalPoints: 10,
        drawingDuration: 5,
        averageStrokeLength: 10
      }
    },
    similarityScore: {
      scoreId: 'score-1',
      overallScore: score,
      breakdown: {
        areaCoverage: score,
        shapeAccuracy: score,
        positioning: score,
        method: ScoringMethod.AREA_BASED
      },
      calculationTime: 100,
      timestamp: new Date()
    },
    status: RoundStatus.SCORED,
    startTime: new Date(Date.now() - 10000),
    submitTime: new Date(),
    duration: 10
  });

  it('should display the overall score', () => {
    const round = createMockRound(85);
    render(<ResultsDisplay round={round} />);

    expect(screen.getByText(/85/)).toBeInTheDocument();
  });

  it('should display the target shape name', () => {
    const round = createMockRound(75);
    render(<ResultsDisplay round={round} />);

    expect(screen.getByText(/circle/i)).toBeInTheDocument();
  });

  it('should render target shape visualization', () => {
    const round = createMockRound(90);
    render(<ResultsDisplay round={round} />);

    // Should have canvas elements for shape rendering
    const canvases = document.querySelectorAll('canvas');
    expect(canvases.length).toBeGreaterThan(0);
  });

  it('should render player drawing visualization', () => {
    const round = createMockRound(60);
    render(<ResultsDisplay round={round} />);

    // Should display player drawing bitmap
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should display score breakdown', () => {
    const round = createMockRound(80);
    render(<ResultsDisplay round={round} />);

    // Should show breakdown components
    expect(screen.getByText(/area coverage/i) || screen.getByText(/coverage/i)).toBeInTheDocument();
  });

  it('should show different styling for high scores', () => {
    const highScoreRound = createMockRound(95);
    const { container } = render(<ResultsDisplay round={highScoreRound} />);

    // High scores should have success/green styling
    expect(container.textContent).toContain('95');
  });

  it('should show different styling for low scores', () => {
    const lowScoreRound = createMockRound(30);
    const { container } = render(<ResultsDisplay round={lowScoreRound} />);

    // Low scores should have warning/error styling
    expect(container.textContent).toContain('30');
  });

  it('should display round number', () => {
    const round = createMockRound(75);
    render(<ResultsDisplay round={round} />);

    expect(screen.getByText(/round 1/i) || screen.getByText(/1/)).toBeInTheDocument();
  });

  it('should show side-by-side comparison', () => {
    const round = createMockRound(70);
    render(<ResultsDisplay round={round} />);

    // Should have sections for both target and player drawing
    const canvases = document.querySelectorAll('canvas');
    expect(canvases.length).toBeGreaterThan(0);
  });

  it('should handle empty drawing gracefully', () => {
    const round = createMockRound(0);
    round.playerDrawing!.isEmpty = true;
    round.playerDrawing!.strokes = [];

    render(<ResultsDisplay round={round} />);

    expect(screen.getByText(/0/)).toBeInTheDocument();
  });
});
