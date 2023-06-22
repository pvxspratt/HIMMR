import React, { useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AvatarGroup } from "@mui/material";
import { Modal, Box } from "@mui/material";
import "./postCard.css";
import CommentCard from "./CommentCard";
import Store from "../Store/UserDetails";
import backendinstance from "../../Services/backendinstance";
import moment from "moment";
import GetUserAvatar from "../GetUserAvatar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  // boxShadow: 24,
  // p: 4,
};

function PostCard(props) {
  const [like, setlike] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // console.log(" the posts that are passed down are ", props)
    // console.log("entered closed")
    // props.handleUddatePosts();
    getpostdetails();
  };
  
  const [TimePassed, setTimePassed] = useState("0 secs");
  const [PostData, setPostData] = useState();
  console.log("##################################################");
  console.log(props);
  console.log("##################################################");

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };

  let t_passed = "";
 

  function getpostdetails() {
    backendinstance
      .get(`/api/users/posts/?post_id=${props.post.id}`)
      .then(function (resp) {
        console.log(" the updated posts data is");
        console.log(resp.data);
        setPostData(resp.data);
      });
  }
  useEffect(() => {
    getpostdetails();
  }, [props]);
  

  function sendLikeUpdate() {
    // console.log("the posts is ",props.post.id)
    const payload = {
      id: props.post.id,
      liker: localStorage.getItem("username"),
    };
    // console.log(payload);
    backendinstance
      .put("/api/users/posts/", payload, { headers: authHeaders })
      .then(function (r) {
        // console.log(r);
        getpostdetails();
      })
      .catch((e) => {
        // console.log(e);
      });
      
  }

  

  

  useEffect(() => {
    if (props.post.likes_count > 0) {
      
      
    }
    // to get the time
    const time = moment(props.post.published_on);
    const CurrentDate = moment();
    const diff = moment.duration(CurrentDate.diff(time));

    if (diff.years() > 0) {
      t_passed = `${diff.years()} years`;

      setTimePassed(t_passed);
    } else if (diff.months() > 0) {
      t_passed = `${diff.months()} months`;

      setTimePassed(t_passed);
    } else if (diff.days() > 0) {
      t_passed = `${diff.days()} days`;

      setTimePassed(t_passed);
    } else if (diff.hours() > 0) {
      t_passed = `${diff.hours()} hours`;

      setTimePassed(t_passed);
    } else {
      t_passed = `${diff.minutes()} minutes`;

      setTimePassed(t_passed);
    }
  }, [props.post.published_on, props.post.likes_count]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {PostData && (
            <CommentCard
              postid={PostData.id}
              author={PostData.author}
              image={PostData.title}
              handleUddatePosts={getpostdetails}
            />
          )}
        </Box>
      </Modal>

      <Card>
        <CardHeader
          avatar={
            PostData && <GetUserAvatar userid={PostData && PostData.author} />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={PostData && PostData.author && PostData.author}
          subheader="Bloomington"
        />
        <CardMedia
          component="img"
          height="394"
          image={PostData && PostData.title && PostData.title}
          alt="Paella dish"
        />
        <CardActions disableSpacing>
          {PostData &&
            PostData.liked_by.includes(localStorage.getItem("username")) && (
              <IconButton
                aria-label="add to favorites"
                sx={{ color: red[500] }}
                onClick={sendLikeUpdate}
              >
                <FavoriteIcon />
              </IconButton>
            )}
          {PostData &&
            !PostData.liked_by.includes(localStorage.getItem("username")) && (
              <IconButton aria-label="share" onClick={sendLikeUpdate}>
                <FavoriteBorderIcon />
              </IconButton>
            )}
          <IconButton aria-label="share">
            <SendOutlinedIcon />
          </IconButton>
        </CardActions>
        {PostData && PostData.likes_count > 0 && (
          <div>
            <div className="likes">
              <AvatarGroup max={4} style={{ flexDirection: "row" }}>
                {PostData && PostData.likes_count > 0 && (
                  <GetUserAvatar
                    userid={PostData && PostData.liked_by[0]}
                    asize={24}
                  />
                  // <Avatar
                  //   alt="Remy Sharp"
                  //   src="https://images8.alphacoders.com/562/562449.jpg"
                  //   sx={{ width: 24, height: 24 }}
                  // />
                )}
                {PostData && PostData.likes_count > 1 && (
                  <GetUserAvatar
                    userid={PostData && PostData.liked_by[1]}
                    asize={24}
                  />
                )}
                {PostData && PostData.likes_count > 2 && (
                  <GetUserAvatar
                    userid={PostData && PostData.liked_by[2]}
                    asize={24}
                  />
                )}
                {PostData && PostData.likes_count > 3 && (
                  <GetUserAvatar
                    userid={PostData && PostData.liked_by[3]}
                    asize={24}
                  />
                )}
              </AvatarGroup>
              <div className="likecontent">
                <Typography variant="body2" color="black">
                  Liked by{" "}
                  <strong>
                    {PostData &&
                      PostData.liked_by.includes(
                        localStorage.getItem("username")
                      ) &&
                      "you"}{" "}
                    {PostData &&
                      !PostData.liked_by.includes(
                        localStorage.getItem("username")
                      ) &&
                      PostData.liked_by[0]}{" "}
                  </strong>{" "}
                  and <strong>{PostData.likes_count - 1}</strong> others
                </Typography>
              </div>
            </div>
          </div>
        )}

        <CardContent>
          <Typography variant="body1" color="black">
            <strong>{PostData && PostData.author}</strong>
            &nbsp; {PostData && PostData.body}
          </Typography>
          <br></br>
          <Typography variant="body1" color="disabled">
            <div onClick={handleOpen} className="totalcomments">
              {" "}
              view all {PostData && PostData.comment_ids.length} comments
            </div>
          </Typography>
          <Typography variant="body2" color="disabled">
            {TimePassed} ago
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostCard;
