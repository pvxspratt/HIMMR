import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, CssBaseline, makeStyles, Typography } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { FormGroup } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import SearchTable from "./SearchTable";
import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Navbar from "./Navbar";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import backendinstance from "../Services/backendinstance";

import CommentCard from "../Components/Search/CommentCard";
import ProfileCard from "../Components/Search/ProfileCard";
import TagCard from "../Components/Search/TagCard";



import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//import { MuiThemeProvider, createMuiTheme } from "@mui/core/styles";

export default function SearchData() {

  const [searchPosts, setSearchPosts] = useState(true);
  const [searchComments, setSearchComments] = useState(true);
  const [searchProfiles, setSearchProfiles] = useState(true);
  const [searchTags, setSearchTags] = useState(true);
  const [response, setResponse] = useState({});

  const togglePosts = (event) => {
    if (event.target.checked) setSearchPosts(true);
    else setSearchPosts(false);
  };

  const toggleComments = (event) => {
    if (event.target.checked) setSearchComments(true);
    else setSearchComments(false);
  };

  const toggleProfiles = (event) => {
    if (event.target.checked) setSearchProfiles(true);
    else setSearchProfiles(false);
  };

  const toggleTags = (event) => {
    if (event.target.checked) setSearchTags(true);
    else setSearchTags(false);
  };

  const label = { inputProps: { "aria-label": "checkbox" } };
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };

  const searchData = (event) => {
    if (event.key == "Enter") {
      const filters = {
        posts: searchPosts,
        comments: searchComments,
        profiles: searchProfiles,
        tags: searchTags,
      };
      const query = event.target.value;
      backendinstance
        .post(`/api/users/search/?Q=${query}`, filters, {
          headers: authHeaders,
        })
        .then(function (resp) {
          console.log(resp.data);
          setResponse(resp.data);
        });
    }
  };

  return (
    <div>
      <Navbar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <FormControl sx={{ m: 1, width: "100ch" }} variant="outlined">
          <FilledInput
            id="searchBar"
            onKeyPress={searchData}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon onClick={searchData} />
              </InputAdornment>
            }
          />
        </FormControl>
        <Box>

          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                color="default"
                onChange={toggleComments}
              />
            }
            label="Comments"
          />
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                color="default"
                onChange={toggleProfiles}
              />
            }
            label="Profiles"
          />
          {/* <FormControlLabel
            control={
              <Checkbox defaultChecked color="default" onChange={toggleTags} />
            }
            label="Tags"
          /> */}
        </Box>
        <br />

        {response && response.comments && (response.comments.length > 0) &&
        <Grid item alignItems="center" justifyContent="center">
          {response && response.comments &&
            <div>
              <Accordion><AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h3">Comments</Typography>
              </AccordionSummary>
                {response && response.comments &&
                  response.comments.map(function (comment) {
                    return (
                    <div>
                      <AccordionDetails><CommentCard data={comment}></CommentCard></AccordionDetails>
                      <br />
                    </div>)
                  })}
              </Accordion>
            </div>}
        </Grid>}

        <br/>
        <br/>

        {response && response.profiles && (response.profiles.length > 0) &&
        <Grid item alignItems="center" justifyContent="center">
          {response && response.profiles &&
            <div>
              <Accordion><AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ textAlign: 'center' }}
              >
                <Typography variant="h3">Profiles</Typography>
              </AccordionSummary>
                {response && response.profiles &&
                  response.profiles.map(function (profile) {
                    return (
                    <div>
                      <AccordionDetails><ProfileCard data={profile}></ProfileCard></AccordionDetails>
                      <br />
                    </div>)
                  })}
              </Accordion>
            </div>}
        </Grid>}

        <br/>
        <br/>
        
        {/* Tags */}
      </Grid>

    </div>
  );
}
