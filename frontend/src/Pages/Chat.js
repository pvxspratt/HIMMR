import React, {useState} from 'react'
import { ChatEngine, getOrCreateChat } from "react-chat-engine";
import Navbar from "../Components/Navbar";
import "./Chat.css"

import { useEffect } from "react";
import axios from "axios";

function Chat() {
    const [user_name, setUsername] = useState('')
    function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [user_name] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
		return (
			<div>
				<input 
					placeholder='Username' 
					value={user_name} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
	}
    useEffect(() => {
        console.log(localStorage.getItem("username"))
        console.log(localStorage.getItem("password"))
        

    }, [])
    
  return (
    <div>
      <Navbar />
      <div className="chatdiv">
      <ChatEngine
			projectID='dd6b767a-f06b-4f85-89d6-f594336253a7'
			userName={localStorage.getItem("username")}
			userSecret='1234'
            renderNewChatForm = {creds=>renderChatForm(creds)}
		/>
      </div>
    </div>
  );
}

export default Chat;
