import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import backendinstance from '../../Services/backendinstance';


export default function ProfileTable(props) {
  const authHeaders={ Authorization: `Bearer ${localStorage.getItem('AccessToken')}` }   
  const handleFriend = (e) => {
        const requestdata = backendinstance({
          method: 'post',
          url: `/api/users/match_request/`,
          headers: authHeaders,
          data: {
            match_receiver: props.profile.auth_user,
        }})
        .then(function (resp) {
        console.log("Done");
        })
        .catch((e)=>{
          // console.log("Regardless of the error message, it does function as intended")
          console.log(e.response)
        });
    }
  return (
    <Card sx={{
      maxHeight:125,
      maxWidth:400,
      mt: 4,
      marginLeft:4,
    }}>
      <CardContent>
        <Typography component="span"variant="h6" color="black" align={"center"}>
          <strong>{props.profile.auth_user}</strong>
          &nbsp; {props.profile.first_name}
          <span> </span>
          {props.profile.last_name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={handleFriend}>Add Friend</Button>
      </CardActions>
    </Card>

  )
}