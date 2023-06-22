import React from "react";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IconButton } from "@mui/material";
import "./postCycle.css";
import { Avatar } from "@mui/material";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { InputAdornment } from "@mui/material";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import backendinstance from "../../Services/backendinstance";
import storage from "./firebase";
import Store from "../Store/UserDetails";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

function PostCycle(props) {
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [image, setimage] = useState(null)
  const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
  const [progress, setProgress] = useState(0);

  const handleNewPost = (event) => {
    
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {

            const payload = {
              title: url,
              body: body,
            };
            console.log(title);
            console.log(body);
            backendinstance
              .post("/api/users/posts/", payload, { headers: authHeaders })
              .then(function (r) {
                console.log(r);
                props.handleClose()
              })
              .catch((e) => {
                console.log(e);
              });

          });
      }
    );



   
  };

  const onChange = (file) => {
    if (!file) {
      setDataUri("");
      return;
    }
    console.log(file)
    setimage(file)
    fileToDataUri(file).then((dataUri) => {
      setDataUri(dataUri);
    });
  };
  return (
    <div>
      <div className="newpostheader">
        <Box
          sx={{
            boxShadow: 1,

            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#101010" : "#fff",
            color: (theme) =>
              theme.palette.mode === "dark" ? "grey.300" : "grey.800",
            p: 1,
            m: 1,
            borderRadius: 2,
            textAlign: "center",
            fontSize: "0.875rem",
            fontWeight: "700",
          }}
        >
          New post
        </Box>
      </div>
      <div className="commentsection">
        <div className="newpostimage">
          {dataUri && (
            <img width="100%" height="100%" src={dataUri} alt="avatar" />
          )}

          <input
            id="icon-button-file"
            type="file"
            hidden
            // onChange={handleChange}
            onChange={(event) => onChange(event.target.files[0] || null)}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
        </div>
        <div className="newpostinputs">
          <div className="usertile1">
            <Avatar
              alt="Remy Sharp"
              src="https://images3.alphacoders.com/819/81925.jpg"
            />
            <Typography variant="body1" color="black">
              <strong className="c_username">Emma watson</strong>
            </Typography>
          </div>
          <div className="newpostdescription">
            <TextField
              id="standard-multiline-static"
              multiline
              rows={5}
              placeholder="write a caption"
              fullWidth="True"
              variant="standard"
              onChange={(e) => setbody(e.target.value)}
            />
            <br></br>
            <br></br>
            <div></div>
            <TextField
              id="input-with-icon-textfield"
              placeholder="Add Location"
              fullWidth="True"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              onChange={(e) => settitle(e.target.value)}
            />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={handleNewPost}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCycle;
