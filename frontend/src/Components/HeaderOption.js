
import React from 'react';
import { useEffect, useState } from "react";
import { Avatar, Menu, MenuItem, Button } from "@material-ui/core";

import { useNavigate } from "react-router-dom";

import { ListItemIcon } from '@material-ui/core';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Settings from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import './HeaderOption.css';
import GetUserAvatar from './GetUserAvatar';
import LogoutIcon from '@mui/icons-material/Logout';
// import { Avatar } from '@material-ui/core';

function HeaderOption({ avatar, Icon, title,notifications, onClick }) {
  const [show, setshow] = useState(false);
  const navi=useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div onClick={onClick} className="headerOption">
      {title=="Notifications" && (<Badge badgeContent={ notifications?notifications.length:0} color="primary">
      <Icon className="headerOption_icon" />
    </Badge>)}
      {title!=="Notifications" && Icon && <Icon className="headerOption_icon" />}
      {avatar &&(
        <div>

        <Avatar className="headerOption_icon" src={"https://image.winudf.com/v2/image/Y29tLmJhbGVmb290Lk1vbmtleURMdWZmeVdhbGxwYXBlcl9zY3JlZW5fMF8xNTI0NTE5MTEwXzAyOA/screen-0.jpg?fakeurl=1&type=.jpg"} 
        id="basic-avatar"
            alt="harsha"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
        />
        
            <Menu
            className="menuclass"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-avatar",
            }}
          >
           
           <MenuItem
           onClick = {() => {navi(`/`)}}
           >
           <ListItemIcon>
           <AccountCircleIcon fontSize="small"/>
          </ListItemIcon>

           View Profile
        </MenuItem>
       
        <MenuItem
        onClick = {() => {navi(`/${localStorage.getItem("username")}/updateprofile`)}}
        >
          <ListItemIcon>
            <FileUploadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Update Profile
        </MenuItem>
        {/* <MenuItem
        onClick = {() => {navi(`/`)}}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}

        <MenuItem
        onClick = {() => {navi(`/`)}}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
            </Menu>
         </div>   


      ) }
      <h3 className="headerOption_title">{title}</h3>
    </div>
  )
}

export default HeaderOption