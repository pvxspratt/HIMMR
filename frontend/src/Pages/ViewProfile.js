import React from 'react'
import ViewUserProfile from '../Components/ViewUserProfile'
import Navbar from '../Components/Navbar'
import "./viewProfile.css"

function ViewProfile() {
  return (
    <div>
        <Navbar />
        <div className='profile'>
        <ViewUserProfile  />
        </div>
       
    </div>
  )
}

export default ViewProfile