import { useEffect, useRef } from 'react';
import { TargetShape } from '../models';

/**
 * Props for ShapeRenderer component
 */
interface ShapeRendererProps {
  shape: TargetShape;
  width?: number;
  height?: number;
}

/**
 * ShapeRenderer - Renders a TargetShape definition to canvas
 * Supports function-based, SVG path, and procedural shape definitions
 */
export function ShapeRenderer({ shape, width = 200, height = 200 }: ShapeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Apply shape display properties
    ctx.fillStyle = shape.displayProperties.fillColor;
    ctx.strokeStyle = shape.displayProperties.strokeColor;
    ctx.lineWidth = shape.displayProperties.strokeWidth;
    ctx.globalAlpha = shape.displayProperties.opacity;

    const centerX = width / 2;
    const centerY = height / 2;

    // Render based on definition type
    if (shape.definition.type === 'function') {
      const params = shape.definition.parameters;

      if (shape.definition.shapeType === 'circle') {
        const radius = params.radius || 50;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.definition.shapeType === 'rectangle') {
        const rectWidth = params.width || 100;
        const rectHeight = params.height || 100;
        const x = centerX - rectWidth / 2;
        const y = centerY - rectHeight / 2;
        ctx.fillRect(x, y, rectWidth, rectHeight);
        ctx.strokeRect(x, y, rectWidth, rectHeight);
      } else if (shape.definition.shapeType === 'ellipse') {
        const radiusX = params.radiusX || 80;
        const radiusY = params.radiusY || 50;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (shape.definition.type === 'svg') {
      try {
        const path = new Path2D(shape.definition.svgPath);
        ctx.fill(path);
        ctx.stroke(path);
      } catch (error) {
        console.error('Error rendering SVG path:', error);
      }
    }
  }, [shape, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'block'
      }}
    />
  );
}
