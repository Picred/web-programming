const express = require('express');
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

    socket.on("disconnect", () => {
        console.log("Client disconnesso");
        
        for(index in users){
            if(users[index] == socket.nickname){
                users.splice(index,1);
                break;
            }
        }

        socket.broadcast.emit("userDisconnected", socket.nickname);

    })

    socket.on("login", function(nickname) {
        users.push(nickname);
        socket["nickname"] = nickname;

        socket.broadcast.emit("newuser", nickname);
    })

    socket.on("sendMessage", (message, from) => {
        socket.broadcast.emit("newMessage", message, from);
    })

})


http.listen(8080, () => {
    console.log("Server listening on port 8080");
});