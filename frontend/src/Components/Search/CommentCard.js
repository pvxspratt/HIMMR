import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import { Grid } from '@mui/material';
import { Item } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});

export default function CommentCard(props) {
  return (
    <Card sx={{ width: "90vw", height: "15vh", borderRadius: 2 }}>
      <CardContent>
        <div>
          <Typography gutterBottom variant="h5" component="div">
            <Chip label={props.data.author} sx={{ backgroundColor: "action.active", color: "background.paper" }} />
          </Typography>
          <Typography variant="body" color="text.secondary">
            {props.data.body}
          </Typography>
          < Grid container rowSpacing={0.2} columnSpacing={{ xs: 1}}>
            <Grid item xs={0}>
            <FavoriteIcon sx={{ color: red[400]}} />
            </Grid>
            <Grid item xs={0}>
              {props.data.likes_count}
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};