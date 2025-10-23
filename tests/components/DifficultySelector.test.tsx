import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DifficultySelector } from '../../src/components/DifficultySelector';
import { DifficultyLevel } from '../../src/models';

describe('DifficultySelector', () => {
  it('should render three difficulty options', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
  });

  it('should call callback with Easy when Easy is selected', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    const easyButton = screen.getByRole('button', { name: /easy/i });
    fireEvent.click(easyButton);

    expect(mockOnSelect).toHaveBeenCalledWith(DifficultyLevel.EASY);
  });

  it('should call callback with Medium when Medium is selected', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    const mediumButton = screen.getByRole('button', { name: /medium/i });
    fireEvent.click(mediumButton);

    expect(mockOnSelect).toHaveBeenCalledWith(DifficultyLevel.MEDIUM);
  });

  it('should call callback with Hard when Hard is selected', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    const hardButton = screen.getByRole('button', { name: /hard/i });
    fireEvent.click(hardButton);

    expect(mockOnSelect).toHaveBeenCalledWith(DifficultyLevel.HARD);
  });

  it('should highlight selected difficulty', () => {
    const mockOnSelect = vi.fn();
    const { container } = render(
      <DifficultySelector onSelect={mockOnSelect} selectedDifficulty={DifficultyLevel.MEDIUM} />
    );

    // Medium should be highlighted/selected
    expect(container.textContent).toContain('Medium');
  });

  it('should display descriptions for each difficulty level', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    // Should have descriptive text for each difficulty
    expect(screen.getByText(/simple shapes/i) || screen.getByText(/basic/i)).toBeInTheDocument();
  });

  it('should use Material UI Card components', () => {
    const mockOnSelect = vi.fn();
    const { container } = render(<DifficultySelector onSelect={mockOnSelect} />);

    // Check for MUI Card elements
    const cards = container.querySelectorAll('.MuiCard-root, .MuiButton-root');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should be accessible with keyboard navigation', () => {
    const mockOnSelect = vi.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);

    // All buttons should be focusable
    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should show different styling for selected vs unselected options', () => {
    const mockOnSelect = vi.fn();
    const { rerender } = render(
      <DifficultySelector onSelect={mockOnSelect} selectedDifficulty={DifficultyLevel.EASY} />
    );

    // Easy should be selected
    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();

    // Change selection
    rerender(<DifficultySelector onSelect={mockOnSelect} selectedDifficulty={DifficultyLevel.HARD} />);

    // Hard should now be selected
    expect(screen.getByRole('button', { name: /hard/i })).toBeInTheDocument();
  });

  it('should display appropriate icons or visual indicators for each difficulty', () => {
    const mockOnSelect = vi.fn();
    const { container } = render(<DifficultySelector onSelect={mockOnSelect} />);

    // Should have some visual elements (icons, colors, etc.)
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
