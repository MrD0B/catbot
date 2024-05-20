let ws;

function connectWebSocket() {
    const username = document.getElementById('usernameInput').value;
    if (username.trim().length > 0) {
        ws = new WebSocket(`ws://192.168.3.20/ws/${username}`);
        ws.onopen = function() {
            console.log('Connected to the WebSocket server');
            document.getElementById('userLabel').textContent = `User: ${username}`;
            document.getElementById('userInputContainer').style.display = 'none';
            document.getElementById('chatMessages').style.display = 'block';
            document.getElementById('chatInput').style.display = 'flex';
        };

        ws.onmessage = function(event) {
            const message = JSON.parse(event.data);
            logMessage(message);

            if (message.type === 'chat') {
                displayMessage(message.content, 'bot');
            }
            // Ignorare i messaggi di tipo 'chat_token'
        };

        ws.onclose = function() {
            console.log('Disconnected from the WebSocket server');
        };
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value;

    if (text) {
        const message = { text: text };
        ws.send(JSON.stringify(message));
        displayMessage(text, 'user');
        input.value = '';
    }
}

function displayMessage(text, sender) {
    if (text.trim().length > 0) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        console.log(`Displayed message from ${sender}:`, text);
    }
}

function resetBuffer() {
    console.log('Resetting buffer. Current buffer:', messageBuffer);
    messageBuffer = '';
    isAssembling = false;
    console.log('Buffer reset');
}

function logMessage(message) {
    console.log('Received message:', message);
}

// Funzione per rendere la chat spostabile
dragElement(document.getElementById("chatContainer"));

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById("chatHeader");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
