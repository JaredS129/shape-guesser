import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DrawingCanvas } from '../../src/components/DrawingCanvas';

describe('DrawingCanvas', () => {
  it('should render canvas element', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render control buttons', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should call onSubmit when submit button is clicked', () => {
    const handleSubmit = vi.fn();
    render(<DrawingCanvas onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      drawingId: expect.any(String),
      strokes: expect.any(Array),
      canvasBounds: expect.objectContaining({
        width: expect.any(Number),
        height: expect.any(Number)
      }),
      isEmpty: expect.any(Boolean),
      bitmap: expect.any(String),
      metadata: expect.objectContaining({
        strokeCount: expect.any(Number),
        totalPoints: expect.any(Number),
        drawingDuration: expect.any(Number),
        averageStrokeLength: expect.any(Number)
      })
    }));
  });

  it('should have undo button disabled when no strokes', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).toBeDisabled();
  });

  it('should enable undo button after drawing', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);
    const canvas = document.querySelector('canvas');

    // Simulate drawing
    fireEvent.mouseDown(canvas!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas!, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas!);

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).not.toBeDisabled();
  });

  it('should clear canvas when clear button is clicked', () => {
    const handleSubmit = vi.fn();
    render(<DrawingCanvas onSubmit={handleSubmit} />);
    const canvas = document.querySelector('canvas');

    // Draw something
    fireEvent.mouseDown(canvas!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas!, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas!);

    // Clear
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    // Submit and check isEmpty
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      isEmpty: true,
      strokes: []
    }));
  });

  it('should support touch events', () => {
    render(<DrawingCanvas onSubmit={vi.fn()} />);
    const canvas = document.querySelector('canvas');

    fireEvent.touchStart(canvas!, {
      touches: [{ clientX: 10, clientY: 10 }]
    });
    fireEvent.touchMove(canvas!, {
      touches: [{ clientX: 20, clientY: 20 }]
    });
    fireEvent.touchEnd(canvas!);

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).not.toBeDisabled();
  });

  it('should create PlayerDrawing with correct metadata', () => {
    const handleSubmit = vi.fn();
    render(<DrawingCanvas onSubmit={handleSubmit} />);
    const canvas = document.querySelector('canvas');

    // Draw two strokes
    fireEvent.mouseDown(canvas!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas!, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(canvas!, { clientX: 30, clientY: 30 });
    fireEvent.mouseUp(canvas!);

    fireEvent.mouseDown(canvas!, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(canvas!, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(canvas!);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({
        strokeCount: 2,
        totalPoints: expect.any(Number)
      })
    }));
  });

  it('should include bitmap data in submission', () => {
    const handleSubmit = vi.fn();
    render(<DrawingCanvas onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      bitmap: expect.stringContaining('data:image')
    }));
  });
});
