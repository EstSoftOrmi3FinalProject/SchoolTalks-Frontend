document.addEventListener('DOMContentLoaded', async function () {
    // 일정 시간이 지난 후 프리로더 숨기기
    window.setTimeout(() => {
        fadeout(".preloader");
    }, 500);

    // 페이지 로드 시 이전 메시지 로드
    await loadPreviousMessages();
});

function fadeout(selector) {
    const preloader = document.querySelector(selector);
    preloader.style.opacity = "0";
    preloader.style.display = "none";
}

function scrollToBottom() {
    var chatContainer = document.querySelector('.messages');
    chatContainer.scroll({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

async function loadPreviousMessages() {
    try {
        const token = localStorage.getItem('access_token');
        const apiUrl = 'http://127.0.0.1:8000/aichat/';

        // 이전 메시지를 가져오기 위한 GET 요청
        const previousMessages = await apiGet(apiUrl, {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        // 이전 채팅 영역 초기화
        var chatContainer = document.querySelector('.messages');
        chatContainer.innerHTML = '';

        if (previousMessages.length === 0) {
            appendAiMessage("AI에게 모르는 문제나 면접 질문을 물어보세요!");
            appendAiMessage("Ex) ~하는 수학 문제를 모르겠어 or 면접에서 지원 동기를 물어보면 어떤 대답이 좋을까?")
        }
        // 이전 메시지 추가
        previousMessages.forEach(message => {
            // 오른쪽에는 User의 질문
            chatContainer.innerHTML += `<li class="message right">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">${message.prompt}</div>
                </div>
            </li>`;
            
            // 왼쪽에는 AI의 답변
            chatContainer.innerHTML += `<li class="message left">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">${message.response}</div>
                </div>
            </li>`;
        });

        scrollToBottom();

    } catch (error) {
        console.error(error);
        alert('이전 메시지를 불러오는 데 실패했습니다. 다시 시도해주세요.');
    }
}

async function sendMessage() {
    try {
        const token = localStorage.getItem('access_token');
        const apiUrl = 'http://127.0.0.1:8000/aichat/';

        // 입력된 채팅 가져오기
        const userMessage = document.getElementById('chat-input').value;

        // 텍스트 필드 초기화
        document.getElementById('chat-input').value = '';

        // 사용자의 채팅 화면에 표시
        appendUserMessage(userMessage);

        // AI의 답변을 기다리면서 로딩 상태 표시
        appendLoadingMessage();

        scrollToBottom();

        // POST 요청으로 새로운 채팅 추가
        const aiResponse = await apiPost(apiUrl, {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }, { prompt: userMessage });

        // 로딩 중 메시지 제거
        removeLoadingMessage();

        // AI의 답변 화면에 표시
        appendAiMessage(aiResponse.response);

        scrollToBottom();
    } catch (error) {
        console.error(error);
        alert('메시지를 전송하는 데 실패했습니다. 다시 시도해주세요.');
    }
}

function appendUserMessage(message) {
    var chatContainer = document.querySelector('.messages');
    // 오른쪽에는 User의 질문
    chatContainer.innerHTML += `<li class="message right">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">${message}</div>
        </div>
    </li>`;
}

function appendLoadingMessage() {
    var chatContainer = document.querySelector('.messages');
    // 로딩 중 메시지 표시
    chatContainer.innerHTML += `<li class="message left" id="loading-message">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">...</div>
        </div>
    </li>`;
}

function removeLoadingMessage() {
    var loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function appendAiMessage(response) {
    var chatContainer = document.querySelector('.messages');
    // 왼쪽에는 AI의 답변
    chatContainer.innerHTML += `<li class="message left">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">${response}</div>
        </div>
    </li>`;
}

async function deletePreviousMessages() {
    try {
        const token = localStorage.getItem('access_token');
        const apiUrl = 'http://127.0.0.1:8000/aichat/';

        // DELETE 요청으로 이전 메시지 삭제
        await apiDelete(apiUrl, {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        // 이전 메시지 삭제 후 화면 갱신
        await loadPreviousMessages();
    } catch (error) {
        console.error(error);
        alert('이전 메시지를 삭제하는 데 실패했습니다. 다시 시도해주세요.');
    }
}