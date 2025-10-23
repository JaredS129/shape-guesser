import { Round, SessionStatistics, DifficultyLevel } from '../models';

/**
 * Calculate session statistics from completed rounds
 * @param rounds - Array of completed rounds
 * @returns SessionStatistics with aggregated metrics
 */
export function calculateSessionStatistics(rounds: Round[]): SessionStatistics {
  if (rounds.length === 0) {
    return {
      totalRounds: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalDuration: 0,
      averageRoundDuration: 0,
      scoreHistory: [],
      perDifficultyStats: {}
    };
  }

  // Extract scores and durations
  const scores = rounds.map(r => r.similarityScore?.overallScore || 0);
  const durations = rounds.map(r => r.duration || 0);

  // Calculate totals
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

  // Calculate averages (rounded to 1 decimal place)
  const averageScore = Math.round((totalScore / rounds.length) * 10) / 10;
  const averageRoundDuration = Math.round((totalDuration / rounds.length) * 10) / 10;

  // Find best and worst scores
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);

  // Calculate per-difficulty statistics
  const perDifficultyStats: SessionStatistics['perDifficultyStats'] = {};

  // Group rounds by difficulty
  const roundsByDifficulty = rounds.reduce((acc, round) => {
    const difficulty = round.targetShape.difficulty;
    if (!acc[difficulty]) {
      acc[difficulty] = [];
    }
    acc[difficulty].push(round);
    return acc;
  }, {} as Record<DifficultyLevel, Round[]>);

  // Calculate stats for each difficulty
  Object.entries(roundsByDifficulty).forEach(([difficulty, difficultyRounds]) => {
    const difficultyScores = difficultyRounds.map(r => r.similarityScore?.overallScore || 0);

    if (difficultyScores.length > 0) {
      const difficultyTotalScore = difficultyScores.reduce((sum, score) => sum + score, 0);
      const difficultyAverageScore = Math.round((difficultyTotalScore / difficultyScores.length) * 10) / 10;

      perDifficultyStats[difficulty as DifficultyLevel] = {
        totalRounds: difficultyRounds.length,
        averageScore: difficultyAverageScore,
        bestScore: Math.max(...difficultyScores),
        worstScore: Math.min(...difficultyScores),
        scoreHistory: difficultyScores
      };
    }
  });

  return {
    totalRounds: rounds.length,
    averageScore,
    bestScore,
    worstScore,
    totalDuration,
    averageRoundDuration,
    scoreHistory: scores,
    perDifficultyStats
  };
}
