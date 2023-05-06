const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require ("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
    socket.on("newuser", function(Username){
        socket.broadcast.emit("update", Username + " joined the conversation");
        socket.emit("update", "You joined the conversation");
    });
    socket.on("exituser", function(Username){
        socket.broadcast.emit("update", Username + " left the conversation");
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});

server.listen(3000);
