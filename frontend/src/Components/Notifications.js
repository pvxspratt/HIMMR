import React from 'react'
import Badge from '@mui/material/Badge';
import { useEffect, useState } from "react";
import { Avatar, Menu, MenuItem, Button } from "@material-ui/core";

import { useNavigate } from "react-router-dom";

import { ListItemIcon } from '@material-ui/core';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Settings from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import './HeaderOption.css';
import GetUserAvatar from './GetUserAvatar';
import { Divider } from '@mui/material';
import Subnotification from './Subnotification';


function Notifications({Icon, title,notifications, onClick }) {
    // console.log("the updated notification is the are",notifications)

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navi=useNavigate();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
   
      
        return (
          <div onClick={onClick} className="headerOption">
              <Badge badgeContent={ notifications?notifications.length:0} color="error">
               <IconButton
               className="headerOption_icon"
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <NotificationsNoneIcon />
      </IconButton>
      </Badge>

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
        {notifications.map((notf) => (
          <MenuItem >
          <GetUserAvatar userid={notf.from_user} asize={25}/>
          <Subnotification notf={notf} />
         
          <Divider />
          </MenuItem>
        ))}
      </Menu>

            
         
          <div style={{fontSize:"12px" }}>Notifications</div>
            
          
          </div>
        )
      
 
}

export default Notifications