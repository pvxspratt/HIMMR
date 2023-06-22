import React from 'react'
import "./u_Posts.css"
import PostCard from "./Posts/PostCard";

import backendinstance from '../Services/backendinstance';
import { useEffect,useState } from "react";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { IconButton } from '@mui/material';

import { Modal,Box } from '@mui/material';
import PostCycle from './Posts/PostCycle';
import { Avatar } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { Card } from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  //transform: 'translate(-50%, -50%)',
  
};


function U_Posts() {
  const [posts, setposts] = useState([]);
  const [postsupdated, setpostsupdated] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log("entered handleclose")
    setOpen(false);
    handleUddatePosts()
  }

  function handleUddatePosts(){
    const requestdata = backendinstance
    .get("/api/users/posts/")
    .then(function (resp) {
     
      setposts(resp.data);
    });
  }

  useEffect(() => {
    console.log("entered useeffect");
    handleUddatePosts();
    
   
  }, []);

  return (
    <div className="postsfeed">
      
         <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
    
        <Box sx={style}>
          <PostCycle handleClose={handleClose} handleUddatePosts={handleUddatePosts} />
        </Box>
      </Modal>

       
        <br></br>
        <Card sx={{ maxHeight: 105 }}
        >
        <div className='newpostdiv'>
          
          <Avatar></Avatar>
          <div className='user_textinput' onClick={handleOpen}> New Post</div>
        
        <IconButton
            aria-label="share"
            onClick={handleOpen}
          >
            <PhotoLibraryIcon />
          </IconButton>

          <IconButton
            aria-label="share"
            onClick={handleOpen}
          >
            <VideoCameraBackIcon />
          </IconButton>

        </div>
        </Card>
         <div className="postsfeed">
        {posts.map((post) => {
          return <PostCard post= {post} handleUddatePosts={handleUddatePosts} />
          
        })}
      </div>

      <br></br>
      <div>No More Posts to show</div>
      
     
    </div>
  )
}

export default U_Posts