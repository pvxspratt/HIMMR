import React from "react";
import "./updateUserInfo.css";
import { TextField } from "@mui/material";
import { useState,useEffect } from "react";
import backendinstance from "../Services/backendinstance";
import storage from "../Components/Posts/firebase";
import { Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Avatar } from '@material-ui/core'
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];


function UpdateUserInfo() {
  const [progress, setProgress] = useState(0);
  const [image, setimage] = useState(null);
  const [imageurl, setimageurl] = useState("")
  const [ShowProgressbar, setShowProgressbar] = useState(false);
  const [Bio, setBio] = useState("")
  const [tagss,Settagss]=useState([]);
  const navi=useNavigate();
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };

  useEffect(() => {
   console.log("the updatedtags are",tagss);
  }, [tagss])
  


  const [tags, setTags] = React.useState([
   
  ]);

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
    Settagss(tagss.filter((tag, index) => index !== i));
    console.log("the tags are",tagss);

    console.log(tags);
  };

  const handleAddition = tag => {

    setTags([...tags, tag]);
    Settagss([...tagss,tag.text]);
    console.log("the tags are",tagss);

    console.log(tags);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };





  const recentItems = (topic) => (
    <div className="recentItem">
      <span className="sidebar_hash">#</span>
      <p>{topic}</p>
    </div>
  );




  const [open, setOpen] = React.useState(false);

  function createtags(){
    const payload={
      names:tagss,
    }
    backendinstance
    .post("/api/users/tags/", payload, { headers: authHeaders })
    .then(function (r) {
      console.log("the tag request susccesfully send",r);
      
    })
    .catch((e) => {
      console.log(e);
    });


  }

  const handleimageupload = (event) => {
    setShowProgressbar(true);
    setOpen(false);

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setOpen(true);
            setimageurl(url)
          });
      }
    );
  };

  const handleChangeuserDetails = (event) => {
    const payload = {
      bio: Bio,
      picture: imageurl,

    };
    console.log(payload);
    backendinstance
              .put("/api/users/profiles/", payload, { headers: authHeaders })
              .then(function (r) {
                console.log(r);
                navi(`/${localStorage.getItem("username")}/profile`)
                
              })
              .catch((e) => {
                console.log(e);
              });
   createtags();
    
  };
  const suggestions=[

    {
      id: "Sports",
    text: "Sports"
    },
    {
      id: "Anime",
    text: "Anime"
    },
    {
      id: "Games",
      text: "Games"
    }

  ];

  const onChange = (file) => {
    if (!file) {
      return;
    }

    setimage(file);
  };

  return (
    <div>
     <Navbar /> 

    
    <div className="userform">
      <div className="uploadfilesdiv">
        <input
          id="icon-button-file"
          type="file"
          // hidden
          // onChange={handleChange}
          onChange={(event) => onChange(event.target.files[0] || null)}
        />
        <Button onClick={handleimageupload}> Upload image</Button>
      </div>
      {open && <i style={{ color: "red" }}>file Succesfully uploaded</i>}
      {ShowProgressbar && (
        <LinearProgress variant="determinate" value={progress} />
      )}
      <TextField
        id="outlined-multiline-static"
        label="About you"
        multiline
        rows={4}
        placeholder="Tell us something about you. Your hobbies, personality or anything ypu want to share"
        onChange={(event)=>{setBio(event.target.value)}}
      />
      <div>

      Enter your tags
      <div>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />
      </div>
      </div>
      
      <Button variant="contained" sx={{ borderRadius: 10 }} onClick={handleChangeuserDetails}>
        Upload
      </Button>
    </div>
    
    </div>
  );
}

export default UpdateUserInfo;
