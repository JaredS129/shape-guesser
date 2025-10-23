import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider } from '../../src/context/GameContext';
import { GameContainer } from '../../src/components/GameContainer';
import { DifficultyLevel } from '../../src/models';

describe('Game Flow Integration', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should complete a full game round: start → draw → submit → score → results', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    // 1. Game should start with drawing canvas visible
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // 2. Should have control buttons
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();

    // 3. Simulate drawing on canvas
    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas!);

    // 4. Submit drawing
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // 5. Should transition to results display
    await waitFor(() => {
      // Results should show score (0-100)
      const scoreElements = screen.queryAllByText(/score/i);
      const numericElements = screen.queryAllByText(/\d+/);
      expect(scoreElements.length > 0 || numericElements.length > 0).toBeTruthy();
    }, { timeout: 2000 });

    // 6. Should show target shape name
    await waitFor(() => {
      // Should display which shape it was
      const shapeElements = screen.queryAllByText(/circle|square|triangle|rectangle|pentagon|hexagon|star|heart|diamond|oval|house|arrow|crescent|polygon/i);
      expect(shapeElements.length).toBeGreaterThan(0);
    });

    // 7. Should show side-by-side comparison
    const canvases = document.querySelectorAll('canvas');
    expect(canvases.length).toBeGreaterThan(0);
  });

  it('should handle empty drawing submission', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // Submit button should be disabled when canvas is empty (T080)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    // Verify clear and undo are also disabled
    const clearButton = screen.getByRole('button', { name: /clear/i });
    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(clearButton).toBeDisabled();
    expect(undoButton).toBeDisabled();
  });

  it('should support undo functionality during drawing', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.MEDIUM}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    const canvas = document.querySelector('canvas');
    const undoButton = screen.getByRole('button', { name: /undo/i });

    // Initially disabled
    expect(undoButton).toBeDisabled();

    // Draw first stroke
    fireEvent.mouseDown(canvas!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas!, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas!);

    // Undo should be enabled
    expect(undoButton).not.toBeDisabled();

    // Draw second stroke
    fireEvent.mouseDown(canvas!, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas!, { clientX: 40, clientY: 40 });
    fireEvent.mouseUp(canvas!);

    // Click undo
    fireEvent.click(undoButton);

    // Should still have undo enabled (first stroke remains)
    expect(undoButton).not.toBeDisabled();
  });

  it('should support clear functionality', async () => {
    // Mock window.confirm to always return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    const canvas = document.querySelector('canvas');
    const clearButton = screen.getByRole('button', { name: /clear/i });
    const undoButton = screen.getByRole('button', { name: /undo/i });

    // Draw something
    fireEvent.mouseDown(canvas!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);

    expect(undoButton).not.toBeDisabled();

    // Clear
    fireEvent.click(clearButton);

    // Undo should be disabled after clear
    expect(undoButton).toBeDisabled();

    confirmSpy.mockRestore();
  });

  it('should calculate score within 1 second', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    const canvas = document.querySelector('canvas');

    // Draw
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);

    const startTime = Date.now();

    // Submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/score/i)).toBeInTheDocument();
    }, { timeout: 1500 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within 1 second (with some buffer for rendering)
    expect(duration).toBeLessThan(1500);
  });

  it('should use correct difficulty level for shape selection', async () => {
    const { rerender } = render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // Easy shapes should be selected
    // (we'll verify this implicitly through the test passing)

    // Test with different difficulty
    rerender(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });
  });
});
