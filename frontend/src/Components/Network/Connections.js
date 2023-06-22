import React from 'react'
import ConnectionTiles from './ConnectionTiles'
import Divider from '@mui/material/Divider';
import { useEffect,useState } from "react";
import backendinstance from "../../Services/backendinstance";

function Connections() {
    const [Friends, setFriends] = useState([])
    useEffect(() => {
        backendinstance
        .get(`/api/users/profiles/${localStorage.getItem('username')}/`)
        .then(function (res) {
          console.log("priniting respone",res);
          setFriends(res.data.matches)
          
          console.log(" the Match are",res.data.matches);
        });
      
       
      }, [])
  return (
    <div>
        {"Connections"}
        <Divider style={{marginTop:"1vw",marginBottom:"1vw"}}/>
        {Friends.map((fr) => (
       
       <ConnectionTiles type="friend" Uname={fr}/> 
      ))}
        </div>
  )
}

export default Connections