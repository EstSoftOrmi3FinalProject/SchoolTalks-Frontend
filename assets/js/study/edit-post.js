document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');

    // URL에서 pk(게시물의 Primary Key)를 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    // pk가 유효한 경우, 해당 게시물 정보를 가져옵니다.
    if (postId) {
        fetch(`${studyDomain}${postId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('게시물 정보를 가져오는 중 오류가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => {
            // 게시물 정보를 사용하여 폼 필드를 채웁니다.
            document.getElementById('postTitle').value = data.title;
            document.getElementById('postCaption').value = data.caption;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('게시물 정보를 가져오는 중 오류가 발생했습니다.');
        });
    }

    // 게시물 수정 폼 제출 이벤트 리스너
    document.getElementById('editPostForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // 수정 폼에서 변경된 정보를 가져옵니다.
        const editedTitle = document.getElementById('postTitle').value;
        const editedCaption = document.getElementById('postCaption').value;

        // 서버에 전송할 JSON 데이터를 생성합니다.
        const jsonData = {
            "title": editedTitle,
            "caption": editedCaption
        };

        // 이미지와 첨부 파일 input 요소 가져오기
        const imageInput = document.getElementById('postImage');
        const attachmentInput = document.getElementById('postAttachment');

        // 이미지와 첨부 파일이 선택된 경우 FormData에 추가합니다.
        if (imageInput.files.length > 0) {
            jsonData["image"] = imageInput.files[0];
        }

        if (attachmentInput.files.length > 0) {
            jsonData["attachment"] = attachmentInput.files[0];
        }

        // 서버에 수정된 게시물 정보를 전송합니다.
        fetch(`${studyDomain}${postId}/update/`, {
            method: 'PATCH', // 'PATCH' 요청을 사용하여 일부 필드만 수정합니다.
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                // 서버로 JSON 데이터를 전송한다고 명시합니다.
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData) // JSON 데이터를 문자열로 변환하여 전송합니다.
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('게시물 수정 중 오류가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log('게시물이 성공적으로 수정되었습니다:', data);
            // 수정 후 해당 게시물로 이동
            window.location.href = `post.html?postId=${postId}`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('게시물 수정 실패');
        });
    });
});
