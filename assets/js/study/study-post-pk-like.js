
// 좋아요 상태를 추적하여 UI를 업데이트하는 코드 시작
let isLiked = false;  // 좋아요 상태를 추적하는 변수 초기화

function checkLikeStatus(postData) {
    // 서버에서 제공하는 좋아요 상태 정보를 기반으로 isLiked 변수 설정
    // 예: 서버에서 postData에 isLiked 정보를 포함하여 반환한다고 가정
    isLiked = postData.isLiked;
    updateLikeButton(); // 좋아요 버튼 UI 업데이트 함수 호출
}

// 좋아요 버튼 UI 업데이트 함수
function updateLikeButton() {
    const likeButton = document.getElementById('likeButton');
    // 좋아요 상태에 따라 버튼 스타일 변경
    likeButton.textContent = isLiked ? '💖' : '🤍';
}

// 좋아요 버튼 클릭 이벤트 리스너
document.getElementById('likeButton').addEventListener('click', function() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    const method = isLiked ? 'DELETE' : 'POST';
    fetch(`http://127.0.0.1:8000/study/${postId}/like/`, {
        method: method,  // 좋아요 설정 또는 해제를 위한 요청
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('좋아요 처리 중 오류가 발생했습니다.');
        }
        const likeButton = document.getElementById('likeButton');
        if (method === 'DELETE') {
            likeButton.textContent = '💞';
        }
        else {
            likeButton.textContent = '💞';
        }
        return response.json();
    })
    .then(data => {
        // 여기서 data를 사용하여 좋아요 상태를 업데이트하거나, UI를 변경하세요.
        // 예: 좋아요 수를 업데이트하거나, 버튼 스타일 변경 등
        console.log('좋아요 상태 변경됨:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.reload();

    });
});
