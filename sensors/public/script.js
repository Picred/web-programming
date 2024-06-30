(() => {
    window.onload = () => {
        const socket = io();
        const desktop = document.querySelector(".desktop");
        const loginFormContainer = document.querySelector(".loginform-container");
        const loginBtn = document.querySelector(".loginform-container>.loginform>.login-btn");

        loginBtn.addEventListener("click", (e) => {
            const username = loginFormContainer.querySelector(".loginform>.username").value;
            const psw = loginFormContainer.querySelector(".loginform>.psw").value;
            
            if(!username || !psw){
                alert("Fill all fields");
            }
            else{
                const userData = {
                    username: username,
                    psw: psw
                }
                loginUser(socket, userData);
            }
        })

        const loginUser = (socket, userData) => {
            socket.emit("login", userData);

            socket.on("userLogged", () => {
                alert("Logged in :)");

                desktop.style.display = "grid";
                loginFormContainer.style.display = "none";

            });

            socket.on("incorrectPsw", () => {
                alert("Incorrect Password");
            });

            socket.on("userRegistered", () => {
                alert("Registered");
                desktop.style.display = "grid";
                loginFormContainer.style.display = "none";
            })
        }

        // Add new sensor
        const addSensorBtn = document.querySelector(".desktop>.sidebar>.sidebar-elem>.add-sensor-btn");
        
        addSensorBtn.addEventListener("click", () => {
            const sensorType = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-type").value;
            const sensorName = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-name").value;
            const sensorUpdateFreq = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-update-frequency").value;

            if(!sensorName || !sensorType || !sensorUpdateFreq)
                alert("Fill all fields");
            else{
                const sensorData = {
                    name: sensorName,
                    type: sensorType,
                    updateFreq: sensorUpdateFreq
                }
                socket.emit("newSensor", sensorData);
            }
        })

        // Show my sensors from server
        socket.on("mySensors", function(mySensors){
            for (sensor of mySensors){
                // create html element "sensor" and append to sensorsContainer
                const sensorsContainer = document.querySelector(".desktop>.main-content>.sensors-container");
                sensorsContainer.innerHTML = "";
                const newSensor = document.createElement("div");
                newSensor.classList = ["sensor"];
                newSensor.innerHTML = `<p class='name'>${sensor.name}</p>
                                    <p class='type'>${sensor.type}</p>
                                    <p class='updateFreq'>${sensor.updateFreq}</p>`;
                sensorsContainer.appendChild(newSensor);
                // TODOOOOOOO
            }
        })
    }
})();