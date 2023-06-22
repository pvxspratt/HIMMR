import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { deepPurple, green, indigo, red } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import { Grid } from '@mui/material';
import { Item } from '@mui/material';
import { Stack } from '@mui/material';
import GroupTwoToneIcon from '@mui/icons-material/Group';

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


export default function ProfileCard(props){

  return (
    <Card sx={{ width: "8vw", height: "3vw", borderRadius: 2 }}>
      <CardContent>
        <div>
            <Grid item xs={0}>
              <Stack direction="row" spacing={1}>
                name
              </Stack>
            </Grid>
        </div>
      </CardContent>
    </Card>
  )

};