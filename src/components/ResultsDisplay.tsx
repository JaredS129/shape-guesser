import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress
} from '@mui/material';
import { Round } from '../models';
import { ShapeRenderer } from './ShapeRenderer';

/**
 * Props for ResultsDisplay component
 */
interface ResultsDisplayProps {
  round: Round;
  onPlayAgain?: () => void;
}

/**
 * Get score color based on performance
 */
function getScoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

/**
 * Get score label based on performance
 */
function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent!';
  if (score >= 75) return 'Great!';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Keep Trying!';
}

/**
 * ResultsDisplay - Shows round results with score and comparisons
 * Displays score, target shape, player drawing, and side-by-side comparison
 * Shows loading state while score is being calculated (T073)
 */
export function ResultsDisplay({ round, onPlayAgain }: ResultsDisplayProps) {
  const score = round.similarityScore?.overallScore || 0;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  // Show loading state while score is being calculated (T073)
  // Since scoring is synchronous, this will only show briefly during state updates
  if (!round.similarityScore) {
    return (
      <Box textAlign="center" py={8}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
          Calculating your score...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Score Header */}
      <Card sx={{ mb: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Round {round.roundNumber}
          </Typography>
          <Typography variant="h2" component="div" sx={{ my: 2 }}>
            {score}
          </Typography>
          <Chip
            label={scoreLabel}
            color={scoreColor}
            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Target Shape: <strong>{round.targetShape.name}</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {/* Target Shape */}
        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Target Shape
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <ShapeRenderer shape={round.targetShape} width={300} height={300} />
              </Box>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                {round.targetShape.name}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Player Drawing */}
        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Your Drawing
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                {round.playerDrawing?.bitmap ? (
                  <img
                    src={round.playerDrawing.bitmap}
                    alt="Your drawing"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '300px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">No drawing submitted</Typography>
                )}
              </Box>
              {round.playerDrawing && (
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  {round.playerDrawing.isEmpty
                    ? 'Empty canvas'
                    : `${round.playerDrawing.metadata.strokeCount} strokes`}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Score Breakdown */}
      {round.similarityScore && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score Breakdown
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Area Coverage
                </Typography>
                <Typography variant="h6">
                  {round.similarityScore.breakdown.areaCoverage.toFixed(1)}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Calculation Time
                </Typography>
                <Typography variant="body1">
                  {round.similarityScore.calculationTime}ms
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Drawing Duration
                </Typography>
                <Typography variant="body1">
                  {round.duration?.toFixed(1)}s
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Play Another Round Button */}
      {onPlayAgain && (
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onPlayAgain}
            sx={{ minWidth: '200px' }}
          >
            Play Another Round
          </Button>
        </Box>
      )}
    </Box>
  );
}
