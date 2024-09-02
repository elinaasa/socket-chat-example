const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join room", ({ nickname, room }) => {
    socket.join(room);
    socket.nickname = nickname;
    socket.room = room;
    io.to(room).emit("chat message", `${nickname} has joined ${room}`);
  });

  socket.on("chat message", (msg) => {
    io.to(socket.room).emit("chat message", `${socket.nickname}: ${msg}`);
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      io.to(socket.room).emit(
        "chat message",
        `${socket.nickname} has left ${socket.room}`
      );
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
