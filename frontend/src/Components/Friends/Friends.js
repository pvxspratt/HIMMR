import { Container, Grid, Typography } from "@mui/material";
import { useState, useEffect } from 'react'
import backendinstance from '../../Services/backendinstance'
import Blocked from "./Blocked";
import Suggestions from "./Suggestions";
import FriendList from "./FriendList";
import Received from "./Received";
import Sent from "./Sent";

export default function Friends(){
    const token = localStorage.getItem('AccessToken')
    const [data,setData]=useState([])
    const [friends, setFriends]=useState([])
    const [blocked, setBlocked]=useState([])
    const [dataLoaded, hasDataLoaded]=useState(false)
    const [friendsLoaded, hasFriendsLoaded]=useState(false)
    const [blockedLoaded, hasBlockedLoaded]=useState(false)
    function loaded () {
        return dataLoaded && friendsLoaded && blockedLoaded
    }

    useEffect(() => {
        const fetchData = async () => {
            const dataObject = await backendinstance.get("/api/users/profiles/",
            {
                headers: {
                'Authorization' : "Bearer " + token
            }
            })
            setData(dataObject.data)
            hasDataLoaded(true)
        }
        const fetchFriends = async () => {
            const friendsObject = await backendinstance.get("/api/users/match_request/",
            {
                headers: {
                'Authorization' : "Bearer " + token
            }
            })
            setFriends(friendsObject.data)
            hasFriendsLoaded(true)
        }
        const fetchBlocked = async () => {
            const blockedObject = await backendinstance.get("/api/users/block_request/",
            {
                headers: {
                'Authorization' : "Bearer " + token
            }
            })
            setBlocked(blockedObject.data)
            hasBlockedLoaded(true)
        }
        fetchData()
        fetchFriends()
        fetchBlocked()
    }, [])

    const blockedUsers = []
    const receivedUsers = []
    const sentUsers = []
    const friendUsers = []
    let flaggedUsers = []
    const parsed = []
    const parsedSent = []
    const parsedReceived = []



    function parseData() {
    if (loaded()){
        for(const [key, value] of Object.entries(data)){
            if (blocked.indexOf(value.auth_user) !== -1){
                // console.log("Flagged: " + value.auth_user)
                blockedUsers.push(value)
                flaggedUsers.push(value)
            }
            if (friends.received.indexOf(value.auth_user) !== -1){
                // console.log("Flagged" + value.auth_user)
                receivedUsers.push(value)
                flaggedUsers.push(value)
            }

            if (friends.sent.indexOf(value.auth_user) !== -1){
                // console.log("Flagged" + value.auth_user)
                sentUsers.push(value)
                if(flaggedUsers.indexOf(key) === -1) flaggedUsers.push(value)
            }
        }
        for (const [s_key, s_value] of Object.entries(sentUsers)){
            for (const [r_key, r_value] of Object.entries(receivedUsers)){
                if (s_value.id == r_value.id){
                    friendUsers.push(s_value)
                }
            }

        }
        for(const [d_key, d_value] of Object.entries(data)){
            let flagged = false
            for (const [key, value] of Object.entries(receivedUsers)){
                if (d_value.id === value.id){
                    flagged = true
                }
            }
            for (const [key, value] of Object.entries(sentUsers)){
                if (d_value.id === value.id){
                    flagged = true
                }
            }
            for (const [key, value] of Object.entries(blockedUsers)){
                if (d_value.id === value.id){
                    flagged = true
                }
            }
            if (!flagged) parsed.push(d_value)
        }

        for(const [r_key, r_value] of Object.entries(receivedUsers)){
            let flagged = false
            for (const [key, value] of Object.entries(sentUsers)){
                if (r_value.id === value.id) flagged = true
            }
            if (!flagged) parsedReceived.push(r_value)
        }

        for(const [s_key, s_value] of Object.entries(sentUsers)){
            let flagged = false
            for (const [key, value] of Object.entries(receivedUsers)){
                if (s_value.id === value.id) flagged = true
            }
            if (!flagged) parsedSent.push(s_value)
        }
    }
}
    let hasRun = false

    if (!loaded()){
        return <div />
    } else {
        if (!hasRun) {
        parseData()
        hasRun = true
    } 
    return (
        <div>
            {/* {console.log("data block")}
            {console.log(data)}
        {console.log(sentUsers)}
        {console.log(receivedUsers)}
        {console.log(friendUsers)}
        {console.log(blockedUsers)}
        {console.log(flaggedUsers)}
        {console.log(parsed)}
        {console.log(parsedReceived)}
        {console.log(parsedSent)} */}
        <Container>
        <Grid container spacing={2}
        justifyContent="space-evenly"
        // alignItems="center"
        style = {{
            position: "absolute",
            // height: "100px",
            // width: "1000px",
            left: "5px",
            top: "10px",
        }}
        >
            <Grid item>
                <Typography>Friend Suggestions</Typography>
                {parsed.map((dat) => (
                    <Suggestions 
                    key={dat.id} auth_user={dat.auth_user} full_name={dat.first_name+' '+dat.last_name} bio={dat.bio}/>
                ))}
            </Grid>
            <Grid item>
                <Typography>Received Requests</Typography>
                {parsedReceived.map((dat) => (
                    <Received
                    key={dat.id} auth_user={dat.auth_user} full_name={dat.first_name+' '+dat.last_name} bio={dat.bio}/>
                ))}
            </Grid>
            <Grid item>
                <Typography>Sent Requests</Typography>
                {parsedSent.map((dat) => (
                    <Sent
                    key={dat.id} auth_user={dat.auth_user} full_name={dat.first_name+' '+dat.last_name} bio={dat.bio}/>
                ))}
            </Grid>
            <Grid item>
                <Typography>Friends</Typography>
                {friendUsers.map((dat) => ( //should be friends instead of data
                    <FriendList 
                    key={dat.id} auth_user={dat.auth_user} full_name={dat.first_name+' '+dat.last_name} bio={dat.bio}/>
                ))}
            </Grid>
            <Grid item>
                <Typography>Blocked</Typography>
                {blockedUsers.map((dat) => ( //should be blocked instead of data
                    <Blocked 
                    key={dat.id} auth_user={dat.auth_user} full_name={dat.first_name+' '+dat.last_name} bio={dat.bio}/>
                ))}
            </Grid> 
        </Grid>
        </Container>
        </div>
    );
    }
}