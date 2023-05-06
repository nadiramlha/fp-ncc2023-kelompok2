(function(){

    const app = document.querySelector(".app");
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const socket = io();

    let uname;

    hamburger.addEventListener("click", ()=>{
        hamburger.classList.toggle("activehamburger");
        navMenu.classList.toggle("activehamburger");
    });
    
    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let Username = app.querySelector(".join-screen #Username").value;
        if(Username.length == 0){
            return;
        }
        socket.emit("newuser", Username);
        uname = Username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my",{
            Username:uname,
            text:message
        }, app);
        socket.emit("chat",{
            Username:uname,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector("#exit-chat").addEventListener("click", function(){
        console.log("exit");
        socket.emit("exituser", uname);
        window.location.href = "index.html";
    });

    socket.on("update", function(update){
        renderMessage("update", update, app);
    });

    socket.on("chat", function(message){
        renderMessage("other", message, app);
    });  

    function renderMessage(type, message, app){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.Username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight = messageContainer.clientHeight;
    }

})();