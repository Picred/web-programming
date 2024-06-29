const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static("./public"));
app.use(express.urlencoded({extent:false}));
app.use(express.json());


io.on("connection", function(socket) {
    console.log("New user connected");

    socket.on("event", function(data) {
        console.log("Ricevuto" + data);
    })
})

http.listen(8080, () => {
    console.log("Server Listening on port 8080");
});

