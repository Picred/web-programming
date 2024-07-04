const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('www'));
app.use(express.json());

const filmsDb = [];
const usersDb = [];

io.on("connection", (socket) => {

    socket.on("login", (userData) => {
        for(user of usersDb){
            if(user.username === userData.username){
                if(user.password === userData.password){
                    socket.emit("isLogged", true);
                    return;
                }
                else{
                    socket.emit("isLogged", false);
                    return;
                }
            }
            else continue;
        }
        usersDb.push(userData);
        socket.emit("isLogged", true);
    });


    socket.on("add-movie", (data) => {
        filmsDb.push(data);
        socket.broadcast.emit("newFilm", data);
        socket.broadcast.emit("movies", filmsDb);
    });

    socket.on("get-movies", () => {
        socket.emit("movies", filmsDb);
    });

    socket.on("delete-movie", (movieIndex) => {
        filmsDb.splice(movieIndex, 1);
        socket.broadcast.emit("movies", filmsDb);

    });
});



http.listen(8080);