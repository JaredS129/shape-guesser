import { Round, SessionStatistics } from '../models';

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
      scoreHistory: []
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

  return {
    totalRounds: rounds.length,
    averageScore,
    bestScore,
    worstScore,
    totalDuration,
    averageRoundDuration,
    scoreHistory: scores
  };
}
