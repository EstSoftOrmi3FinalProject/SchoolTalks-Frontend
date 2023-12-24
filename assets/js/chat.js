const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const refreshButton = document.getElementById("refresh-button"); // 새로고침 버튼 참조

const apiUrl = baseDomain + "chat/api/chat-messages/";

// 채팅 메시지를 저장할 배열
const messagesArray = [];

// 서버로 메시지 전송
sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
        sendMessage(message);
        messageInput.value = "";
    }
});

// Enter 키를 눌러 메시지 전송
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const message = messageInput.value;
        if (message) {
            sendMessage(message);
            messageInput.value = "";
        }
    }
});

// 메시지를 서버로 전송하고 화면에 표시
async function sendMessage(message) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    if (response.status === 201) {
        const data = await response.json();
        messagesArray.unshift(data); // 새로운 메시지를 배열에 추가
        displayMessages(); // 새로운 메시지를 화면에 표시
    }
}

refreshButton.addEventListener("click", () => {
    location.reload(); // 페이지 새로고침
});
// timestamp 값을 월, 일, 시간, 분으로 표시하는 함수
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth는 0부터 시작하므로 1을 더합니다.
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 10보다 작은 월, 일, 분은 앞에 0을 붙여서 표시
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${year}-${formattedMonth}-${formattedDay} ${hours}:${formattedMinutes}`;
}

// 서버에서 받은 timestamp를 포맷팅하여 표시
function displayMessages() {
    const reversedMessages = messagesArray.slice().reverse();

    chatMessages.innerHTML = "";

    reversedMessages.forEach((messageData) => {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.innerHTML = `
            <small>📆${formatTimestamp(messageData.timestamp)}</small>        
            <p>🎭Anonymous${messageData.id} : ${messageData.message}</p>
        `;
        chatMessages.appendChild(messageElement);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 일정 간격으로 메시지를 가져와 화면에 표시
async function getChatMessages() {
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    if (response.status === 200) {
        const messages = await response.json();
        messagesArray.push(...messages); // 서버에서 받은 메시지를 배열에 추가
        displayMessages(); // 메시지를 화면에 표시
    }
}

getChatMessages();
