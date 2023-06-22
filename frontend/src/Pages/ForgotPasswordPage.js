import React from 'react'
import { Button } from '@mui/material'
import { useState } from 'react'
import backendinstance from '../Services/backendinstance'

function ForgotPasswordPage() {
    const [email, setemail] = useState("")
    function handleResetPassword(){
        backendinstance.post("/api/users/forgot_password_init/?on_local=true",{email:email})
        .then((resp)=>{
            console.log(resp)
            alert("An email has been sent to your email. Please check your email")
        })
    }
  return (
    <div style={{margin:"60px"}}>
        <label>Email</label>
        <input type='text' onChange={(e)=>{setemail(e.target.value)}}></input>
        <Button onClick={handleResetPassword}>Send password Reset link</Button>
    </div>
  )
}

export default ForgotPasswordPage