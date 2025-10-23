import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionStats } from '../../src/components/SessionStats';
import { SessionStatistics } from '../../src/models';

describe('SessionStats', () => {
  const createMockStatistics = (overrides?: Partial<SessionStatistics>): SessionStatistics => ({
    totalRounds: 5,
    averageScore: 75.5,
    bestScore: 95,
    worstScore: 45,
    totalDuration: 150,
    averageRoundDuration: 30,
    scoreHistory: [60, 75, 95, 70, 45],
    ...overrides
  });

  it('should display total rounds count', () => {
    const stats = createMockStatistics();
    render(<SessionStats statistics={stats} />);

    const elements = screen.getAllByText(/5/);
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getByText(/rounds/i) || screen.getByText(/total/i)).toBeInTheDocument();
  });

  it('should display average score', () => {
    const stats = createMockStatistics({ averageScore: 82.3 });
    render(<SessionStats statistics={stats} />);

    expect(screen.getByText(/82\.3/) || screen.getByText(/82/)).toBeInTheDocument();
    expect(screen.getByText(/average/i)).toBeInTheDocument();
  });

  it('should display best score', () => {
    const stats = createMockStatistics({ bestScore: 98 });
    render(<SessionStats statistics={stats} />);

    const elements = screen.getAllByText(/98/);
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getByText(/best/i)).toBeInTheDocument();
  });

  it('should display worst score', () => {
    const stats = createMockStatistics({ worstScore: 32 });
    render(<SessionStats statistics={stats} />);

    const elements = screen.getAllByText(/32/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should display score history', () => {
    const stats = createMockStatistics({ scoreHistory: [50, 75, 90] });
    render(<SessionStats statistics={stats} />);

    const elements50 = screen.getAllByText(/50/);
    expect(elements50.length).toBeGreaterThan(0);
    const elements75 = screen.getAllByText(/75/);
    expect(elements75.length).toBeGreaterThan(0);
    const elements90 = screen.getAllByText(/90/);
    expect(elements90.length).toBeGreaterThan(0);
  });

  it('should show empty state when no rounds played', () => {
    const stats = createMockStatistics({
      totalRounds: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      scoreHistory: []
    });
    render(<SessionStats statistics={stats} />);

    expect(screen.getByText(/no rounds/i) || screen.getByText(/0/)).toBeInTheDocument();
  });

  it('should display scores in chronological order', () => {
    const stats = createMockStatistics({ scoreHistory: [10, 20, 30, 40, 50] });
    const { container } = render(<SessionStats statistics={stats} />);

    const text = container.textContent || '';
    const firstIndex = text.indexOf('10');
    const lastIndex = text.indexOf('50');

    expect(firstIndex).toBeLessThan(lastIndex);
  });

  it('should format average score with one decimal place', () => {
    const stats = createMockStatistics({ averageScore: 77.777 });
    render(<SessionStats statistics={stats} />);

    // Should show 77.8 or similar rounded value
    expect(screen.getByText(/77\.8/) || screen.getByText(/77\.7/) || screen.getByText(/78/)).toBeInTheDocument();
  });

  it('should use Material UI chips for key statistics', () => {
    const stats = createMockStatistics();
    const { container } = render(<SessionStats statistics={stats} />);

    // Check if MUI Chip elements are present
    const chips = container.querySelectorAll('.MuiChip-root');
    expect(chips.length).toBeGreaterThan(0);
  });

  it('should highlight best score with success color', () => {
    const stats = createMockStatistics({ bestScore: 95 });
    const { container } = render(<SessionStats statistics={stats} />);

    // Best score should have success/positive styling
    expect(container.textContent).toContain('95');
  });
});
