import React from "react";
import image1 from "../photos/chris.jpg";
import "./ProfileView.css";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Chip } from "@material-ui/core";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MovieIcon from "@mui/icons-material/Movie";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
const containerStyle = {
  width: "300px",
  height: "300px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function ProfileView() {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const G_API_key = "AIzaSyDaWSMMT36kFuczH20STiEJ-w1__UuTOpA";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDaWSMMT36kFuczH20STiEJ-w1__UuTOpA",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div className="userinfo">
        <Card sx={{ maxWidth: 945 }}>
          <div className="card1">
            <img src={image1} height={300} width={300}></img>
            <div>
              <Typography variant="h5" component="h2" mt={2}>
                <b>Chris Evans</b>
              </Typography>
              <Typography variant="h6" component="h2">
                About me
              </Typography>
              <Typography variant="body2" color="text.secondary">
                an American actor who began his career with roles in television
                series, such as in Opposite Sex in 2000. Following appearances
                in several teen films including 2001's Not Another Teen Movie,
                he gained attention for his portrayal of Marvel Comics character
                Human Torch in 2005's Fantastic Four, and its sequel Fantastic
                Four: Rise of the Silver Surfer (2007). Evans made further
                appearances in film adaptations of comic books and graphic
                novels: TMNT (2007), Scott Pilgrim vs. the World (2010), and
                Snowpiercer (2013).
              </Typography>
              <Typography variant="h6" component="h2">
                What am I looking for
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sleeping habits, work schedules, food preferences, allergies,
                smoking and drug use, pets, entertainment and hobbies are all
                important parts of someone’s lifestyle. You do not have to have
                the same lifestyle as your roommate, but make sure that you
                understand whether or not your lifestyles will be compatible.
              </Typography>
            </div>
          </div>
          <div className="chips">
            <Chip icon={<SportsFootballIcon />} label="Football" />
            <Chip
              icon={<SportsMotorsportsIcon />}
              label="Motor Sports"
              variant="outlined"
            />
            <Chip icon={<ColorLensIcon />} label="Painting" />
            <Chip icon={<HeadphonesIcon />} label="Music" variant="outlined" />
            <Chip icon={<AccessAlarmIcon />} label="Tv" />
            <Chip icon={<MovieIcon />} label="Movies" variant="outlined" />
          </div>
          <div className="bottom">
          {/* map div */}
          <div className="mapdiv">
            <Typography variant="body2" color="green">
              <b>
                <i>I already have a place !</i>
              </b>
            </Typography>
            <br></br>

            {isLoaded ? (
              <GoogleMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=${G_API_key}.exp&libraries=geometry,drawing,places`}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {/* Child components, such as markers, info windows, etc. */}
                <></>
              </GoogleMap>
            ) : (
              <></>
            )}
          </div>
          {/* end of map div */}
          <div>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab icon={<PeopleIcon />} iconPosition="start" label="Connections" value="1" />
                  <Tab icon={<PersonAddIcon />} iconPosition="start" label="Connection Requests" value="2" />
                  <Tab icon={<PersonOffIcon />} iconPosition="start" label="Blocked" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">Item One</TabPanel>
              <TabPanel value="2">Item Two</TabPanel>
              <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
          </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default React.memo(ProfileView);
