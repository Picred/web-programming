(() => {    
    window.onload = () => {
        terminal = {
            // terminalElement : document.querySelector(".desktop>.wallpaper>.terminal"),
            // navbarElement : document.querySelector(".desktop>.wallpaper>.terminal>.terminal-navbar"),
            inputContainerElement : document.querySelector(".desktop>.wallpaper>.terminal>.input-shell"),
            init : function() {
                const row = document.createElement("input")
                row.classList = ["row"];
                this.inputContainerElement.innerHTML = "<span>andrei@ubuntu:$ </span>";
                this.inputContainerElement.appendChild(row);
            }
        };
        
        terminal.init()
        console.log(terminal.inputContainerElement)
        // inizializza la shell
    }
    
})()