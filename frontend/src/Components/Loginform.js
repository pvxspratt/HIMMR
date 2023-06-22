import React from "react";
import { useState } from "react";
import "./loginform.css";
import {Link,useNavigate } from "react-router-dom";
import backendinstance from "../Services/backendinstance";

function Loginform() {
  const [Username, SetUsername] = useState("");
  const [Password, SetPassword] = useState("");
  const [error, seterror] = useState(false);
  const [loginsuccesfull, setloginsuccesfull] = useState(false);
  const navi=useNavigate()
  function LoginAction(e) {
    e.preventDefault();
    console.log(Username);
    console.log(Password);
    backendinstance
      .post("/api/users/token/", {
        username: Username,
        password: Password,
      })
      .then(function (r) {
        const accessToken = r.data.access;
        console.log(accessToken);

        const authHeaders = { Authorization: `Bearer ${accessToken}` };
        const payload = { username: Username, password: Password };

        backendinstance
          .post("/api/users/login/", payload, { headers: authHeaders })
          .then(function (r) {
            console.log(r);
          })
          .catch((e) => {
            console.log("can't fetch with the access token");
          });
      })
      .then((e)=>{setloginsuccesfull(true)})
      .catch((e) => {
        seterror(true)
      });
  }

  //    setloginsuccesfull(true);

  //    document.getElementById("formid").reset();

  if (loginsuccesfull) {
    return (
      <div>
        {navi("/userhome" )}
        
      </div>
    );
  } else {
    return (
      <div>
        <div className="Container">
          <h1 className="title">HIMMR</h1>
          {/* <form onSubmit={LoginAction}> */}

          <form className="formclass" id="formid" onSubmit={LoginAction}>
            {error && (
              <p style={{ color: "blue" }}>
                Username and password doesn't match
              </p>
            )}
            <label className="label">Username</label>
            <br />
            <input
              name="Username"
              className="formelement"
              placeholder="sumanth89"
              onChange={(e) => SetUsername(e.target.value)}
            />

            <br />
            <label className="label">Password</label>
            <br />
            <input
              type={"password"}
              name="Password"
              className="formelement"
              placeholder="*********"
              onChange={(e) => SetPassword(e.target.value)}
            />
            <br></br>
            <button type="submit" className="button">
              Login
            </button>
            <br></br>
            <i>
              Don't have a account? <Link to="/register">Register here</Link>
            </i>
          </form>
        </div>
        <div className="register_snapet"></div>
      </div>
    );
  }
}

export default Loginform;
