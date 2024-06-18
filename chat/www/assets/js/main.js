const nicknameContainer = document.querySelector("#nicknameInput");
const loginBtn = document.querySelector("#btn-login");
const loginFormContainer = document.querySelector("#loginform");
const chatContainer = document.querySelector("#chatview");
const messagesContainer = document.querySelector("#containerMessaggi");
const listUsers = document.querySelector("#listausers");


let nickname;


listUsers.innerHTML = "";

const insertUser = (user) => {
        document.querySelector("#listausers").innerHTML+= `<li>
                                <div class="d-flex bd-highlight">
                                    <div class="img_cont">
                                        <img src="https://ui-avatars.com/api/?name=${user}"
                                            class="rounded-circle user_img" />
                                        <span class="online_icon online"></span>
                                    </div>
                                    <div class="user_info">
                                        <span>${user}</span>
                                    </div>
                                </div>
                            </li>`;
}


const popolateUsers = (listUsers) => {
    for(user of listUsers){
        document.querySelector("#listausers").innerHTML+= `<li>
                                <div class="d-flex bd-highlight">
                                    <div class="img_cont">
                                        <img src="https://ui-avatars.com/api/?name=${user}"
                                            class="rounded-circle user_img" />
                                        <span class="online_icon online"></span>
                                    </div>
                                    <div class="user_info">
                                        <span>${user}</span>
                                    </div>
                                </div>
                            </li>`;
    }
}

loginBtn.addEventListener("click", () => {
    const socket = io();
    loginFormContainer.classList = "container-fluid h-100 hidden";
    chatContainer.classList = "container-fluid h-100";
    
    nickname = nicknameContainer.value;
    socket.on("connect", async () => {
        console.log("connesso");
        messagesContainer.innerHTML = "";
        socket.emit("login", nickname);

        const res = await fetch("/api/users");
        const listUsers = await res.json();
        
        popolateUsers(listUsers);
    });

    socket.on("disconnect", () => {
        console.log("Disconnesso");
    })

    socket.on("newuser", (nickname) => {
        insertUser(nickname)
    });
})