import React from 'react';
import { Box, Container, Typography, Paper, Chip } from '@mui/material';
import { useGame, useGameActions } from '../context/GameContext';
import { DrawingCanvas } from './DrawingCanvas';
import { ResultsDisplay } from './ResultsDisplay';
import { SessionStats } from './SessionStats';
import { PlayerDrawing, RoundStatus, DifficultyLevel } from '../models';
import { calculateSessionStatistics } from '../services/StatisticsService';

/**
 * Get difficulty chip properties
 */
function getDifficultyChipProps(difficulty: DifficultyLevel): { label: string; color: 'success' | 'warning' | 'error' } {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return { label: 'Easy', color: 'success' };
    case DifficultyLevel.MEDIUM:
      return { label: 'Medium', color: 'warning' };
    case DifficultyLevel.HARD:
      return { label: 'Hard', color: 'error' };
  }
}

/**
 * GameContainer - Main game orchestration component
 * Manages game flow: DRAWING → SCORED → COMPLETED
 */
export function GameContainer() {
  const { state } = useGame();
  const { submitDrawing, playAnotherRound } = useGameActions();
  const currentSession = state.session;
  const currentRound = state.currentRound;

  // Handle drawing submission
  const handleSubmit = React.useCallback((drawing: PlayerDrawing) => {
    submitDrawing(drawing);
  }, [submitDrawing]);

  // Handle play another round
  const handlePlayAgain = React.useCallback(() => {
    playAnotherRound();
  }, [playAnotherRound]);

  // Calculate session statistics
  const sessionStats = React.useMemo(() => {
    if (!currentSession) return null;
    return calculateSessionStatistics(currentSession.rounds);
  }, [currentSession]);

  // Determine what to display based on round status
  const renderContent = () => {
    if (!currentRound) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="h5" color="text.secondary">
            Loading game...
          </Typography>
        </Box>
      );
    }

    // Show drawing canvas during DRAWING phase
    if (currentRound.status === RoundStatus.DRAWING) {
      return (
        <Box>
          {/* Show session stats if rounds have been played */}
          {sessionStats && sessionStats.totalRounds > 0 && (
            <Box mb={3}>
              <SessionStats statistics={sessionStats} />
            </Box>
          )}

          <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Round {currentRound.roundNumber}: Draw the Shape!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try to draw the shape as accurately as you can. Use the canvas below.
            </Typography>
          </Paper>

          <Box display="flex" justifyContent="center">
            <DrawingCanvas onSubmit={handleSubmit} width={600} height={400} />
          </Box>
        </Box>
      );
    }

    // Show results after scoring
    if (currentRound.status === RoundStatus.SCORED || currentRound.status === RoundStatus.COMPLETED) {
      return (
        <Box>
          <ResultsDisplay round={currentRound} onPlayAgain={handlePlayAgain} />

          {/* Show session statistics */}
          {sessionStats && sessionStats.totalRounds > 0 && (
            <Box mt={3}>
              <SessionStats statistics={sessionStats} />
            </Box>
          )}
        </Box>
      );
    }

    return null;
  };

  // Get difficulty chip properties
  const difficultyChip = currentSession ? getDifficultyChipProps(currentSession.difficulty) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Shape Guesser
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Typography variant="subtitle1" color="text.secondary">
            Draw the shape and see how well you match!
          </Typography>
          {difficultyChip && (
            <Chip
              label={difficultyChip.label}
              color={difficultyChip.color}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      </Box>

      {renderContent()}
    </Container>
  );
}
