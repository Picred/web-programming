const nicknameContainer = document.querySelector("#nicknameInput");
const loginBtn = document.querySelector("#btn-login");
const loginFormContainer = document.querySelector("#loginform");
const chatContainer = document.querySelector("#chatview");
const messagesContainer = document.querySelector("#containerMessaggi");
const listUsers = document.querySelector("#listausers");
const sendBtn = document.querySelector("#send_btn")
const inputMessage = document.querySelector("#inputMessage");


let nickname;
let socket;

listUsers.innerHTML = "";

const insertUser = (user) => {
        document.querySelector("#listausers").innerHTML+= `<li nickname = ${user}>
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
        document.querySelector("#listausers").innerHTML+= `<li nickname = ${user}>
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

const recvMessage = (message, from) => {
    const dataObj = new Date();
    const data = dataObj.getHours() +":"+dataObj.getMinutes();
    messagesContainer.innerHTML+= '<div class="d-flex justify-content-start mb-4">\
                            <div class="img_cont_msg">\
                                <img src="https://ui-avatars.com/api/?name='+from+'"\
                                    class="rounded-circle user_img_msg" />\
                            </div>\
                            <div class="msg_cotainer">\
                                <div class="text-muted h6">'+from+'</div>\
                                '+message+'\
                                <span class="msg_time mt-4">'+data+'</span>\
                            </div>\
                        </div>'
}


const removeUser = (nicknameToRemove) => {
    document.querySelector("#listausers> li[nickname="+nicknameToRemove+"]").remove();
}

loginBtn.addEventListener("click", () => {
    socket = io();
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

    // socket.on("disconnect", () => {
    //     console.log("Disconnesso");
    // })

    socket.on("newuser", (nickname) => {
        insertUser(nickname)
    });

    socket.on("newMessage", (message, from) => {
        recvMessage(message, from);
    });

    socket.on("userDisconnected", (socketNickname) => {
        console.log("Si è disconnesso: " + socketNickname);
        removeUser(socketNickname);
    })
})

const sendMessage = () => {
    const message = inputMessage.value;
    inputMessage.value = "";
    const dataObj = new Date();
    const data = dataObj.getHours() +":"+dataObj.getMinutes();
    messagesContainer.innerHTML += `<div class="d-flex justify-content-end mb-4">
                            <div class="msg_cotainer_send">
                                ${message}
                                <span class="msg_time_send">${data}</span>
                            </div>
                            <div class="img_cont_msg">
                                <img src="https://ui-avatars.com/api/?name=${nickname}" class="rounded-circle user_img_msg" />
                            </div>
                        </div>`
    socket.emit("sendMessage", message, nickname);
}


sendBtn.addEventListener("click", () => {
    sendMessage();
})