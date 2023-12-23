// delete.js 파일에 아래 코드를 추가합니다.

document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    // 삭제 버튼 클릭 시 이벤트 리스너를 추가합니다.
    document.getElementById('deletePostButton').addEventListener('click', function() {
        if (confirm('게시물을 삭제하시겠습니까?')) {
            // 확인 버튼이 클릭된 경우 서버로 DELETE 요청을 보냅니다.
            fetch(`https://schooltalks.maxworld7070.net/study/${postId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            })
            .then(response => {
                if (response.status === 200) {
                    window.location.href = 'study-index.html';
                } else {
                    // 삭제 실패 또는 오류 발생한 경우
                    alert('게시물을 삭제할 수 없습니다.');

                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.location.reload();            });
        }
    });
});
