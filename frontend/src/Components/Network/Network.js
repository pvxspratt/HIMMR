import React from 'react'
import "./Network.css"
import NetSideBarTab from './NetSideBarTab'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import ConnectionRequests from './ConnectionRequests';
import Connections from './Connections';
import Connectionssent from './Connectionssent';

function Network() {
  const [value, setValue] = React.useState("1");
  return (
    <div className='networktot'>
        <div className='netsidebar'>
          <div style={{paddingLeft:"2vw",paddingTop:"1vw",paddingBottom:"1vw"}}>

          
            <b >Manage your network</b>
            </div>
            <div onClick={(e)=>{setValue(1)}} >
            <NetSideBarTab Icon={PeopleOutlineIcon} text="Connections" onClick={(e)=>{setValue(1)}}/>
            </div>
            <div onClick={(e)=>{setValue(2)}} >
            <NetSideBarTab Icon={GroupAddOutlinedIcon} text="Connection Requests" />
            </div>

           
          
            <div onClick={(e)=>{setValue(3)}} >
            <NetSideBarTab Icon={ForwardToInboxOutlinedIcon} text="Sent Requests" onClick={(e)=>{setValue(3)}}/>
            </div>
           
            

        </div>
        <div className='networkdiv'>
            
           {value==1 &&(<Connections />)}
           {value==2 &&(<ConnectionRequests />)}
           {value==3 &&(<Connectionssent />)}
        </div>
    </div>
  )
}

export default Network