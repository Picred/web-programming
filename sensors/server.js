const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static("./public"));
app.use(express.urlencoded({extent:false}));
app.use(express.json());

const databaseUsers = {};
const userSensors = {}; 
/*
userSensors = {
    "username" : [
        {
            "sensorName" : sensorName,
            "sensorType" : sensorType,
            "sensorUpdateFreq" : sensorUpdateFreq
        },
        {
            "sensorName" : sensorName,
            "sensorType" : sensorType,
            "sensorUpdateFreq" : sensorUpdateFreq
        }
    ],
    "username2" : [{...}]
}
*/

io.on("connection", function(socket) {
    console.log("New user connected");
    let userRcv = {};
    socket.on("login", function(data) {
        userRcv = setUser(data);


        if(isRegistered(userRcv))
            if(isCorrectPsw(userRcv))
                socket.emit("userLogged");
            else
                socket.emit("incorrectPsw");
        else{
            databaseUsers[userRcv.username] = userRcv.psw;
            userSensors[userRcv.username] = [];
            socket.emit("userRegistered");
        }
        socket.emit("mySensors", userSensors[userRcv.username]);
    });

    socket.on("newSensor", function(sensorData){
        console.log("User " + userRcv.username + " requests adding new sensor: " + JSON.stringify(sensorData));
        
        const newSensor = {
            name : sensorData.name,
            type : sensorData.type,
            updateFreq : sensorData.updateFreq
        };

        userSensors[userRcv.username].push(newSensor);


        console.log("\n\n UserSensors:  " + JSON.stringify(userSensors));

        socket.emit("mySensors", userSensors[userRcv.username]);
    });




});

const setUser = (data) => {
    const user = {
        username: data.username,
        psw: data.psw
    };
    return user;
}

const isRegistered = (userRcv) => {
    return databaseUsers[userRcv.username];
}

const isCorrectPsw = (userRcv) => {
    return databaseUsers[userRcv.username] == userRcv.psw;
}


http.listen(8080, () => {
    console.log("Server Listening on port 8080");
});

