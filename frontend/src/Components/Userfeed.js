import React, { useState,useEffect } from 'react'
import ProfileCard from './ProfileCard';
import './userfeed.css'
import image1 from '../photos/1.png'
import image2 from '../photos/2.png'
import image3 from '../photos/3.png'
import backendinstance from "../Services/backendinstance";
import { useNavigate } from "react-router-dom";

function Userfeed() {
  const navi=useNavigate();
  const [Index, setIndex] = useState(0)
  const [data,setdata]=useState([])
  const authHeaders = { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` };
  const [SentRequests, setSentRequests] = useState([])
  const [RecievedRequests, setRecievedRequests] = useState([])
  useEffect(() => {
    console.log("Sending requests to fetch all users")
    backendinstance
    .get("/api/users/profiles/",  { headers: authHeaders })
    .then(function (resp) {
      // console.log("priniting data");
      // console.log(resp)
      setdata(resp.data);
    });

    backendinstance
    .get("/api/users/match_request/",  { headers: authHeaders })
    .then(function (res) {
      console.log("priniting respone");
      console.log(res)
      setRecievedRequests(res.data.sent)
      setSentRequests(res.data.received);
      console.log(res.data.sent)
      console.log(res.data.received);
    });




  }, [])
  
 
 
 
  console.log(" printing data",data)


  
  // const user=users[1]
  return (
    <div  className="bg">
    <div  className='profileslideshow'>
      {data.map((dat) => (
       
         (dat.auth_user!==localStorage.getItem('username') && !RecievedRequests.includes(dat.auth_user) && !SentRequests.includes(dat.auth_user) && <div >
           <ProfileCard fullname={dat.first_name+' '+dat.last_name} Uname= {dat.auth_user} UImage={dat.picture} Udesprip={dat.bio} tags={dat.tags}/></div> )
        ))}
    </div>
    </div>

  );
}

export default Userfeed