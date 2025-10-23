import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, Divider, Button, Collapse } from '@mui/material';
import { SessionStatistics, DifficultyLevel } from '../models';

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
 * Get difficulty label with emoji
 */
function getDifficultyLabel(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return '🟢 Easy';
    case DifficultyLevel.MEDIUM:
      return '🟡 Medium';
    case DifficultyLevel.HARD:
      return '🔴 Hard';
  }
}

/**
 * SessionStats component - displays session statistics
 * Shows total rounds, average score, best score, and score history
 * Optionally displays per-difficulty statistics
 */
export function SessionStats({ statistics }: SessionStatsProps) {
  const { totalRounds, averageScore, bestScore, worstScore, scoreHistory, perDifficultyStats } = statistics;
  const [showPerDifficulty, setShowPerDifficulty] = React.useState(false);

  // Check if we have per-difficulty stats to show
  const hasPerDifficultyStats = perDifficultyStats && Object.keys(perDifficultyStats).length > 1;

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Session Statistics
          </Typography>
          {hasPerDifficultyStats && (
            <Button
              size="small"
              onClick={() => setShowPerDifficulty(!showPerDifficulty)}
              variant="text"
            >
              {showPerDifficulty ? 'Show Overall' : 'Show Per-Difficulty'}
            </Button>
          )}
        </Stack>

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

          {/* Per-Difficulty Statistics */}
          {hasPerDifficultyStats && (
            <Collapse in={showPerDifficulty}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Per-Difficulty Statistics
              </Typography>
              <Stack spacing={2}>
                {Object.entries(perDifficultyStats).map(([difficulty, stats]) => (
                  <Box key={difficulty}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {getDifficultyLabel(difficulty as DifficultyLevel)}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Rounds
                        </Typography>
                        <Typography variant="body2">{stats.totalRounds}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Avg
                        </Typography>
                        <Typography variant="body2">{stats.averageScore.toFixed(1)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Best
                        </Typography>
                        <Typography variant="body2">{stats.bestScore}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Worst
                        </Typography>
                        <Typography variant="body2">{stats.worstScore}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
