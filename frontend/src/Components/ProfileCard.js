import React from "react";
import "./profileCard.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, rgbToHex } from "@material-ui/core";
// import image1 from '../photos/1.png'

import { Chip } from "@material-ui/core";

import backendinstance from "../Services/backendinstance";
import { useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";

function ProfileCard(props) {
  const profilepic =
    "https://image.winudf.com/v2/image/Y29tLmJhbGVmb290Lk1vbmtleURMdWZmeVdhbGxwYXBlcl9zY3JlZW5fMF8xNTI0NTE5MTEwXzAyOA/screen-0.jpg?fakeurl=1&type=.jpg";
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };
  const [RequestSent, setRequestSent] = useState(false);
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const [UImage, setUImage] = useState("");
  const [Udesprip, setUdesprip] = useState("");
  console.log("#####################################################")
  console.log("the props are",props)
  console.log("#####################################################")
  
  const descrip =
    "hello there! I am sumanth looking for someone to replace our great place and it is nice that you are using this as great referrence. It is great place and great world ";
   console.log(RequestSent);
  function SendConnectrequest() {
    const payload = {
      match_receiver: props.Uname,
    };
    console.log(props);
    console.log(props.Uname);
    console.log(authHeaders);
    backendinstance
      .post("/api/users/match_request/", payload, { headers: authHeaders })
      .then(function (r) {
        console.log(r);
        setRequestSent(true);
      });
  }

  // console.log(props.hobbies);
  return (
    <div >
      <div className="profilecard">
        <div className="backGDiv"></div>
        <div className="imageGdiv">
          <Avatar
            alt="Remy Sharp"
            src={props.UImage?props.UImage:"https://image.winudf.com/v2/image/Y29tLmJhbGVmb290Lk1vbmtleURMdWZmeVdhbGxwYXBlcl9zY3JlZW5fMF8xNTI0NTE5MTEwXzAyOA/screen-0.jpg?fakeurl=1&type=.jpg"}
            style={{ height: "5vw", width: "5vw" }}
          />
        </div>

        <center>
          <b>{props.fullname.toUpperCase()}</b>
        </center>
        <div className="describclass"> {truncate(props.Udesprip?props.Udesprip:descrip, 70)}</div>
        <div className="chipsfordiv">
        {props && props.tags && props.tags.map((tag)=>{
            return  <Chip  label={tag} size="small" />
          })}
          {/* {props.tags && props.tags.map(
            (tag)=>{<Chip label={tag} size="small" />}
            )} */}
         
        </div>
        <div className="connectbutton">
          <center>
            {RequestSent ? (
                 <Button
                 variant="outlined"
                 startIcon={<AccessTimeIcon />}
                 style={{
                   borderRadius: 35,
                   color:"grey",
                   borderColor:"grey",
                   fontWeight: 900,
                 }}
               >
                 Pending
               </Button>

              
            ) : (
              <Button
                variant="outlined"
                onClick={SendConnectrequest}
                style={{
                  borderRadius: 35,
                  color:"blue",
                  borderColor:"blue",
                  fontWeight: 900,
                }}
              >
                Connect
              </Button>
             
            )}
          </center>
        </div>
      </div>
    </div>
  );
}
export default ProfileCard;
