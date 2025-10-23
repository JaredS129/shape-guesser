import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameSession, Round, PlayerDrawing, DifficultyLevel } from '../models';
import { InMemoryGameSessionRepository } from '../repositories/InMemoryGameSessionRepository';
import { InMemoryShapeRepository } from '../repositories/InMemoryShapeRepository';
import { GameEngine } from '../services/GameEngine';

/**
 * Game State managed by context
 */
interface GameState {
  session: GameSession | null;
  currentRound: Round | null;
  isLoading: boolean;
}

/**
 * Actions for game state management
 */
type GameAction =
  | { type: 'START_SESSION'; payload: { difficulty: DifficultyLevel } }
  | { type: 'START_ROUND' }
  | { type: 'SUBMIT_DRAWING'; payload: PlayerDrawing }
  | { type: 'COMPLETE_ROUND' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean };

/**
 * Context value with state and dispatch
 */
interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  engine: GameEngine;
}

// Create context
const GameContext = createContext<GameContextValue | undefined>(undefined);

/**
 * Game state reducer
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: null, // Will be created by engine
        currentRound: null,
        isLoading: false
      };

    case 'START_ROUND':
      return {
        ...state,
        currentRound: null, // Will be set by engine
        isLoading: true
      };

    case 'SUBMIT_DRAWING':
      return {
        ...state,
        isLoading: true
      };

    case 'COMPLETE_ROUND':
      if (!state.currentRound) return state;

      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              rounds: [...state.session.rounds, state.currentRound]
            }
          : state.session,
        currentRound: null,
        isLoading: false
      };

    case 'CLEAR_SESSION':
      return {
        session: null,
        currentRound: null,
        isLoading: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
}

/**
 * GameProvider Props
 */
interface GameProviderProps {
  children: ReactNode;
  difficulty?: DifficultyLevel;
}

/**
 * GameProvider component - wraps app with game state
 */
export function GameProvider({ children, difficulty = DifficultyLevel.EASY }: GameProviderProps) {
  // Initialize repositories and engine
  const sessionRepo = React.useMemo(() => new InMemoryGameSessionRepository(), []);
  const shapeRepo = React.useMemo(() => new InMemoryShapeRepository(), []);
  const engine = React.useMemo(() => new GameEngine(sessionRepo, shapeRepo), [sessionRepo, shapeRepo]);

  // Initialize state
  const [state, dispatch] = useReducer(gameReducer, {
    session: null,
    currentRound: null,
    isLoading: false
  });

  // Create session on mount
  React.useEffect(() => {
    const session = sessionRepo.createSession(difficulty);
    const round = engine.startRound(session);

    dispatch({ type: 'START_SESSION', payload: { difficulty } });

    // Update state directly with session and round
    dispatch({ type: 'SET_LOADING', payload: false });

    // Store session in repository
    session.currentRound = round;
    sessionRepo.updateSession(session);
  }, [difficulty, sessionRepo, engine]);

  // Get current session and round from repository
  const currentSession = sessionRepo.getCurrentSession();
  const effectiveState: GameState = {
    ...state,
    session: currentSession,
    currentRound: currentSession?.currentRound || state.currentRound
  };

  const value: GameContextValue = {
    state: effectiveState,
    dispatch,
    engine
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to use game context
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/**
 * Helper hook for common game actions
 */
export function useGameActions() {
  const { state, dispatch, engine } = useGame();
  const sessionRepo = React.useMemo(() => new InMemoryGameSessionRepository(), []);

  const startRound = React.useCallback(() => {
    const session = sessionRepo.getCurrentSession();
    if (!session) return;

    const round = engine.startRound(session);
    session.currentRound = round;
    sessionRepo.updateSession(session);

    dispatch({ type: 'START_ROUND' });
  }, [dispatch, engine, sessionRepo]);

  const submitDrawing = React.useCallback((drawing: PlayerDrawing) => {
    const session = sessionRepo.getCurrentSession();
    if (!session || !session.currentRound) return;

    const scoredRound = engine.submitDrawing(session.currentRound, drawing);
    const completedRound = engine.completeRound(scoredRound);

    session.currentRound = completedRound;
    sessionRepo.updateSession(session);

    dispatch({ type: 'SUBMIT_DRAWING', payload: drawing });
  }, [dispatch, engine, sessionRepo]);

  const completeRound = React.useCallback(() => {
    const session = sessionRepo.getCurrentSession();
    if (!session || !session.currentRound) return;

    // Move current round to rounds array
    session.rounds.push(session.currentRound);
    session.currentRound = null;
    sessionRepo.updateSession(session);

    dispatch({ type: 'COMPLETE_ROUND' });
  }, [dispatch, sessionRepo]);

  return {
    state,
    startRound,
    submitDrawing,
    completeRound
  };
}
