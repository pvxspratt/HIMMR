//https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/sign-up/SignUp.js
//Adapted from free template (Repository is MIT Licensed)
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
//adapted imports
import backendinstance from "../Services/backendinstance";
import { useState } from "react";
import axios from "axios";
import logo from "../photos/logo.png"

const theme = createTheme();

//Adapted code from Registrationform

export default function SignUp() {
  const [gender, setGender] = useState("NA");
  const [registersuccesful, setregistersuccesful] = useState(false);
  const navi = useNavigate();

  const handleGender = (e) => {
    setGender(e.target.value);
  };

  function fetchAcessToken(loginuser)
  {
    backendinstance
    .post("/api/users/token/", {
      username: loginuser.username,
      password: loginuser.password,
    })
    .then(function (r) {
      const accessToken = r.data.access;
      console.log("Access Token is", accessToken)
      // setAccessToken(accessToken);
      
     localStorage.setItem('username',loginuser.username);
     localStorage.setItem('AccessToken',accessToken);
     localStorage.setItem('password',loginuser.password);
     navi(`/${loginuser.username}/updateprofile`);

    })
    .catch((e) => {
     console.log(e);
    });

  }

  function chatengineregister(user1){

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

    // navi(`/${user1.username}/updateprofile`);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    //Different implementation of hooks (email is used instead of password?)
    const data = new FormData(event.currentTarget);
    const user = {
      first_name: data.get("firstName"),
      last_name: data.get("lastName"),
      gender: gender,
      email: data.get("email"),
      username: data.get("username"),
      password: data.get("password"),
    };
    // eslint-disable-next-line no-console
    //Backend post
    if (
      data.get("password").localeCompare(data.get("confirm_password")) === 0
    ) {
      console.log(user);
      console.log("Sending...");
      backendinstance
        .post("/api/users/register/", user)
        .then(function (r) {
          console.log(r);
          setregistersuccesful(true);
          //  Register the user to npmchatengine
          const user1 = {
            username: data.get("username"),
            first_name: data.get("firstName"),
            last_name: data.get("lastName"),
            
            secret:'1234',
          };
          const loginuser={
            username: data.get("username"),
            password: data.get("password"),
          };
          chatengineregister(user1);
          fetchAcessToken(loginuser);

        })
        .catch((e) => {
          console.log("can't connect to db");
        });
    } else {
      console.log("Passwords do not match!");
    }
  };
 
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
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="gender">Gender</InputLabel>
                    <Select
                      id="gender"
                      label="Gender"
                      value={gender}
                      placeholder={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    >
                      <MenuItem value={"M"}>Male</MenuItem>
                      <MenuItem value={"F"}>Female</MenuItem>
                      <MenuItem value={"NB"}>Non-Binary</MenuItem>
                      <MenuItem value={"NA"}>Prefer Not to Answer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirm_password"
                    label="Confirm Password"
                    type="password"
                    id="confirm_password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="../login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  
}
