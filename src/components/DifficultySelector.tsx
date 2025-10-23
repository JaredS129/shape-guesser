import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { DifficultyLevel } from '../models';

/**
 * Props for DifficultySelector component
 */
interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyLevel) => void;
  selectedDifficulty?: DifficultyLevel;
}

/**
 * Difficulty option configuration
 */
interface DifficultyOption {
  level: DifficultyLevel;
  label: string;
  description: string;
  color: 'success' | 'warning' | 'error';
}

const difficultyOptions: DifficultyOption[] = [
  {
    level: DifficultyLevel.EASY,
    label: 'Easy',
    description: 'Simple shapes like circles, squares, and triangles',
    color: 'success'
  },
  {
    level: DifficultyLevel.MEDIUM,
    label: 'Medium',
    description: 'More complex shapes like pentagons, hexagons, and stars',
    color: 'warning'
  },
  {
    level: DifficultyLevel.HARD,
    label: 'Hard',
    description: 'Challenging composite shapes and irregular polygons',
    color: 'error'
  }
];

/**
 * DifficultySelector component - Allows user to select game difficulty
 * Displays three difficulty options with descriptions
 */
export function DifficultySelector({ onSelect, selectedDifficulty }: DifficultySelectorProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Select Difficulty Level
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        {difficultyOptions.map(option => {
          const isSelected = selectedDifficulty === option.level;

          return (
            <Card
              key={option.level}
              sx={{
                flex: 1,
                minWidth: '200px',
                maxWidth: '300px',
                cursor: 'pointer',
                border: isSelected ? 2 : 0,
                borderColor: isSelected ? `${option.color}.main` : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => onSelect(option.level)}
            >
              <CardContent>
                <Button
                  fullWidth
                  variant={isSelected ? 'contained' : 'outlined'}
                  color={option.color}
                  size="large"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option.level);
                  }}
                >
                  {option.label}
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ minHeight: '40px' }}
                >
                  {option.description}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
