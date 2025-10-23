import { Box, Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';
import { SessionStatistics } from '../models';

/**
 * Props for SessionStats component
 */
interface SessionStatsProps {
  statistics: SessionStatistics;
}

/**
 * ScoreHistory sub-component - displays chronological list of scores
 */
function ScoreHistory({ scores }: { scores: number[] }) {
  if (scores.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No scores yet
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Score History
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {scores.map((score, index) => (
          <Chip
            key={index}
            label={score}
            size="small"
            color={score >= 75 ? 'success' : score >= 50 ? 'warning' : 'default'}
          />
        ))}
      </Stack>
    </Box>
  );
}

/**
 * SessionStats component - displays session statistics
 * Shows total rounds, average score, best score, and score history
 */
export function SessionStats({ statistics }: SessionStatsProps) {
  const { totalRounds, averageScore, bestScore, worstScore, scoreHistory } = statistics;

  // Empty state
  if (totalRounds === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Session Statistics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No rounds played yet. Start drawing to begin!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Session Statistics
        </Typography>

        <Stack spacing={2} mt={2}>
          {/* Total Rounds */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Rounds
            </Typography>
            <Typography variant="h5">{totalRounds}</Typography>
          </Box>

          <Divider />

          {/* Key Statistics */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Box flex="1" minWidth="120px">
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
              <Typography variant="h6">
                {averageScore.toFixed(1)}
              </Typography>
            </Box>

            <Box flex="1" minWidth="120px">
              <Typography variant="body2" color="text.secondary">
                Best Score
              </Typography>
              <Chip
                label={bestScore}
                color="success"
                sx={{ fontSize: '1.2rem', fontWeight: 'bold', height: 'auto', padding: '4px' }}
              />
            </Box>

            <Box flex="1" minWidth="120px">
              <Typography variant="body2" color="text.secondary">
                Worst Score
              </Typography>
              <Typography variant="h6">{worstScore}</Typography>
            </Box>
          </Stack>

          <Divider />

          {/* Score History */}
          <ScoreHistory scores={scoreHistory} />
        </Stack>
      </CardContent>
    </Card>
  );
}
