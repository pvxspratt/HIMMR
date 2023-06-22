import React, { useState } from "react";
import "./registrationform.css";
import { useNavigate, Link } from "react-router-dom";
import backendinstance from "../Services/backendinstance";

function Registrationform() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [registersuccesful, setregistrationsuccesful] = useState(false);
  const [passworddoesnotmatch, setpassworddoesnotmatch] = useState(false);
  const [gender,setgender]=useState("NA")
  const navi=useNavigate()

  function RegisterAction(e) {
    e.preventDefault();
    const user = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      username: username,
      password: password,
      gender:gender,
    };
    if (password.localeCompare(confirm_password) == 0) {
      console.log("Sending...");
      backendinstance
        .post("/api/users/register/", user)
        .then(function (r) {
          console.log(r);
          
        })
        .catch((e) => {
          console.log("can't connect to db");
        });
      console.log(user);
    } else {
      setpassworddoesnotmatch(true);
    }
  }

  //    setloginsuccesfull(true);

  //    document.getElementById("formid").reset();

  if (registersuccesful) {
    return (
      <div>
        {navi("/login")}
        
      </div>
    );
  } else {
    return (
      <div>
        <div className="Container1">
          <h1 className="title1">HIMMR</h1>
          <form className="formclass1" onSubmit={RegisterAction}>
            {passworddoesnotmatch && (
              <p style={{ color: "blue" }}>passwords doesn't match</p>
            )}
            <table>
              <tr>
                <td>
                  <label className="label1">First name:</label>
                </td>
                <td>
                  <input
                    className="formelement1"
                    name="first_name"
                    placeholder="Enter first name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </td>
              </tr>

            
              <tr>
                <td>
                  <label className="label1">Last name:</label>
                </td>
                <td>
                  <input
                    name="last_name"
                    className="formelement1"
                    placeholder="Enter last name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </td>
              </tr>
             

              <tr>
                <td>
                  <label className="label1">Email:</label>
                </td>
                <td>
                  <input
                    className="formelement1"
                    name="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </td>
              </tr>

             

              <tr>
                <td>
                  <label className="label1">Username:</label>
                </td>
                <td>
                  <input
                    className="formelement1"
                    name="username"
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </td>
              </tr>

         
              <tr>
                <td>
                  <label className="label1">Password:</label>
                </td>
                <td>
                  <input
                    className="formelement1"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>

            
              <tr>
                <td>
                  <label className="label1">Confirm Password:</label>
                </td>
                <td>
                  <input
                    className="formelement1"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
            </table>
            <label for="cars">Gender:</label>
              <select id="cars" name="cars"
              onChange={(e) => setgender(e.target.value)}
              required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="NB">Non-Binary</option>
                <option value="NA">Not Available</option>
              </select>
           
            <button className="button1" type="submit">
              Sign Up
            </button>
            <br />
            <i>
              Already have an account?: <Link to="/login">Login</Link>
            </i>
          </form>
        </div>
      </div>
    );
  }
}

export default Registrationform;
