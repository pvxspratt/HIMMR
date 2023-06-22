import * as React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import {Typography, Card, CardActions, CardContent, Paper } from '@mui/material';
import ProfileTable from './Tables/ProfileTable';
import backendinstance from "../Services/backendinstance";
import PostCard from "./Posts/PostCard"
import CommentsTable from './Tables/CommentsTable';
import TagsTable from './Tables/TagsTable';
import ListingsTable from './Tables/ListingsTable'


// const api = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/users/search/'
// })

export default function SearchTable(props) {  
  const handleUddatePosts = () => {
    console.log("updated")
  }
  // const url = `http://127.0.0.1:8000/api/users/search/$Q=${props.data['user']}`
  const [response, setResponse] = useState(null)
  const [has_response, setHasReponse] = useState(false)
  let u = props.data.user
  if(props.data.user == undefined) u = ""
  // const authHeaders = { Authorization: `Bearer ${localStorage.getItem('Access Token')}` };
  // const token = ""
  // const authHeaders = { Authorization: `Bearer ${token}`}
  useEffect((
    authHeaders={ Authorization: `Bearer ${localStorage.getItem('AccessToken')}` }
  ) => {
    backendinstance({
      method: 'post',
      url: `/api/users/search/?Q=${u}`,
        headers: authHeaders,
        data:{
          profiles: true,
          comments: true,
          posts: true,
          tags: true,
          listings: true,
        }
      }
      )
    .then(r => {
      setResponse(r.data);
      // console.log(r)
      setHasReponse(true)
    });
  }, [has_response]);

  if(!has_response){
    return <div />
  } else {
  return (
    <div>
      
  {props.data['profiles'] ?
  <Box
        sx={{
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            mt: 3,
            maxWidth:500,
    }}>
      <React.Fragment>
        <Paper
        elevation={3}
        >
        <Typography variant='h5'
        sx ={{
          marginTop:2,
          marginLeft:2,
        }}>Profiles</Typography>
          {response["profiles"].map((p) => {
          return <ProfileTable key={p.id} profile={p}/>
        })}
        </Paper>
      </React.Fragment>
  </Box>
  : <div />}
  {props.data['posts'] ?
  <Box
        sx={{
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            mt: 3 
    }}>
      <React.Fragment>
        <Paper
        
        elevation={3}
        sx ={{
          maxWidth:800,
        }}>
        <Typography sx ={{
          marginTop:2,
          marginLeft:2,
        }} variant='h5'>Posts</Typography>
          {response["posts"].map((post) => {
          return <PostCard  key={post.id} post= {post} handleUddatePosts={handleUddatePosts} />
        })}
        </Paper>
      </React.Fragment>
  </Box>
  : <div />}
  {props.data['comments'] ? 
  <Box
        sx={{
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            mt: 3,
            maxWidth:500,
    }}>
      <React.Fragment>
        <Paper
        elevation={3}
        sx ={{
          minWidth:800,
        }}
        >
          <Typography variant='h5'
          sx ={{
          marginTop:2,
          marginLeft:2,
        }}>Comments</Typography>
          {response["comments"].map((c) => {
          return <CommentsTable key={c.id} comment={c} />
        })}
        </Paper>
      </React.Fragment>
  </Box>
  : <div />}
  {props.data['tags'] ?
  <Box
        sx={{
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            mt: 3,
            maxWidth:500,
    }}>
      <React.Fragment>
        <Paper
        elevation={3}
        sx ={{
          minWidth:400,
        }}
        >
          <Typography variant='h5'
          sx ={{
          marginTop:2,
          marginLeft:2,
        }}>Tags</Typography>
          {response["tags"].map((t) => {
          return <TagsTable key={t.id} tags={t} />
        })}
        </Paper>
    </React.Fragment>
  </Box>
  : <div />}
  {props.data['listings'] ?
  <Box
        sx={{
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            mt: 3,
            maxWidth:500,
    }}>
      <React.Fragment>
        <Paper
        elevation={3}
        sx ={{
          minWidth:800,
        }}
        >
          <Typography variant='h5'
          sx ={{
          marginTop:2,
          marginLeft:2,
        }}>Listings</Typography>
          {response["listings"].map((l) => {
          return <ListingsTable key={l.id} listing={l} />
        })}
        </Paper>
    </React.Fragment>
  </Box>
  : <div />}
  </div>
  );
          }
}