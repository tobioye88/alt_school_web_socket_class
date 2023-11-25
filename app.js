const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);
  const phone_number = socket.handshake.headers.phone_number;
  // console.log("Header phone_number", socket.handshake.headers.phone_number);
  phone_number;
  socket.emit("chatMessage", phone_number + " joined our chat room");

  socket.on("newMessage", (data) => {
    console.log("newMessage", data);
    io.emit("chatMessage", data);
  });

  socket.on("typing", (data) => {
    console.log("typing");
    socket.broadcast.emit("typing", "somebody is typing");
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
