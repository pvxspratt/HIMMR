import React from "react";
import "./ConnectionTiles.css";
import { Avatar } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Stack } from "@mui/material";
import { blue } from "@material-ui/core/colors";
import { fontWeight } from "@mui/system";
import Divider from "@mui/material/Divider";

import { useEffect, useState } from "react";
import backendinstance from "../../Services/backendinstance";
import { useNavigate } from "react-router-dom";

function ConnectionTiles({ type, Uname, reloadpage }) {
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  };
  const [UImage, setUImage] = useState("");
  const [Udesprip, setUdesprip] = useState("");
  const [FullName, setFullName] = useState("");
  const navi = useNavigate();
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

  //   console.log("the username is", Uname);
  const descrip =
    "hello there! I am sumanth looking for someone to replace our great place and it is nice that you are using this as great referrence. It is great place and great world ";

  useEffect(() => {
    backendinstance.get(`/api/users/profiles/${Uname}/`).then(function (res) {
      console.log("priniting respone", res);
      setUImage(res.data.picture);
      setUdesprip(res.data.bio);
      setFullName(
        capitalize(res.data.first_name) + " " + capitalize(res.data.last_name)
      );
      console.log(res.data.picture);
      console.log(res.data.bio);
    });
  }, []);
  function SendApproveRequest() {
    console.log("entered sent request");
    const payload = {
      match_receiver: Uname,
    };

    console.log(Uname);
    console.log(authHeaders);
    backendinstance
      .post("/api/users/match_request/", payload, { headers: authHeaders })
      .then(function (r) {
        console.log(r);
        reloadpage();
        //   setRequestSent(true);
      });
  }

  return (
    <div>
      <div className="ConnectTile">
        <Avatar
          alt="Remy Sharp"
          src={
            UImage
              ? UImage
              : "https://image.winudf.com/v2/image/Y29tLmJhbGVmb290Lk1vbmtleURMdWZmeVdhbGxwYXBlcl9zY3JlZW5fMF8xNTI0NTE5MTEwXzAyOA/screen-0.jpg?fakeurl=1&type=.jpg"
          }
          style={{ height: "5vw", width: "5vw" }}
        />
        <div className="tileinfo">
          <b>{FullName}</b>
          {/* <br></br> */}
          <div className="tiledecrip">
            {truncate(Udesprip ? Udesprip : descrip, 70)}
          </div>

          <div className="tilechips">
            <Chip label="Sports" size="small" />
            <Chip label="Anime" size="small" variant="outlined" />
            <Chip label="Outgoing" size="small" />
            <Chip label="Helloword" size="small" variant="outlined" />
          </div>
        </div>
        <div style={{ paddingTop: "3vh" }}>
          {type === "connect" && (
            <Stack direction="row" spacing={2}>
              <Button
                style={{
                  borderRadius: 35,
                }}
              >
                Ignore
              </Button>
              <Button
                variant="outlined"
                onClick={SendApproveRequest}
                style={{
                  borderRadius: 35,
                  color: "blue",
                  borderColor: "blue",
                  fontWeight: "20px",
                }}
              >
                Accept
              </Button>
            </Stack>
          )}
          {type === "send" && (
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => {
                  navi(`/${localStorage.getItem("username")}/profile/${Uname}`);
                }}
                style={{
                  borderRadius: 35,
                }}
              >
                View Profile
              </Button>
            </Stack>
          )}
          {type === "friend" && (
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => {
                  navi(`/${localStorage.getItem("username")}/profile/${Uname}`);
                }}
                style={{
                  borderRadius: 35,
                }}
              >
                View Profile
              </Button>
              <Button
                variant="outlined"
                onClick={()=>{navi(`/${localStorage.getItem("username")}/chat`);}}
                style={{
                  borderRadius: 35,
                  color: "blue",
                  borderColor: "blue",
                  fontWeight: "20px",
                }}
              >
                Message
              </Button>
            </Stack>
          )}
        </div>
      </div>
      <Divider style={{ marginTop: "1vw", marginBottom: "1vw" }} />
    </div>
  );
}

export default ConnectionTiles;
