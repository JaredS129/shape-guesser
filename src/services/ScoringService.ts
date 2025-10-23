import { PlayerDrawing, TargetShape, SimilarityScore, ScoringMethod } from '../models';
import { generateUUID } from '../utils/idGenerator';

/**
 * Calculate area-based similarity score between a player drawing and target shape
 * Uses pixel comparison approach to determine how closely the drawing matches the target
 *
 * @param drawing - The player's drawing
 * @param target - The target shape to compare against
 * @returns Similarity score from 0 to 100
 */
export function calculateAreaSimilarity(
  drawing: PlayerDrawing,
  target: TargetShape
): number {
  // Handle empty drawing (per FR-012)
  if (drawing.isEmpty || drawing.strokes.length === 0) {
    return 0;
  }

  try {
    // Convert both drawing and target to bitmaps
    const drawingBitmap = convertDrawingToBitmap(drawing);
    const targetBitmap = convertShapeToBitmap(target, drawing.canvasBounds);

    // Calculate pixel overlap
    const overlapPixels = countOverlappingPixels(drawingBitmap, targetBitmap);
    const totalTargetPixels = countFilledPixels(targetBitmap);

    // Avoid division by zero
    if (totalTargetPixels === 0) {
      return 0;
    }

    // Calculate similarity percentage
    const similarity = (overlapPixels / totalTargetPixels) * 100;

    // Return score clamped between 0-100 and rounded to integer
    return Math.round(Math.min(100, Math.max(0, similarity)));
  } catch (error) {
    // In case of any error during calculation, return a low score
    console.error('Error calculating similarity:', error);
    return 0;
  }
}

/**
 * Create a complete SimilarityScore object with breakdown
 *
 * @param drawing - The player's drawing
 * @param target - The target shape
 * @returns Complete SimilarityScore with metadata
 */
export function createSimilarityScore(
  drawing: PlayerDrawing,
  target: TargetShape
): SimilarityScore {
  const startTime = Date.now();
  const overallScore = calculateAreaSimilarity(drawing, target);
  const calculationTime = Date.now() - startTime;

  return {
    scoreId: generateUUID(),
    overallScore,
    breakdown: {
      areaCoverage: overallScore,
      shapeAccuracy: overallScore, // Simplified for MVP
      positioning: overallScore,   // Simplified for MVP
      method: ScoringMethod.AREA_BASED
    },
    calculationTime,
    timestamp: new Date()
  };
}

/**
 * Convert player drawing to bitmap ImageData
 * If bitmap is available, parse it; otherwise render from strokes
 *
 * @param drawing - The player drawing
 * @returns ImageData representing the drawing
 */
function convertDrawingToBitmap(drawing: PlayerDrawing): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = drawing.canvasBounds.width;
  canvas.height = drawing.canvasBounds.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  // If bitmap data is available, use it
  if (drawing.bitmap && drawing.bitmap.startsWith('data:image')) {
    const img = new Image();
    img.src = drawing.bitmap;
    // For synchronous processing, we need to draw immediately
    // In a real scenario, this would be async, but for scoring we assume bitmap is already loaded
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Otherwise, render from strokes
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  drawing.strokes.forEach(stroke => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }

    ctx.stroke();
  });

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Convert target shape to bitmap ImageData
 *
 * @param target - The target shape
 * @param canvasBounds - Canvas dimensions to match drawing
 * @returns ImageData representing the shape
 */
function convertShapeToBitmap(
  target: TargetShape,
  canvasBounds: { width: number; height: number }
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = canvasBounds.width;
  canvas.height = canvasBounds.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render shape based on definition type
  ctx.fillStyle = target.displayProperties.fillColor;
  ctx.strokeStyle = target.displayProperties.strokeColor;
  ctx.lineWidth = target.displayProperties.strokeWidth;
  ctx.globalAlpha = target.displayProperties.opacity;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (target.definition.type === 'function') {
    const params = target.definition.parameters;

    if (target.definition.shapeType === 'circle') {
      const radius = params.radius || 50;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (target.definition.shapeType === 'rectangle') {
      const width = params.width || 100;
      const height = params.height || 100;
      ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
      ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
    } else if (target.definition.shapeType === 'ellipse') {
      const radiusX = params.radiusX || 80;
      const radiusY = params.radiusY || 50;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (target.definition.type === 'svg') {
    // Parse and render SVG path
    const path = new Path2D(target.definition.svgPath);
    ctx.fill(path);
    ctx.stroke(path);
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Count pixels that overlap between two bitmaps
 *
 * @param bitmap1 - First bitmap
 * @param bitmap2 - Second bitmap
 * @returns Number of overlapping filled pixels
 */
function countOverlappingPixels(bitmap1: ImageData, bitmap2: ImageData): number {
  if (bitmap1.width !== bitmap2.width || bitmap1.height !== bitmap2.height) {
    throw new Error('Bitmaps must have same dimensions');
  }

  let overlapCount = 0;
  const data1 = bitmap1.data;
  const data2 = bitmap2.data;

  // Each pixel has 4 values (RGBA)
  for (let i = 0; i < data1.length; i += 4) {
    // Check if pixel is filled (not white/transparent)
    const isPixel1Filled = data1[i + 3] > 128; // Alpha channel
    const isPixel2Filled = data2[i + 3] > 128;

    // Alternative: check if not white
    const isPixel1NotWhite = data1[i] < 200 || data1[i + 1] < 200 || data1[i + 2] < 200;
    const isPixel2NotWhite = data2[i] < 200 || data2[i + 1] < 200 || data2[i + 2] < 200;

    if ((isPixel1Filled || isPixel1NotWhite) && (isPixel2Filled || isPixel2NotWhite)) {
      overlapCount++;
    }
  }

  return overlapCount;
}

/**
 * Count filled pixels in a bitmap
 *
 * @param bitmap - The bitmap to analyze
 * @returns Number of filled pixels
 */
function countFilledPixels(bitmap: ImageData): number {
  let filledCount = 0;
  const data = bitmap.data;

  // Each pixel has 4 values (RGBA)
  for (let i = 0; i < data.length; i += 4) {
    // Check if pixel is filled (not white/transparent)
    const isPixelFilled = data[i + 3] > 128; // Alpha channel
    const isPixelNotWhite = data[i] < 200 || data[i + 1] < 200 || data[i + 2] < 200;

    if (isPixelFilled || isPixelNotWhite) {
      filledCount++;
    }
  }

  return filledCount;
}
