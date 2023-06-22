import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import backendinstance from '../../Services/backendinstance';


export default function FriendList(props) {
    const authHeaders={ Authorization: `Bearer ${localStorage.getItem('AccessToken')}` }    
    const handleUnfriend = (e) => {
        const requestdata = backendinstance({
          method: 'delete',
          url: `/api/users/match_request/`,
          headers: authHeaders,
          data: {
            unmatch_receiver: props.auth_user,
        }})
        .then(function (resp) {
        console.log("Done");
        })
        .catch((e)=>{
          console.log(e.response)
        });
    }
  return (
    <Card sx={{ maxWidth: 150, maxHeight: 150, marginTop: 1  }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.full_name}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {props.bio}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleUnfriend}>Delete Friend</Button>
      </CardActions>
    </Card>
  );
}