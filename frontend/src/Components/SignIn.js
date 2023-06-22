import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//imports seperate from template
import { useState } from "react";
import backendinstance from "../Services/backendinstance";
import { useNavigate } from "react-router-dom";
import Store from "./Store/UserDetails";
import GoogleLogin from 'react-google-login';
import axios from "axios";

import logo from "../photos/logo.png"
const theme = createTheme();

export default function SignIn() {
  const [error, seterror] = useState(false);
  const [loginsuccesfull, setloginsuccesfull] = useState(false);
  const [AccessToken, setAccessToken] = useState({});
  const navi = useNavigate();

  const responseGoogle = async (response) => {
    const profile = response.profileObj
    console.log(response);
    if (profile) {
        const payload = {
            email: profile.email,
            first_name: profile.givenName || profile.name,
            last_name: profile.familyName,
            auth_provider: 'google'
        }
        backendinstance.post("/api/users/login_google/",payload)
       .then((res)=>{
            console.log(res);
            localStorage.setItem('username',res.data.username);
            localStorage.setItem('AccessToken',res.data.access);
            if (res.data.first){
                const user1 = {
                username: res.data.username,
                first_name: profile.givenName || profile.name,
                last_name: profile.familyName,

                secret:'1234',
              };

                 axios
                .post("https://api.chatengine.io/users/", user1, {
                  headers: {
                    "PRIVATE-KEY": "2ca2dfb7-487c-43fe-b882-088e3d351ae0",
                  },
                })
                .then( (response) => {
                  console.log("the response from chat engine:");
                  console.log(JSON.stringify(response.data));
                })
                .catch((error)=> {
                  console.log(error);
                });
            }
             navi(`/${localStorage.getItem('username')}/userhome`)
       })
       .error((e)=>{console.log(e)});
      }
}


  const handleSubmit = (event) => {
    event.preventDefault();
    //Different implementation of hooks (email is used instead of password?)
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    // eslint-disable-next-line no-console
    //Backend post
    backendinstance
      .post("/api/users/token/", {
        username: data.get("email"),
        password: data.get("password"),
      })
      .then(function (r) {
        const accessToken = r.data.access;
        console.log("Access Token is", accessToken)
        setAccessToken(accessToken);
        const userdetails = {
          username: data.get("email"),
          AccessToken:accessToken ,
        };
       localStorage.setItem('username',data.get("email"));
       localStorage.setItem('AccessToken',accessToken);
       localStorage.setItem('password',data.get("password"));


        const authHeaders = { Authorization: `Bearer ${accessToken}` };
        const payload = {
          username: data.get("email"),
          password: data.get("password"),
        };

        backendinstance
          .post("/api/users/login/", payload, { headers: authHeaders })
          .then(function (r) {
            console.log("the login response is",r)
            // console.log(r);
          })
          .catch((e) => {
            console.log("can't fetch with the access token");
          });
      })
      .then((e) => {
        setloginsuccesfull(true);
      })
      .catch((e) => {
        seterror(true);
      });
  };


  if (loginsuccesfull) {
    return <div>{navi(`/${localStorage.getItem('username')}/userhome`)}</div>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={logo} height="90vh" width="150vw"/> 
            {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="../passwordreset" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="../register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>

              {<GoogleLogin
                clientId="315138222371-dsj1036r1mehjlm5ua8l6p0k8n31mrni.apps.googleusercontent.com"
                buttonText="Continue with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy='single_host_origin'
                                />}


            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}