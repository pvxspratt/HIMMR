import React, { useState,useEffect } from 'react'
import ConnectionTiles from './ConnectionTiles'
import Divider from '@mui/material/Divider';
import backendinstance from "../../Services/backendinstance";


function Connectionssent() {
    const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
    const [SentRequests, setSentRequests] = useState([])
    const [RecievedRequests, setRecievedRequests] = useState([])

    useEffect(() => {
       
    
        backendinstance
        .get("/api/users/match_request/",  { headers: authHeaders })
        .then(function (res) {
          console.log("priniting respone");
         
          setRecievedRequests(res.data.received);
          setSentRequests(res.data.sent);
          console.log(res.data.sent)
          console.log(res.data.received);
        });
    
      }, [])


  return (
    <div>
{"Connections send"}
        <Divider style={{marginTop:"1vw",marginBottom:"1vw"}}/>
        {SentRequests.map((sr) => (
       
       (  !RecievedRequests.includes(sr) && <ConnectionTiles type="send" Uname={sr}/> )
      ))}
        
    </div>
  )
}

export default Connectionssent