import React from 'react'
import { useEffect,useState } from 'react'
import backendinstance from "../Services/backendinstance"
import { Avatar } from '@material-ui/core';


function GetUserAvatar({userid,asize}) {
  console.log("entered avatar")
  const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
  const [Profilepic, setProfilepic] = useState("")
    useEffect(() => {
      backendinstance
    .get(`/api/users/profiles/${userid}/`,  { headers: authHeaders })
    .then(function (resp) {
      console.log("priniting data");
      console.log(resp)
      setProfilepic(resp.data.picture);
    });
      
      
    }, [])
    
  return (
    <Avatar
    alt="Remy Sharp"
    src={Profilepic}
    style={{ height: asize, width: asize }}
  />
  )
}

export default GetUserAvatar