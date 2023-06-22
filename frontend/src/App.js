import { Route,Routes } from 'react-router-dom';
import { useNavigate, Navigate } from 'react-router-dom';

import './App.css';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Userhome from './Pages/Userhome';
import UserPosts from './Pages/UserPosts';
// import UserProfile from "./Pages/UserProfile"
import ForgotPassword from './Pages/ForgotPassword';
import FriendsPage from './Pages/FriendsPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import Chat from './Pages/Chat';
import UserProfile from "./Pages/UserProfile"
import Search from './Components/Search';
import ViewProfile from './Pages/ViewProfile';
import UpdateUserInfo from './Pages/UpdateUserInfo';
import UserNetwork from './Pages/UserNetwork';
import Navbar from './Components/Navbar';
import ViewSinglePost from './Components/Posts/ViewSinglePost';

function App() {
  return (
    <div className="App">
      {/* login page */}
      {/* login page can be found in pages folder */}
      <main>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} >
            
          </Route>
          <Route path="/login"element={<Login/>}>
            
          </Route>
          <Route path="/register" element={<Register />}>
            
          </Route>
         
          <Route path="/:username/userhome" element={<Userhome />}>
            
          </Route>
          <Route path="/:username/posts" element={ <UserPosts />}>
           
          </Route>
          <Route path="/:username/posts/:postid" element={ <ViewSinglePost />}>
           
           </Route>
          <Route path="/uid=:uid/token=:token/" element={ <ForgotPassword />}>
           
          </Route>
          <Route path="/passwordreset" element={ <ForgotPasswordPage />}>
           
          </Route>

          
          <Route path="/:username/chat" element={ <Chat />}>
           
          </Route>
          <Route path="/:username/search" element={ <Search />}>
           
          </Route>
          {/* <Route path="/:username/profile" element={ <UserProfile />}>
           
          </Route> */}
          <Route path="/:username/profile" element={ <ViewProfile />}>
           
           </Route>
           <Route path="/:username/profile/:connectionname" element={ <ViewProfile />}>
           
           </Route>
           <Route path="/:username/network" element={ <UserNetwork />}>
           
           </Route>
           <Route path="/:username/updateprofile" element={ <UpdateUserInfo />}>
           
           </Route>
           
          
           

        </Routes>
       
          
        

        
      </main>
      <br></br>
      <br></br>
      <br></br>
    </div>
    
  );
}

export default App;
