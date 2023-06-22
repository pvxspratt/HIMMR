import React from 'react'
// import "./u_Posts.css"
import backendinstance from '../../Services/backendinstance';
import { useEffect,useState } from "react";
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';


import Navbar from '../Navbar';



function ViewSinglePost() {
    const [posts, setposts] = useState([]);
  const [postsupdated, setpostsupdated] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log("entered handleclose")
    setOpen(false);
    handleUddatePosts()
  }
  const params=useParams();

  function handleUddatePosts(){

    backendinstance
    .get(`/api/users/posts/?post_id=${params.postid}`)
    .then(function (resp) {
      console.log(resp.data)
      setposts(resp.data);
    });
}

   

  useEffect(() => {
    console.log("entered useeffect");
    handleUddatePosts();
    
   
  }, []);
  return (
    <div>
         <div> 
        <Navbar />
    <div className='User_Posts_class'>
    <div className="postsfeed">
      
     <br></br>
    
      <div className="postsfeed">
        {posts &&
         <PostCard post= {posts} handleUddatePosts={handleUddatePosts} />
        }
     
      
       
    
   </div>

   <br></br>
  
   
  
 </div>
    </div>
    </div>

    </div>
  )
}

export default ViewSinglePost