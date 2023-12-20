document.addEventListener('DOMContentLoaded', function () {
    // 페이지 로드 시 이전 채팅을 가져와 화면에 표시
    loadPreviousMessages();
});

async function loadPreviousMessages() {
    try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('access_token');

        // GET 요청을 통해 이전 채팅 메시지 가져오기
        const previousMessages = await apiGet('http://127.0.0.1:8000/aichat/', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        // 화면에 이전 채팅 메시지 표시
        var chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = ''; // 이전 채팅 삭제
        previousMessages.forEach(message => {
            chatContainer.innerHTML += `<p>User: ${message.prompt}</p>`;
            chatContainer.innerHTML += `<p>AI: ${message.response}</p>`;
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load previous messages. Please try again.');
    }
}

async function sendMessage() {
    try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('access_token');

        // 입력된 채팅 가져오기
        const userMessage = document.getElementById('chat-input').value;

        // POST 요청으로 새로운 채팅 추가
        await apiPost('http://127.0.0.1:8000/aichat/', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }, { prompt: userMessage });

        // 입력창 비우고 이전 채팅 다시 로드
        document.getElementById('chat-input').value = '';
        loadPreviousMessages();
    } catch (error) {
        console.error(error);
        alert('Failed to send message. Please try again.');
    }
}

async function deletePreviousMessages() {
    try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('access_token');

        // DELETE 요청으로 이전 채팅 삭제
        await apiDelete('http://127.0.0.1:8000/aichat/', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        // 이전 채팅 삭제 후 화면 갱신
        loadPreviousMessages();
    } catch (error) {
        console.error(error);
        alert('Failed to delete previous messages. Please try again.');
    }
}
