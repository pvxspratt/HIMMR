import React from "react";
import "./navbar.css";
import { useEffect, useState } from "react";
import { Avatar, Menu, MenuItem, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from "@material-ui/core";
import ChatIcon from '@mui/icons-material/Chat';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import HeaderOption from "./HeaderOption";
import backendinstance from "../Services/backendinstance";
import Notifications from "./Notifications";
import logo from "../photos/logo.png"


function Navbar() {
  const [show, setshow] = useState(false);
  const navi=useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [notifications, setnotifications] = useState([])
  const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 
useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    backendinstance
      .get("/api/users/notifications/",  { headers: authHeaders })
      .then(function (res) {
        console.log("$$$$$$$$$$$$$$$$$$$");
        console.log("the notification data is",res.data);

        setnotifications(res.data);
      });

  }, 3000)

  
 
  
}, [])



  return (

    <div className="header">
      <div className="header__left">
        <img src={logo} height="80vh" width="120vw"/> 
        {/* <div className="header__search">
            <SearchIcon />
            <input placeholder="Search" type="text" />
        </div> */}
      </div>
      <div className="header__right">
        <HeaderOption Icon={HomeIcon} title="Home"  onClick={()=>{navi(`/${localStorage.getItem('username')}/userhome`)}}/>
        <HeaderOption Icon={ChatIcon} title="Chat" onClick={()=>{navi(`/${localStorage.getItem('username')}/chat`)}} />
        <HeaderOption Icon={BorderAllIcon} title="Feed" onClick={()=>{navi(`/${localStorage.getItem('username')}/posts`)}}/>
        <HeaderOption Icon={SearchIcon} title="Search"  onClick={()=>{navi(`/${localStorage.getItem('username')}/search`)}}/>
        <HeaderOption Icon={GroupsIcon} title="My Network"  onClick={()=>{navi(`/${localStorage.getItem('username')}/network`)}}/>
        
        <Notifications Icon={NotificationsNoneIcon }notifications={notifications} title="Notifications"  />

        <HeaderOption
          avatar={true}
          title="me"
          // onClick={logoutOfApp}
        />
        
      </div>
    </div>

    // <div className={`nav ${true && "nav_black"} `}>
    //    <h1>HIMMR</h1>
    //   <div className="navitems">
       
        
    //   <Tooltip title="Home">
    //         <HomeIcon
    //          style={{ height: "30px", width: "30px", cursor:'pointer' }}
    //          onClick={()=>{navi(`/${localStorage.getItem('username')}/userhome`)}}
    //          />
    //   </Tooltip>

    //   <Tooltip title="Chat">
    //           <ChatIcon
    //          style={{ height: "30px", width: "30px", cursor:'pointer' }}
    //          onClick={()=>{navi(`/${localStorage.getItem('username')}/chat`)}}
    //          />
    //          </Tooltip>
    //   <Tooltip title="View Posts">
    //           <BorderAllIcon 
    //          style={{ height: "30px", width: "30px", cursor:'pointer' }}
    //          onClick={()=>{navi(`/${localStorage.getItem('username')}/posts`)}}
    //          />
    //          </Tooltip>
    //   <Tooltip title="Search">
    //           <SearchIcon
    //          style={{ height: "30px", width: "30px", cursor:'pointer' }}
    //          onClick={()=>{navi(`/${localStorage.getItem('username')}/search`)}}
    //          />
    //    </Tooltip>      
 
    //   </div>

    //   <Avatar
    //     className="usericon"
    //     id="basic-avatar"
    //     alt="harsha"
    //     aria-controls={open ? "basic-menu" : undefined}
    //     aria-haspopup="true"
    //     aria-expanded={open ? "true" : undefined}
    //     onClick={handleClick}
    //   >
    //     {localStorage.getItem('username')[0].toUpperCase()}
    //   </Avatar>
    //   <Menu
    //     className="menuclass"
    //     id="basic-menu"
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={handleClose}
    //     MenuListProps={{
    //       "aria-labelledby": "basic-avatar",
    //     }}
    //   >
    //     <MenuItem onClick={handleClose}><PersonIcon style={{ height: "30px", width: "30px", cursor:'pointer' }} label="Profile"></PersonIcon></MenuItem>
    //     <MenuItem onClick={handleClose}><LogoutIcon style={{ height: "30px", width: "30px", cursor:'pointer' }}
    //                                        onClick = {() => {navi(`/`)}} label="Logout"></LogoutIcon></MenuItem>
    //     </Menu>
    // </div>
  );
}

export default Navbar;
