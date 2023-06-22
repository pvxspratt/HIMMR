import React, { useEffect,useState } from 'react'
import './subComment.css';



 

import { Avatar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import backendinstance from '../../Services/backendinstance';
import GetUserAvatar from "../GetUserAvatar"

function SubComment(props) {
  console.log(props.id)
  const [subcomment, setsubcomment] = useState("")
    

    useEffect(() => {
      const requestdata = backendinstance
      .get(`api/users/comments/?comment_id=${props.id}`)
      .then(function (resp) {
        console.log("priniting subcommenting and fucking  comment data");
        console.log(resp);
        
        setsubcomment(resp.data);
      })
      .catch((e)=>{
        console.log(e)

      });
       
     
    }, [])
    

  return (
    <div className='subcommentdiv'>
      {subcomment &&
      
      <GetUserAvatar userid={subcomment.author}/>
      }
        {/* <Avatar
            alt="Remy Sharp"
            src="https://images3.alphacoders.com/819/81925.jpg"
            sx={{ width: 24, height: 24 }}
          /> */}

         <Typography variant="body1" color="black">
         <strong>{subcomment.author}</strong>
          &nbsp;{subcomment.body}
         
        </Typography>
    </div>
  )
}

export default SubComment