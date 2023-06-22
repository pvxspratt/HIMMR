import React from "react";
import {Link} from "react-router-dom";
import "./login.css"
import PhotoCollections from '../Components/PhotoCollections'
import LoginForm from '../Components/Loginform'
import Avatar from '@mui/material/Avatar'
import SignIn from "../Components/SignIn";

function Login() {
  return (
  <div className="background">
    <SignIn />
  </div>
  );
}

export default Login;
