import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { SocketAddress } from "net";

dotenv.config();
const app = express();
const usersList = {};
const httpServer = createServer(app);
const chatMsgs = {};
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("connected client");
  socket.on("join_room", (data) => {
    //console.log("data", data);
    //io.in(socket.id).socketsJoin(data.room);
    socket.data.username = data.name;
    socket.join(data.room);
    socket.emit("msgs_list", chatMsgs[data.room] ?? []);
    usersList[data.name] = true;
  });

  socket.on("user_list", async (data) => {
    // console.log("data", data);
    let usersListTemp = [];
    const sockets = await io.to(data.room).fetchSockets();
    for (const socket of sockets) {
      /* console.log(socket.id);
      console.log(socket.rooms);
      console.log(socket.data.username);*/
      usersListTemp.push(socket.data.username);
    }

    for (const socket of sockets) {
      //send user list to all sockets to update the users.
      socket.emit("user_list", usersListTemp);
    }
  });
  socket.on("chat_msg", async (data) => {
    console.log("data", data);
    if (!chatMsgs[data.room]) {
      chatMsgs[data.room] = [{ name: data.name, msg: data.msg }];
    } else {
      chatMsgs[data.room].push({ name: data.name, msg: data.msg });
    }
    const sockets = await io.to(data.room).fetchSockets();
    for (const socket of sockets) {
      socket.emit("msgs_list", chatMsgs[data.room] ?? []);
    }
  });
  /*  socket.on("msgs_list", async (data) => {
    if (!chatMsgs[data.room]) {
      socket.emit([]);
    } else {
      // usersList[data.room][data.name].push(data.msg);
    
    }
  });*/
  /*
  //const sockets = await io.fetchSockets();
  const sockets = await io.to("React").fetchSockets();
  console.log(sockets.length)
  for (const socket of sockets) {
    console.log(socket.id);
    console.log(socket.rooms);
  }*/
});
app.get("/", (req, res) => {
  res.send("connected to server");
});

httpServer.listen(process.env.PORT || 4000);
