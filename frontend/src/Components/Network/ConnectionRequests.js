import React, { useState,useEffect } from 'react'
import "./ConnectionRequests.css"
import ConnectionTiles from './ConnectionTiles'
import Divider from '@mui/material/Divider';
import backendinstance from "../../Services/backendinstance";


function ConnectionRequests() {
    const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
    const [SentRequests, setSentRequests] = useState([])
    const [RecievedRequests, setRecievedRequests] = useState([])
   

    function reloadpage(){
      backendinstance
      .get("/api/users/match_request/",  { headers: authHeaders })
      .then(function (res) {
        console.log("priniting respone");
       
        setRecievedRequests(res.data.received);
        setSentRequests(res.data.sent);
        console.log(res.data.sent)
        console.log(res.data.received);
      });
      
    }

    useEffect(() => {
      const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
        reloadpage();
      }, 2000)
  
    
     
    
      }, [])
  return (
    <div>
        {"Invitations"}
        <Divider style={{marginTop:"1vw",marginBottom:"1vw"}}/>
        {RecievedRequests.map((rr) => (
       
       (  !SentRequests.includes(rr) && <ConnectionTiles type="connect" Uname={rr} reloadpage={reloadpage}/> )
      ))}
        
        </div>
  )
}

export default ConnectionRequests