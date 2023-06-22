import React, { useState, useEffect } from "react";

import image1 from "../photos/chris.jpg";
import "./ProfileView.css";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Chip } from "@material-ui/core";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MovieIcon from "@mui/icons-material/Movie";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import "./viewUserProfile.css";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import LockIcon from "@mui/icons-material/Lock";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import backendinstance from "../Services/backendinstance";
import { useParams } from "react-router-dom";
import { Divider } from "@material-ui/core";
const containerStyle = {
  width: "300px",
  height: "300px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function ViewUserProfile() {
  const [value, setValue] = React.useState("1");
  const [UserInfo, setUserInfo] = useState({});
  const [Postdata, setPostdata] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };
  const [SentRequests, setSentRequests] = useState([]);
  const [RecievedRequests, setRecievedRequests] = useState([]);
  const params = useParams();
  // console.log("the profile params are", params);
  useEffect(() => {
    backendinstance
      .get("/api/users/match_request/", { headers: authHeaders })
      .then(function (res) {
        // console.log("priniting respone");

        setRecievedRequests(res.data.received);
        setSentRequests(res.data.sent);
        // console.log(res.data.sent);
        // console.log(res.data.received);
      });
  }, []);

  useEffect(() => {
    if(params.connectionname){
      backendinstance
      .get(`/api/users/profiles/${params.connectionname}/`,  { headers: authHeaders })
      .then(function (resp) {
        // console.log("getting connectiondata");
        // console.log(resp.data)
        setUserInfo(resp.data);
        console.log("the tags are",resp.data.tags);
      });

    }
    else{
      backendinstance
      .get(`/api/users/profiles/${localStorage.getItem("username")}/`,  { headers: authHeaders })
      .then(function (resp) {
        // console.log("getting connectiondata");
        // console.log(resp.data)
        setUserInfo(resp.data);
        // console.log("the tags are",resp.data.tags);
  
      });

    }
   
    
  }, [])

  useEffect(() => {
    if(params.connectionname){
      backendinstance
      .get(`/api/users/posts/${params.connectionname}/`,  { headers: authHeaders })
      .then(function (resp) {
        console.log("getting Postdata");
        console.log(resp.data)
        setPostdata(resp.data);
        
      });

    }
    else{
      backendinstance
      .get(`/api/users/posts/${localStorage.getItem("username")}/`,  { headers: authHeaders })
      .then(function (resp) {
        console.log("getting Postdata");
        console.log(resp.data)
        setPostdata(resp.data);
     
  
      });

    }
   
    
  }, [])
  
  

  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];
  return (
    <div className="totalprofile">
      <div className="card1">
        <img src={UserInfo.picture?UserInfo.picture:image1} height={300} width={300}></img>
        <div>
          <Typography variant="h5" component="h2" mt={2}>
            <b>{UserInfo.first_name +" "+ UserInfo.last_name }</b>
          </Typography>
          <Typography variant="h6" component="h2">
            About me
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {UserInfo.bio?UserInfo.bio:`an American actor who began his career with roles in television series, such as in Opposite Sex in 2000. Following appearances in
            several teen films including 2001's Not Another Teen Movie, he
            gained attention for his portrayal of Marvel Comics character Human
            Torch in 2005's Fantastic Four, and its sequel Fantastic Four: Rise
            of the Silver Surfer (2007). Evans made further appearances in film
            adaptations of comic books and graphic novels: TMNT (2007), Scott
            Pilgrim vs. the World (2010), and Snowpiercer (2013).`}
           
          </Typography>
         
        </div>
      </div>
      <div className="tagsandrequests">
        <div className="chips" style={{width:"30vw",}}>
          {UserInfo && UserInfo.tags && UserInfo.tags.map((tag)=>{
            return  <Chip  label={tag}  />
          })}
          {/* <Chip icon={<SportsFootballIcon />} label="Football" />
          <Chip
            icon={<SportsMotorsportsIcon />}
            label="Motor Sports"
            variant="outlined"
          />
          <Chip icon={<ColorLensIcon />} label="Painting" />
          <Chip icon={<HeadphonesIcon />} label="Music" variant="outlined" />
          <Chip icon={<AccessAlarmIcon />} label="Tv" />
          <Chip icon={<MovieIcon />} label="Movies" variant="outlined" /> */}
        </div>
        <div>
          <Stack direction="row" spacing={2}>
            {/* <Button variant="outlined" startIcon={<DeleteIcon />} sx={{borderRadius:10}}>
            Delete
          </Button> */}

            {params.connectionname &&
              RecievedRequests.includes(params.connectionname) &&
              SentRequests.includes(params.connectionname) && (
                <div>

                  <Button
                    variant="outlined"
                    
                    sx={{ borderRadius: 10 }}
                  >
                    Message
                  </Button>
                </div>
              )}

            {params.connectionname &&
              RecievedRequests.includes(params.connectionname) &&
              !SentRequests.includes(params.connectionname) && (
                <div>
                  <Button variant="contained" sx={{ borderRadius: 10 }}>
                    Connect
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    sx={{ borderRadius: 10 }}
                  >
                    Message
                  </Button>

                 
                </div>
              )}
            {params.connectionname &&
              !RecievedRequests.includes(params.connectionname) &&
              SentRequests.includes(params.connectionname) && (
                <div>
                  <Button variant="contained" sx={{ borderRadius: 10 }}>
                    Cancel Connect request
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    sx={{ borderRadius: 10 }}
                  >
                    Message
                  </Button>

                 
                </div>
              )}

               {!params.connectionname &&(
                <div>
                  <Button variant="contained" sx={{ borderRadius: 10 }}>
                    Update profile
                  </Button>

                 
                </div>
              )}


            <Button variant="outlined" sx={{ borderRadius: 10 }}>
              More
            </Button>
          </Stack>
        </div>
      </div>
      <div style={{marginTop:"3vh"}}>
       <div style={{display:"flex",flexDirection:'row',columnGap:"1vw" }}>
       <BorderAllIcon /><h2>Posts</h2>
         </div> 
      
      <br></br>
      <Divider />
      <br></br>
      <ImageList sx={{ width: "60vw" }} cols={3} rowHeight={300}>
              {Postdata && Postdata.map((post) => (
                <ImageListItem key={post.id}>
                 
                  <img
                    src={post.title}
                    srcSet={post.title}
                    alt={"imag"}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
      </div>
      <div>
        {/* <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                icon={<BorderAllIcon />}
                iconPosition="start"
                label="Posts"
                value="1"
              />
              <Tab
                icon={<PersonAddIcon />}
                iconPosition="start"
                label="Connection Requests"
                value="2"
              />
              <Tab
                icon={<PersonOffIcon />}
                iconPosition="start"
                label="Blocked"
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <ImageList sx={{ width: "60vw" }} cols={3} rowHeight={300}>
              {Postdata && Postdata.map((post) => (
                <ImageListItem key={post.id}>
                 
                  <img
                    src={post.title}
                    srcSet={post.title}
                    alt={"imag"}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext> */}
      </div>
    </div>
  );
}

export default ViewUserProfile;
