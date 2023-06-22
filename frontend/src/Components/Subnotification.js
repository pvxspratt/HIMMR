import React from 'react'
import { useNavigate } from 'react-router-dom';

function Subnotification({notf}) {
    const navi=useNavigate();

    function handleRedirect(){
        
        console.log(notf);

        if(notf.type == "P"){
            const postId = notf.object_id;
            
            navi(`/${localStorage.getItem('username')}/posts/${notf.object_id}`);
        }

        if(notf.type == "CRA"){
            const username_ = notf.object_id;
            navi(`/${localStorage.getItem('username')}/profile/${notf.object_id}`);
        }

        // navi(`/${localStorage.getItem('username')}/profile`);

    }


  return (
    <div 
    style={{paddingLeft:"10px" }}
    onClick={handleRedirect}
    >
    {notf.message}
    </div>
  )
}

export default Subnotification