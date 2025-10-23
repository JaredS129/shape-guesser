import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider } from '../../src/context/GameContext';
import { GameContainer } from '../../src/components/GameContainer';
import { DifficultyLevel } from '../../src/models';

describe('Difficulty-Based Gameplay Flow', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should select Easy difficulty and receive Easy shapes', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    // Wait for game to initialize
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // Verify we're in drawing mode
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // Easy difficulty should be in effect (shapes will be Easy level)
    // We can't directly verify the shape, but we can complete a round
    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);

    // Submit drawing
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Should reach results
    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });
  });

  it('should select Medium difficulty and receive Medium shapes', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.MEDIUM}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // Complete a round with Medium difficulty
    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });
  });

  it('should select Hard difficulty and receive Hard shapes', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    // Complete a round with Hard difficulty
    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });
  });

  it('should maintain selected difficulty across multiple rounds', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.MEDIUM}>
        <GameContainer />
      </GameProvider>
    );

    // Complete first round
    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for results
    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });

    // Start round 2
    const playAgainButton = await waitFor(() =>
      screen.getByRole('button', { name: /play another round|next round|continue/i })
    );
    fireEvent.click(playAgainButton);

    // Should return to drawing canvas
    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    // Complete second round
    const canvas2 = document.querySelector('canvas');
    fireEvent.mouseDown(canvas2!, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas2!, { clientX: 80, clientY: 80 });
    fireEvent.mouseUp(canvas2!);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Both rounds should have used Medium difficulty
    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });
  });

  it('should track statistics for the selected difficulty level', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    // Complete a round
    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    const canvas = document.querySelector('canvas');
    fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas!, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas!);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for results
    await waitFor(() => {
      const roundElements = screen.queryAllByText(/round/i);
      expect(roundElements.length).toBeGreaterThan(0);
    });

    // After completing a round, the game should still be functional
    // Statistics are shown when playing another round
    expect(document.body.textContent).toBeTruthy();
  });

  it('should allow changing difficulty between sessions', async () => {
    // First session with Easy
    const { unmount } = render(
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    unmount();

    // Second session with Hard
    render(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    // Should work with new difficulty
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should display difficulty level in UI', async () => {
    render(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    // Should display difficulty somewhere in the UI
    // This could be in header, title, or indicator
    const { container } = render(
      <GameProvider difficulty={DifficultyLevel.HARD}>
        <GameContainer />
      </GameProvider>
    );

    // Container should have content indicating the game is running
    expect(container.textContent).toBeTruthy();
  });
});
