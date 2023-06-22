import React from "react";
import Avatar from "@mui/material/Avatar";
import "./commentCard.css";
import { Typography } from "@mui/material";
import Comment from "./Comment";
import { TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useEffect, useState } from "react";
import backendinstance from "../../Services/backendinstance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GetUserAvatar from "../GetUserAvatar"

function CommentCard(props) {
  const accessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ4NTEwODM5LCJpYXQiOjE2NDgwNzg4MzksImp0aSI6ImQ5NTZlM2FiZjZiODQ0YmY5OTUyNjkxZDc4NzE0NTk4IiwidXNlcl9pZCI6N30.1vhBKqD1z3k6ovHoZjf9mE7I8Uu2Y0mMX7bCByFXCso";
    const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
  const [NewComment, setNewComment] = useState("");
  const [TotalNewComments, setTotalNewComments] = useState(0);
  

  const [commentslist, setcommentslist] = useState([]);

  useEffect(() => {
    const requestdata = backendinstance
      .get(`api/users/comments/?post_id=${props.postid}`)
      .then(function (resp) {
        console.log("priniting comment data");
        console.log(resp);
        setcommentslist(resp.data);
      });
  }, [TotalNewComments, props.postid]);
  useEffect(() => {
    props.handleUddatePosts()
   
  }, [TotalNewComments])
  

  function handleNewComment() {
    console.log(NewComment);
    const payload = {
      post_id: props.postid,
      body: NewComment,
    };
    backendinstance
      .post("/api/users/comments/", payload, { headers: authHeaders })
      .then(function (r) {
        setTotalNewComments(TotalNewComments + 1);
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="commentsection">
      <div
        className="imgdiv"
        style={{
          backgroundSize: "100% 100%",
          backgroundImage: `url(
            ${props.image}
        )`,
        }}
      ></div>
      <div className="commentblock">
        <div className="usertile">
        <GetUserAvatar userid={props.author}/> 
          {/* <Avatar
            alt="Remy Sharp"
            src="https://images3.alphacoders.com/819/81925.jpg"
          /> */}
          <Typography variant="body1" color="black">
            <strong className="c_username">{props.author}</strong>
            &nbsp; &nbsp;
          </Typography>
          <PersonAddIcon />
        </div>
        <div className="C_block">
          {commentslist.map((comment) => {
            return <Comment comment={comment} />;
          })}
        </div>
        <div className="usercommentsection">
        <GetUserAvatar userid={props.author}/> 
          {/* <Avatar
            alt="Remy Sharp"
            src="https://images3.alphacoders.com/819/81925.jpg"
          /> */}
          <TextField
            notched="True"
            placeholder="Type your thoughts here"
            fullWidth="True"
            id="outlined-basic"
            variant="outlined"
            onChange={(e) => setNewComment(e.target.value)}
          />
          <IconButton aria-label="share" onClick={handleNewComment}>
            <SendOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
