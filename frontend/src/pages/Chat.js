import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Chat.css";

function Chat(props) {
  const { room, name, socket } = props;
  //const { itemId, otherParam } = route.params;
  const [usersList, setUsersList] = useState([]);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState();
  const [userName, setUserName] = useState();

  console.log({ roomName, usersList });

  const navigate = useNavigate();

  useEffect(() => {
    //load first 100 messages.
    //get userlist for this room
    socket.emit("user_list", { room });
    socket.on("user_list", (data) => {
      setUsersList(data);
    });

    socket.on("msgs_list", (data) => {
      setMessages(data);
    });
  }, []);

  useEffect(() => {
    //if socket changes
    //add in users list
    //add in messages
    setRoomName(room);
    setUserName(userName);
  }, []);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleInput = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    console.log("user entered", event.target.value);
    //send message to socket
    socket.emit("chat_msg", { room, name, msg: event.target.value });
    setMessage("");
  };
  //handle scroll as well.

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-sidebar">
          {usersList && (
            <>
              <h5>Users</h5>
              <ul className="chat-users">
                {usersList.map((x) => (
                  <li
                    className={x === userName ? "chat-active-user" : ""}
                  >{`${x}`}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            {messages && (
              <ul className="chat-messagesPanel">
                {messages.map((x) => (
                  <li>{`${x.name} : ${x.msg}`} </li>
                ))}
              </ul>
            )}
          </div>
          <div className="chat-messageInput">
            <input
              type="text"
              name="userInput"
              id="chat-userInput"
              onChange={handleInputChange}
              onBlur={handleInput}
              onKeyDown={handleInput}
              value={message}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
