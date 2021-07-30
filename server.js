const express = require("express");
const app = express();
// get a server which is useful for socket.io
// allows to create a server to be used with socket.io
const server = require("http").Server(app);
// the express based server is passed to socket.io, such that it knows what server
// we're using and how to interact with it
const io = require("socket.io")(server);

const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// run anytime someone connects to our webpage
// socket is the actual socket the user is connecting through
io.on("connection", (socket) => {
  // setup events to listen to
  // - event listener when someone connects to 'join-room' pass roomId and userId
  socket.on("join-room", (roomId, userId) => {
    // console.log(roomId, userId);
    socket.join(roomId);
    // send a message to everyone else (broadcast)
    // socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });
});

server.listen(3000);
