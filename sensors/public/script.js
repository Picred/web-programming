(() => {
    window.onload = () => {
        const socket = io();
        const desktop = document.querySelector(".desktop");
        const loginFormContainer = document.querySelector(".loginform-container");
        const loginBtn = document.querySelector(".loginform-container>.loginform>.login-btn");

        loginBtn.addEventListener("click", () => {
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
                desktop.style.display = "grid";
                loginFormContainer.style.display = "none";

                const welcomeElem = document.querySelector(".desktop>.header>.welcome");
                welcomeElem.innerHTML = "Welcome back " + userData.username;
            });

            socket.on("incorrectPsw", () => {
                alert("Incorrect Password");
            });

            socket.on("userRegistered", () => {
                alert("Registered");
                desktop.style.display = "grid";
                loginFormContainer.style.display = "none";
                
                const welcomeElem = document.querySelector(".desktop>.header>.welcome");
                welcomeElem.innerHTML = "Welcome " + userData.username;
            })
        }

        // Add new sensor
        const addSensorBtn = document.querySelector(".desktop>.sidebar>.sidebar-elem>.add-sensor-btn");

        addSensorBtn.addEventListener("click", () => {
            const sensorTypeElement = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-type");
            const sensorNameElement = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-name");
            const sensorUpdateFreqElement = document.querySelector(".desktop>.sidebar>.sidebar-elem>.sensor-update-frequency");

            const sensorType = sensorTypeElement.value;
            const sensorName = sensorNameElement.value;
            const sensorUpdateFreq = sensorUpdateFreqElement.value;

            sensorNameElement.value = "";
            sensorTypeElement.value = "";
            sensorUpdateFreqElement.value = "";

            if(!sensorName || !sensorType || !sensorUpdateFreq)
                alert("Fill all fields");
            else{
                const sensorData = {
                    name: sensorName,
                    type: sensorType,
                    updateFreq: sensorUpdateFreq
                }
                
                if(!sensorAlreadyExists(sensorName))
                    socket.emit("newSensor", sensorData);
                else
                    alert("Sensor already exists!");
            }
        });

        // Show my sensors from server
        socket.on("mySensors", function(mySensors){
            const sensorsContainer = document.querySelector(".desktop>.main-content>.sensors-container");
            sensorsContainer.innerHTML = "";
            for (sensor of mySensors){
                const newSensor = document.createElement("div");
                newSensor.classList = ["sensor"];
                newSensor.setAttribute("sensor-name", sensor.name);

                newSensor.innerHTML = `<p class='name'>Name: ${sensor.name}</p>
                <p class='type'>Type: ${sensor.type}</p>
                <p class='updateFreq'>Update Time: ${sensor.updateFreq}</p>
                <progress class="sensor-val-bar" max ="100" value='${sensor.val}' ></progress>
                <button class='delete-btn'>Delete sensor (<code>${sensor.name}</code>)</button>`;
                
                sensorsContainer.appendChild(newSensor);

                const deleteBtn = sensorsContainer.querySelector("div[sensor-name=" + sensor.name + "]");
                deleteBtn.addEventListener("click", () => {
                    sensorsContainer.removeChild(newSensor);
                    socket.emit("deleteSensor", sensor.name);
                });
            }
        });

        const sensorAlreadyExists = (sensorName) => {
            const sensorsContainer = document.querySelector(".desktop>.main-content>.sensors-container");
            const sensor = sensorsContainer.querySelector("div[sensor-name=" + sensorName + "]");
            return sensor;
        }

        socket.on("updateSensor", function(sensorUpdated) {
            const sensorsContainer = document.querySelector(".desktop>.main-content>.sensors-container");
            const sensorOld = sensorsContainer.querySelector("div[sensor-name=" + sensorUpdated.name + "]");
            sensorOld.querySelector("progress").setAttribute("val",sensorUpdated.val);
        });
    }
})();