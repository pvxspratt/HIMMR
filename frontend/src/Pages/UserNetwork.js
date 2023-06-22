import React from 'react'
import Navbar from '../Components/Navbar'
import Network from '../Components/Network/Network'
import "./UserNetwork.css"

function UserNetwork() {
  return (
      <div>
    <Navbar />
    <div className='usernet'>
        <Network />
        </div>
        </div>
  )
}

export default UserNetwork