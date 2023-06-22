import React from 'react'
import reactRouterDom from 'react-router-dom'
import Navbar from '../Components/Navbar'
import ProfileView from '../Components/ProfileView'
import "./UserProfile.css"

import {useParams} from 'react-router-dom'

function UserProfile() {
    const params= useParams()
    console.log(params.username)
    
  return (
      <div>
         
          <Navbar />
          <div className='profile'>
          <ProfileView />

          </div>
         
          
         
      </div>
    
  )
}

export default UserProfile