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
    <Card sx={{ width: "90vw", height: "25vh", borderRadius: 2 }}>
      <CardContent>
        <div>
          <Typography gutterBottom variant="h5" component="div">
            <Chip label={props.data.auth_user} sx={{ backgroundColor: "#003E76", color: "#FFFFFF" }} />
          </Typography>

          <Typography gutterBottom variant="h5" component="div">
            {props.data.first_name} {props.data.last_name}
          </Typography>

          <Typography variant="body" color="text.secondary">
            {props.data.bio}
          </Typography>
            <br/>
            <br/>
            <br/>
          < Grid container rowSpacing={0.2} columnSpacing={{ xs: 2}}>
            <Grid item xs={0}>
            <GroupTwoToneIcon font />
            </Grid>
            <Grid item xs={0}>
              {props.data.matches.length}
            </Grid>
            <Grid item xs={0}>
              <Stack direction="row" spacing={1}>
                {props.data.tags.map(function(tag){
                    return (<div>
                      <Chip label={tag} sx={{ backgroundColor: deepPurple[500], color: "#FFFFFF" }} />
                    </div>)
                })}
              </Stack>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  )

};