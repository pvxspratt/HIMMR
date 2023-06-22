import React from 'react'
import { useParams } from 'react-router-dom'
import {useState,useEffect} from 'react'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import "./ForgotPassword.css"
import backendinstance from '../Services/backendinstance'

function ForgotPassword() {
    const param=useParams()
    // console.log(param)
    const [Password, setPassword] = useState("")
    const [RetypePassword, setRetypePassword] = useState("")
    const [IsTokenValiadted, setIsTokenValiadted] = useState(false)
    useEffect(() => {
      backendinstance.get(`/api/users/forgot_password_reset/${param.uid}/${param.token}/`)
      .then((res)=>{
        console.log(res)
        
        setIsTokenValiadted(true)
       
      })

     
    }, [])
    function handlePasswordChangeRequest(){
      console.log(Password)
      console.log(RetypePassword)
      if(Password===RetypePassword)
      {
      
     
      const data={
        uid:param.uid,
        token:param.token,
        new_password:Password

      }
      backendinstance.post('/api/users/update_password/',data)
      .then((res)=>{
        console.log(res)
        setIsTokenValiadted(false)
        alert("password succussfully updated")
        
      })
    }
    else{
      alert("Passwords doesn't match")
    }
    }
    
  return (
      
    <div className='ForgotPassword'>
       {!IsTokenValiadted && (
        <div>
        This token has expired. Try resetting the pasword once more
        </div>

      )}
      {IsTokenValiadted && (
        <div>
        <TextField onChange={(e)=>{setPassword(e.target.value)}} placeholder="password"></TextField>
        <br></br>
        <TextField onChange={(e)=>{setRetypePassword(e.target.value)}} placeholder="re-enter password"></TextField>
        <br></br>
        <Button onClick={handlePasswordChangeRequest}>Change Password</Button>
        </div>

      )}
     

       
    </div>
  )
}

export default ForgotPassword