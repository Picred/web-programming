(() => {
    window.onload = () => {
        date = {
            dateElement: document.querySelector(".desktop>.wallpaper>.activity-bar>.date"),
            init: function(){
                this.updateDate();
                setInterval(() => {
                    this.updateDate();
                }, 1000);
            },
            updateDate: function() {
                this.dateElement.innerHTML = new Date().toLocaleString();
            }
        }
        

        terminal = {
            inputContainerElement: document.querySelector(".desktop>.wallpaper>.terminal>.input-container"),
            defaultTerminalElement: undefined,
            closed: false,
            isMaximized: false,
            isMinimized: false,
            username: "andrei",

            init: function () {
                const spanElement = document.createElement("span");
                spanElement.classList = ["username"];
                spanElement.innerHTML = `${this.username}@ubuntu~$:`;

                const inputElement = document.createElement("input");
                inputElement.type = "text";

                this.inputContainerElement.appendChild(spanElement);
                this.inputContainerElement.appendChild(inputElement);
                inputElement.focus();

                inputElement.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        this.persist(inputElement.value);
                    }
                });
            },

            persist: function (cmd) {
                const parent = this.inputContainerElement;

                this.removeChild();

                const responseElement = document.createElement("span");
                responseElement.innerHTML = cmd;
                responseElement.style = "overflow:hidden";
                parent.appendChild(responseElement);

                this.init();
                this.execute(cmd);
            },

            execute: function (cmdArgs) {
                const cmd = cmdArgs.split(" ");
                switch (cmd[0]) {
                    case "clear":
                        if(cmd.length < 2)
                            this.clear();
                        else
                            this.error("", "Use clear without arguments");
                        break;
                    case "":
                        break;
                    case "help":
                        if(cmd.length < 2)
                            this.help();
                        else
                            this.error("", "Use help without arguments");
                        break;
                    case "user":
                        if(cmd.length === 2)
                            this.user(cmd[1]);
                        else
                            this.error("", "Use user with 1 argument");
                        break;
                    case "time":
                        if(cmd.length < 2)
                            this.time();
                        else
                            this.error("", "Use time without arguments")
                        break;
                    case "curl":
                        if (!cmd[1] || !cmd[1].startsWith("http")|| cmd.length > 2)
                            this.error("", "URL must start with http(s) or there are too many arguments (1 allowed)<br>Try with: curl https://jsonplaceholder.typicode.com/todos [albums, users..]");
                        else
                            this.curl(cmd[1]);
                        break;
                    case "exit":
                        if(cmd.length < 2)
                            this.exit();
                        else
                            this.error("", "Use exit without arguments")
                        break;
                    default:
                        this.error("command not found");
                        break;
                }
            },

            clear: function (username) {
                this.inputContainerElement.innerHTML = "";
                if (username !== undefined) {
                    this.username = username;
                    const navbarElement = document.querySelector(".desktop>.wallpaper>.terminal>.terminal-navbar");
                    navbarElement.querySelector(".navbar-username").innerHTML = `${username}@ubuntu: ~`;
                }
                this.init();
            },

            help: function () {
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.style = "color: #aaa;";
                response.innerHTML += "[help]:Available commands:\
                    <br>-clear: clear the console\
                    <br>-help: show this message\
                    <br>-user [username]: change the username\
                    <br>-time: show the current time\
                    <br>-exit: close the terminal\
                    <br>-curl [url]: fetch a file from the web";
                parent.appendChild(response);
                this.init();
            },

            error: function (cmd, arg) {
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.style = "color: #f00;";
                response.innerHTML += "error: " + cmd + (arg ? " " + arg : "");
                parent.appendChild(response);
                this.init();
            },

            removeChild: function () {
                const parent = this.inputContainerElement;
                const oldchild = this.inputContainerElement.querySelector("input");
                parent.removeChild(oldchild);
            },

            user: function (username) {
                if (username === undefined || username === "") {
                    this.error("", "Empty username not allowed.");
                } else if (username.length <= 10){
                    this.removeChild();
                    const blank = document.createElement("span");
                    this.inputContainerElement.appendChild(blank); // grid
                    this.clear(username);
                } else{
                    this.error("","Username too long (max 10 characters)");
                }
            },

            time: function () {
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.innerHTML += new Date().toLocaleString();
                parent.appendChild(response);
                this.init();
            },

            curl: function (url) {
                const parent = this.inputContainerElement;
                const responseElement = document.createElement("span");

                this.removeChild();

                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        responseElement.style = "color: #aaa;"
                        responseElement.innerHTML = data;
                    })
                    .catch((error) => {
                        responseElement.style = "color: #f00;"
                        responseElement.innerHTML = error;
                        responseElement.innerHTML += "<br>Try with: curl https://jsonplaceholder.typicode.com/todos {albums, users..}";
                    })
                parent.appendChild(responseElement);
                this.init();
            },

            exit: function(){
                const wallpaperElement = document.querySelector(".desktop>.wallpaper");
                this.clear();
                this.defaultTerminalElement = document.querySelector(".desktop>.wallpaper>.terminal");
                wallpaperElement.removeChild(wallpaperElement.querySelector(".terminal"));
                this.closed = true;
            },

            open: function(){
                if(this.closed){
                    const wallpaperElement = document.querySelector(".desktop>.wallpaper");
                    wallpaperElement.appendChild(this.defaultTerminalElement);
                }

                if(this.isMinimized){
                    const terminalElement = document.querySelector(".desktop>.wallpaper>.terminal");
                    terminalElement.style.removeProperty("display");
                    this.isMinimized = false;
                }
            },

            changeSize: function(){
                const terminalElement = document.querySelector(".desktop>.wallpaper>.terminal"); 
                terminalElement.style = "";
                terminalElement.classList = [`terminal ${(!this.isMaximized ? "maximize" : "normalize")}`];
                this.isMaximized= !this.isMaximized;
            },

            minimize: function(){
                const terminalElement = document.querySelector(".desktop>.wallpaper>.terminal"); 
                terminalElement.style = "display: none;"
                this.isMinimized = true;
            }
        };
        date.init();
        terminal.init()

        const minimizeButtonElement = document.querySelector(".desktop>.wallpaper>.terminal>.terminal-navbar>.minimize-button");
        const maximizeButtonElement = document.querySelector(".desktop>.wallpaper>.terminal>.terminal-navbar>.maximize-button");
        const closeButtonElement = document.querySelector(".desktop>.wallpaper>.terminal>.terminal-navbar>.close-button");
        const terminalIconElement = document.querySelector(".desktop>.wallpaper .terminal-icon");
        const terminalElement = document.querySelector(".desktop>.wallpaper>.terminal");

        minimizeButtonElement.addEventListener("click", () => {terminal.minimize();});
        closeButtonElement.addEventListener("click", () => {terminal.exit();});
        maximizeButtonElement.addEventListener("click", () => {terminal.changeSize();});
        terminalIconElement.addEventListener("click", () => {terminal.open();});
        terminalElement.addEventListener("click", () => {document.querySelector(".desktop>.wallpaper>.terminal>.input-container input").focus();});
    }
})()