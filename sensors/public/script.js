(() => {
    window.onload = () => {
        const mainAppContainer = document.querySelector(".desktop>.main-content>.apps-container");

        mainAppContainer.innerHTML += "<div class='main-app'>app3</div>";

        const socket = io();

        
    }
})();