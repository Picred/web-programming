(() => {    
    window.onload = () => {
        
        terminal = {
            inputContainerElement : document.querySelector(".desktop>.wallpaper>.terminal>.input-container"),
            username : "andrei",
            init: function(username){
                if (username !== undefined){
                    this.username = username;
                }
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
                    case "help":
                        this.help();
                        break;
                    case "user":
                        this.user(cmd[1]);
                        break;
                    default:
                        this.error(cmdArgs);
                        break;
                }
            },

            clear: function(){
                const parent = this.inputContainerElement;
                parent.innerHTML = "";
                this.init();
            },

            help: function(){
                const parent = this.inputContainerElement;
                const response = document.createElement("span");

                this.removeChild();

                response.style = "color: #aaa;";
                response.innerHTML += "Available commands: clear help";
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
                if (username === undefined){
                    this.error("user");
                } else {
                    this.removeChild();
                    const blank = document.createElement("p");
                    this.inputContainerElement.appendChild(blank);
                    this.init(username); // TODO fix grid layout, se il nome è più corto la griglia non cambia
                }
            }
        };
        terminal.init()

    }
})()

