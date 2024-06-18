const express = require('express');
const { SocketAddress } = require('net');
const app = express();
const http = require('http').Server(app);
const serverSocket = require('socket.io')(http);

app.use(express.static("./www"));

const users = []

app.get("/api/users", (req,res) => {
    res.json(users);
})


serverSocket.on('connection', function(socket) {
    console.log("Client connesso");

    // socket.broadcast.emit("connectedUsers", users);
    socket.on("login", function(nickname) {
        users.push(nickname);

        socket.broadcast.emit("newuser", nickname);
    })

    socket.on("diconnect", () => {
        console.log("user disconnected");
    })

})


http.listen(9000, () => {
    console.log("Server listening on port 9000");
});