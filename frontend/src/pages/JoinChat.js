import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./joinChat.css";

function JoinChat(props) {
  const { socket, room, name, setRoom, setName } = props;
  const ROOMS_LIST = ["React", "Node"];

  console.log({ room, name });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (room && name) {
      console.log(room, name);
      socket.emit("join_room", { room, name });
      navigate("/chat", { user: name });
    }
  };
  return (
    <div className="joinchat">
      <div className="joinchat-container">
        <form>
          <ul className="flex-outer">
            <li>
              <label htmlFor="name"> Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name here"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </li>
            <li>
              <label htmlFor="room">Room</label>
              <input
                list="room"
                onChange={(event) => setRoom(event.target.value)}
                value={room}
              />
              <datalist id="room">
                <option value="React" />
                <option value="Node" />
              </datalist>
            </li>

            <li>
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default JoinChat;
