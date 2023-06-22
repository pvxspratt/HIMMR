import React from 'react'
import Navbar from '../Components/Navbar'
import U_Posts from "../Components/U_Posts"
import "./userPosts.css"
function UserPosts() {
  return (
    <div> 
        <Navbar />
    <div className='User_Posts_class'>
     <U_Posts />
    </div>
    </div>
  )
}

export default UserPosts