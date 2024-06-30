const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static("./public"));
app.use(express.urlencoded({extent:false}));
app.use(express.json());

const databaseUsers = {};
const userSensors = {}; 

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
            updateFreq : sensorData.updateFreq,
            val: getRandSensVal(100, 0)
        };

        userSensors[userRcv.username].push(newSensor);

        socket.emit("mySensors", userSensors[userRcv.username]);

        setInterval(() => {
            updateSensor(newSensor);
        }, parseInt(newSensor.updateFreq)*1000);
    });

    socket.on("deleteSensor", function(sensorName) {
        for (index in userSensors[userRcv.username])
            if(userSensors[userRcv.username][index].name == sensorName)
                userSensors[userRcv.username].splice(index,1);
        
        socket.emit("mySensors", userSensors[userRcv.username]);
    });

    const updateSensor = function(sensor){
        const sensorUpdated = {
            name : sensor.name,
            type : sensor.type,
            updateFreq : sensor.updateFreq,
            val: getRandSensVal(100, 0)
        }

        for (index in userSensors[userRcv.username])
            if(userSensors[userRcv.username][index].name == sensor.name)
                userSensors[userRcv.username][index].val = sensorUpdated.val;
        socket.emit("mySensors", userSensors[userRcv.username]);
    }
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

const getRandSensVal = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


http.listen(8080, () => {
    console.log("Server Listening on port 8080");
});
