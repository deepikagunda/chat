import "./App.css";
import React, { useState, useEffect } from "react";
import JoinChat from "./pages/JoinChat";
import Chat from "./pages/Chat";
import io from "socket.io-client"; // Add this
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link,
} from "react-router-dom";
const socket = io.connect("http://localhost:4000"); // Add this -- our server will run on port 4000, so we connect to it from here

function App() {
  const [room, setRoom] = useState();
  const [name, setName] = useState();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/chat"
            element={<Chat room={room} name={name} socket={socket} />}
          />

          <Route
            path="/"
            element={
              <JoinChat
                room={room}
                name={name}
                setRoom={setRoom}
                setName={setName}
                socket={socket}
              />
            }
            
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
