import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useGame } from '../context/GameContext';
import { DrawingCanvas } from './DrawingCanvas';
import { ResultsDisplay } from './ResultsDisplay';
import { PlayerDrawing, RoundStatus } from '../models';

/**
 * GameContainer - Main game orchestration component
 * Manages game flow: DRAWING → SCORED → COMPLETED
 */
export function GameContainer() {
  const { state, dispatch, engine } = useGame();
  const currentSession = state.session;
  const currentRound = state.currentRound;

  // Handle drawing submission
  const handleSubmit = React.useCallback((drawing: PlayerDrawing) => {
    if (!currentSession || !currentRound) return;

    // Score the drawing
    const scoredRound = engine.submitDrawing(currentRound, drawing);
    const completedRound = engine.completeRound(scoredRound);

    // Update session
    currentSession.currentRound = completedRound;

    // This will trigger a re-render with the new state
    dispatch({ type: 'SUBMIT_DRAWING', payload: drawing });
  }, [currentSession, currentRound, engine, dispatch]);

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
          <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Draw the Shape!
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
      return <ResultsDisplay round={currentRound} />;
    }

    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Shape Guesser
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Draw the shape and see how well you match!
        </Typography>
      </Box>

      {renderContent()}
    </Container>
  );
}
