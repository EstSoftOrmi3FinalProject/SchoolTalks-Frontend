document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    // 삭제 확인 버튼 클릭 이벤트 리스너
    document.getElementById('confirmDeleteButton').addEventListener('click', function() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html'; // 로그인 페이지로 이동
            return;
        }

        const confirmDelete = confirm('정말로 이 게시물을 삭제하시겠습니까?');
        if (confirmDelete) {
            // 게시물 삭제 API 요청
            fetch(`http://127.0.0.1:8000/posts/${postId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('게시물 삭제 중 오류가 발생했습니다.');
                }
                return response.json();
            })
            .then(data => {
                // 게시물 삭제가 성공적으로 이루어진 경우
                alert('게시물이 삭제되었습니다.');
                // 삭제 후 이동할 페이지로 리디렉션 (예: 홈 페이지)
                window.location.href = 'index.html'; // 이동할 페이지 URL 설정
            })
            .catch(error => {
                console.error('Error:', error);
                alert('게시물 삭제 실패');
            });
        }
    });

    // 삭제 취소 버튼 클릭 이벤트 리스너
    document.getElementById('cancelDeleteButton').addEventListener('click', function() {
        // 삭제를 취소하고 이전 페이지로 이동합니다.
        window.history.back();
    });
});
