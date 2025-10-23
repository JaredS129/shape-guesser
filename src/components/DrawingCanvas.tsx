import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { PlayerDrawing, Stroke, Point, DrawingMetadata } from '../models';
import { generateUUID } from '../utils/idGenerator';

/**
 * Props for DrawingCanvas component
 */
interface DrawingCanvasProps {
  onSubmit: (drawing: PlayerDrawing) => void;
  width?: number;
  height?: number;
}

/**
 * DrawingCanvas component - Interactive canvas for shape drawing
 * Supports mouse and touch input, undo, clear, and submission
 */
export function DrawingCanvas({
  onSubmit,
  width = 600,
  height = 400
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startTime] = useState<Date>(new Date());

  // Redraw canvas whenever strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw all completed strokes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
    });

    // Draw current stroke in progress
    if (currentPoints.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);

      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }

      ctx.stroke();
    }
  }, [strokes, currentPoints, width, height]);

  // Get mouse/touch position relative to canvas
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, []);

  // Mouse/touch event handlers
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    setIsDrawing(true);
    setCurrentPoints([pos]);
  }, [getPosition]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getPosition(e);
    if (!pos) return;

    setCurrentPoints(prev => [...prev, pos]);
  }, [isDrawing, getPosition]);

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;

    if (currentPoints.length >= 2) {
      const stroke: Stroke = {
        strokeId: generateUUID(),
        points: currentPoints,
        timestamp: new Date(),
        pressure: new Array(currentPoints.length).fill(1.0)
      };

      setStrokes(prev => [...prev, stroke]);
    }

    setCurrentPoints([]);
    setIsDrawing(false);
  }, [isDrawing, currentPoints]);

  // Clear canvas
  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentPoints([]);
  }, []);

  // Undo last stroke
  const handleUndo = useCallback(() => {
    setStrokes(prev => prev.slice(0, -1));
  }, []);

  // Calculate drawing metadata
  const calculateMetadata = useCallback((): DrawingMetadata => {
    const totalPoints = strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
    const averageStrokeLength = strokes.length > 0 ? totalPoints / strokes.length : 0;
    const drawingDuration = (new Date().getTime() - startTime.getTime()) / 1000;

    return {
      strokeCount: strokes.length,
      totalPoints,
      drawingDuration,
      averageStrokeLength
    };
  }, [strokes, startTime]);

  // Submit drawing
  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawing: PlayerDrawing = {
      drawingId: generateUUID(),
      strokes,
      canvasBounds: { width, height },
      isEmpty: strokes.length === 0,
      bitmap: canvas.toDataURL('image/png'),
      metadata: calculateMetadata()
    };

    onSubmit(drawing);
  }, [strokes, width, height, calculateMetadata, onSubmit]);

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          border: '2px solid #ccc',
          borderRadius: '8px',
          cursor: 'crosshair',
          touchAction: 'none',
          display: 'block',
          backgroundColor: '#fff'
        }}
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="outlined"
          onClick={handleClear}
          color="error"
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          onClick={handleUndo}
          disabled={strokes.length === 0}
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          size="large"
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
}
