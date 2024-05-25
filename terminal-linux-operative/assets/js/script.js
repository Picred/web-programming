(() => {    
    window.onload = () => {
        
        terminal = {
            inputContainerElement : document.querySelector(".desktop>.wallpaper>.terminal>.input-container"),

            init: function(){
                const spanElement = document.createElement("span");
                spanElement.classList = ["username"];
                spanElement.innerHTML = "andrei@ubuntu~$: ";

                const inputElement = document.createElement("input");
                inputElement.type = "text";
                this.inputContainerElement.appendChild(spanElement);
                this.inputContainerElement.appendChild(inputElement);

                inputElement.addEventListener("keydown", (event) => {
                    if (event.key === "Enter"){
                        const cmd = inputElement.value;
                        this.persist(cmd);
                    }
                })
            },

            persist: function(cmd){
                console.log(cmd)
                const parent = this.inputContainerElement;
                const oldchild = this.inputContainerElement.querySelector("input")
                parent.removeChild(oldchild)
                // this.init()
            }
        };

        terminal.init()
        // console.log(terminal.inputContainerElement)
        // inizializza la shell
    }

})()