import React from 'react'
import Navbar from '../Components/Navbar'
import './userhome.css'
import Userfeed from '../Components/Userfeed'

function Userhome() {
  return (
    <div>
       <Navbar />
       <div className='userfeeddiv'>
       <Userfeed />
       </div>

    </div>
  )
}

export default Userhome