import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * HelpDialog - Displays game instructions and help information
 */
export function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>How to Play Shape Guesser</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6" gutterBottom>
            Objective
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Draw shapes that match the hidden target shape as closely as possible. Your drawing will be
            compared to the target shape and scored from 0-100 based on similarity.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            How to Draw
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Mouse/Trackpad"
                secondary="Click and drag to draw on the canvas"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Touch Screen"
                secondary="Tap and drag your finger to draw"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Undo" secondary="Remove the last stroke you drew" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Clear" secondary="Erase all strokes and start over" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Submit" secondary="Finish your drawing and see your score" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Scoring
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your score is calculated based on how much of the target shape your drawing covers:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="90-100" secondary="Excellent! Nearly perfect match" />
            </ListItem>
            <ListItem>
              <ListItemText primary="75-89" secondary="Great! Very close to the target" />
            </ListItem>
            <ListItem>
              <ListItemText primary="60-74" secondary="Good! Getting there" />
            </ListItem>
            <ListItem>
              <ListItemText primary="40-59" secondary="Fair - keep practicing" />
            </ListItem>
            <ListItem>
              <ListItemText primary="0-39" secondary="Keep trying! You'll improve" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Difficulty Levels
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Easy"
                secondary="Simple shapes like circles, squares, and triangles"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Medium"
                secondary="More complex shapes like pentagons, hexagons, and stars"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Hard"
                secondary="Challenging composite shapes and irregular polygons"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Tips
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText secondary="Take your time - there's no time limit" />
            </ListItem>
            <ListItem>
              <ListItemText secondary="Use the Undo button to fix mistakes" />
            </ListItem>
            <ListItem>
              <ListItemText secondary="Try to match the size and position of the target shape" />
            </ListItem>
            <ListItem>
              <ListItemText secondary="Play multiple rounds to improve your average score" />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
