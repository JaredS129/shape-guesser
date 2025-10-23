import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GameProvider } from './context/GameContext';
import { GameContainer } from './components/GameContainer';
import { DifficultyLevel } from './models';

// Create Material UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider difficulty={DifficultyLevel.EASY}>
        <GameContainer />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
