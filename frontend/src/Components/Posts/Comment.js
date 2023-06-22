import React from 'react'
import { Avatar } from '@mui/material'
import { Typography } from '@mui/material'
import { useState,useEffect } from 'react'
import './comment.css'
import { IconButton } from '@mui/material'
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { Input } from '@mui/material';
import backendinstance from '../../Services/backendinstance'
import SubComment from './SubComment'
import GetUserAvatar from "../GetUserAvatar"

function Comment(props) {
    console.log(props.comment)
    const [like, setlike] = useState(false);
    const [NewSubComment, setNewSubComment] = useState("")
    const [SubComments, setSubComments] = useState([])
    const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ4NTEwODM5LCJpYXQiOjE2NDgwNzg4MzksImp0aSI6ImQ5NTZlM2FiZjZiODQ0YmY5OTUyNjkxZDc4NzE0NTk4IiwidXNlcl9pZCI6N30.1vhBKqD1z3k6ovHoZjf9mE7I8Uu2Y0mMX7bCByFXCso";
    const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
    const [ReplyCommentVisible, setReplyCommentVisible] = useState(false)
    const [SubCommentsVisible, setSubCommentsVisible] = useState(false)
    const [StateUpdated, setStateUpdated] = useState(false)
    const [totalsubcomments, settotalsubcomments] = useState(0)
    useEffect(() => {
      const requestdata = backendinstance
      .get(`api/users/comments/?comment_id=${props.comment.id}`)
      .then(function (resp) {
        console.log("priniting comment data");
        console.log(resp);
        settotalsubcomments(resp.data.reply_comment_id.length)
        setSubComments(resp.data.reply_comment_id)
        // setcommentslist(resp.data);
      });
       
     
    }, [props.comment.id,StateUpdated])
    function handleCommentReply(event){
      console.log(" entered clicked comment")
      setReplyCommentVisible(true)
      setSubCommentsVisible(true)
    }
    
    function handleViewSubComments(event){
      
      setSubCommentsVisible(true)
    }
    
  

    function handleSubmit(event){
      console.log(event.keyCode)
      if (event.keyCode == 13) {

        const payload = {
          comment_id: props.comment.id,
          body: NewSubComment,
        };

        console.log(props.comment.id);
        console.log(NewSubComment);
        backendinstance
          .post("/api/users/comments/", payload, { headers: authHeaders })
          .then(function (r) {
            console.log(r);
          })
          .catch((e) => {
            console.log(e);
          });
        setStateUpdated(!StateUpdated)
        setReplyCommentVisible(false)
        setSubCommentsVisible(true)

      }
    }
   function handleChange(e){
     console.log(e.target.value)
     setNewSubComment(e.target.value)
   }
  return (
      <div>
      
    <div className='comment'>
    <GetUserAvatar userid={props.comment.author}/>
         {/* <Avatar
            alt="Remy Sharp"
            src="https://images3.alphacoders.com/819/81925.jpg"
          /> */}

         <Typography variant="body1" color="black">
          <strong>{props.comment.author}</strong>
          &nbsp; {props.comment.body}
        </Typography>
        {like && (
          <IconButton
            size="small"
            aria-label="add to favorites"
            sx={{ color: 'red' }}
            onClick={() => {
              setlike(false);
            }}
          >
            <FavoriteIcon />
          </IconButton>
        )}
        {!like && (
          <IconButton
          size="small"
            aria-label="share"
            onClick={() => {
              setlike(true);
            }}
          >
            <FavoriteBorderIcon />
          </IconButton>
        )}

    </div>
    <div className='commentreplyblock'>
        <Typography
        variant='caption'
        >
        0m
        </Typography>
        <Typography
        variant='caption'
        >
         0 likes
        </Typography>
        <Typography
        variant='caption'
        className='replycomment'
        onClick={handleCommentReply}
        >
         Reply
        </Typography>
        
    </div>
    {!SubCommentsVisible && SubComments.length>0 && (
    <div className='commentreplyblock'>
    <Typography
        variant='caption'
        className='replycomment'
        onClick={handleViewSubComments}
        >
         view all comments({totalsubcomments})
        </Typography>

      
    </div>
    )}

    
    {SubCommentsVisible &&(
    <div className='subcommentblock'>
    {SubComments.map((subcommentid)=>{
      return <SubComment id={subcommentid} />

    })}
    </div>
    )}
    {ReplyCommentVisible && (
    <div className='commentreplyblock'>
    <div className='comment'>
         <Avatar
            alt="Remy Sharp"
            src="https://images3.alphacoders.com/819/81925.jpg"
            sx={{ width: 24, height: 24 }}
          />

        
        </div>
        <Input placeholder="Hello world" 
        onChange={handleChange}
        onKeyDown={handleSubmit} />
    </div >
    )}
    </div>
  )
}

export default Comment