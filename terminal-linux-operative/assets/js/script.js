(() => {    
    window.onload = () => {
        
        terminal = {
            inputContainerElement : document.querySelector(".desktop>.wallpaper>.terminal>.input-container"),
            username : "andrei",
            init: function(){
                const spanElement = document.createElement("span");
                spanElement.classList = ["username"];
                spanElement.innerHTML = `${this.username}@ubuntu~$:`;

                const inputElement = document.createElement("input");
                inputElement.type = "text";

                this.inputContainerElement.appendChild(spanElement);
                this.inputContainerElement.appendChild(inputElement);
                inputElement.focus();

                inputElement.addEventListener("keydown", (event) => {
                    if (event.key === "Enter"){
                        this.persist(inputElement.value);
                    }
                })
            },

            persist: function(cmd){
                const parent = this.inputContainerElement;

                this.removeChild();

                parent.innerHTML += cmd;
                if (cmd === ""){ // add empty element to keep the same height (grid layout)
                    const emptyElement = document.createElement("div");
                    parent.appendChild(emptyElement);
                }
                this.init();
                this.execute(cmd);
            },

            execute: function(cmdArgs){
                const cmd = cmdArgs.split(" ");
                switch(cmd[0]){
                    case "clear":
                        this.clear();
                        break;
                    case "":
                        break;
                    case "help":
                        this.help();
                        break;
                    case "user":
                        this.user(cmd[1]);
                        break;
                    case "time":
                        this.time();
                        break;
                    case "curl":
                        if (!cmd[1].startsWith("http") || cmd[1] !== "")
                            this.error(cmd[0], "URL must start with http(s)");
                        else
                            this.curl(cmd[1]);
                        break;
                    default:
                        this.error(cmdArgs);
                        break;
                }
            },

            clear: function(username){
                this.inputContainerElement.innerHTML = "";
                if (username !== undefined){
                    this.username = username;
                }
                this.init();
            },

            help: function(){
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.style = "color: #aaa;";
                response.innerHTML += "Available commands:\
                    <br>clear: clear the console\
                    <br>help: show this message\
                    <br>user [username]: change the username and clear the console\
                    <br> time: show the current time\
                    <br> curl [url]: fetch a file from the web";
                parent.appendChild(response);
                this.init();
            },

            error: function(cmd, arg){
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.style = "color: #f00;";
                response.innerHTML += "Error: command not found: " + cmd + (arg  ? " " + arg : "");
                parent.appendChild(response);
                this.init();
            },

            removeChild: function(){
                const parent = this.inputContainerElement;
                const oldchild = this.inputContainerElement.querySelector("input");
                parent.removeChild(oldchild);
            },

            user: function(username){
                if (username === undefined || username === ""){
                    this.error("user", "Empty username not allowed.");
                } else {
                    this.removeChild();
                    const blank = document.createElement("span");
                    this.inputContainerElement.appendChild(blank);
                    this.clear(username);
                }
            },

            time : function(){
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.innerHTML += new Date().toLocaleTimeString();
                parent.appendChild(response);
                this.init();
            },

            curl: function(url) {
                const parent = this.inputContainerElement;
                const responseElement = document.createElement("span");
            
                this.removeChild();
            
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        responseElement.innerHTML = data;
                    });
                    parent.appendChild(responseElement);
                    this.init();
            }
        };

        terminal.init()
    }
})()