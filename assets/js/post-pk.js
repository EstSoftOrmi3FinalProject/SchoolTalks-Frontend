
document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id'); // 현재 사용자 ID
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId'); // URL에서 게시물 ID 추출

    // 로그인된 경우, 로그아웃 버튼과 게시물 관련 버튼을 표시
    if (accessToken) {
        document.querySelector('.loginfield').innerHTML = `
            <button id="logoutButton">Logout</button>
            <button id="createpost">Create</button>
            <button id="profile">Profile</button>
        `;
    }

    // 로그아웃 버튼 클릭 이벤트 리스너
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = 'login.html'; // 로그인 페이지로 리디렉트
    });

    // 게시물 생성 버튼 클릭 이벤트 리스너
    document.getElementById('createpost').addEventListener('click', function() {
        window.location.href = 'create-post.html';
    });

    // 프로필 버튼 클릭 이벤트 리스너
    document.getElementById('profile').addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

    // 게시물 상세 정보를 불러오는 함수
    function fetchPostDetail() {
        fetch(`http://127.0.0.1:8000/study/${postId}/`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayPost(data);
            checkLikeStatus(data);
            if (userId && data.author.id === parseInt(userId)) {
                document.getElementById('editPostButton').style.display = 'block';
                document.getElementById('deletePostButton').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // 페이지 로드 시 게시물 상세 정보를 불러옵니다
    if (postId) {
        fetchPostDetail();
    } else {
        console.error('URL 주소가 잘못되었습니다.');
    }

    // 수정 버튼 클릭 이벤트 리스너
    document.getElementById('editPostButton').addEventListener('click', function() {
        if (postId) {
            const editPostUrl = `edit-post.html?postId=${postId}`;
            window.location.href = editPostUrl;
        }
    }); 

    // 삭제 버튼 클릭 이벤트 리스너
     // 삭제 버튼 클릭 이벤트 리스너
     document.getElementById('deletePostButton').addEventListener('click', function() {
        if (postId) {
            const confirmDelete = confirm('정말로 이 게시물을 삭제하시겠습니까?');
            if (confirmDelete) {
                fetch(`http://127.0.0.1:8000/study/${postId}/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('게시물이 삭제되었습니다.');
                        window.location.href = 'https://127.0.0.1:5500/SchoolTalks_FE/cover'; // 게시물 삭제 후 리디렉션할 페이지
                    } else {
                     throw new Error('게시물 삭제 중 오류가 발생했습니다.');
                }
                })
            }
        }
    });

    // 좋아요 버튼 클릭 이벤트 리스너
    document.getElementById('likeButton').addEventListener('click', function() {
        if (postId) {
            const method = isLiked ? 'DELETE' : 'POST';
            fetch(`http://127.0.0.1:8000/study/${postId}/like/`, {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('좋아요 처리 중 오류가 발생했습니다.');
                }
                return response.json();
            })
            .then(data => {
                isLiked = !isLiked; // 좋아요 상태 반전
                updateLikeButton();
                console.log('좋아요 상태 변경됨:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('좋아요 처리 실패');
            });
        }
    });

    // 댓글 작성 이벤트 리스너
    document.getElementById('commentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;
        if (postId) {
            fetch(`http://127.0.0.1:8000/study/${postId}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'post': postId,
                    'text': commentText
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('댓글 작성 중 오류가 발생했습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('댓글 작성됨:', data);
                // 댓글 작성 후 UI 업데이트 로직 (예: 댓글 목록 갱신)
            })
            .catch(error => {
                console.error('Error:', error);
                alert('댓글 작성 실패');
            });
        }
    });

    // 좋아요 상태를 추적하여 UI를 업데이트하는 코드 시작
    let isLiked = false;  // 좋아요 상태를 추적하는 변수 초기화

    function checkLikeStatus(postData) {
        isLiked = postData.isLiked || false; // 서버에서 받은 좋아요 상태 정보
        updateLikeButton();
    }

    // 좋아요 버튼 UI 업데이트 함수
    function updateLikeButton() {
        const likeButton = document.getElementById('likeButton');
        likeButton.textContent = isLiked ? '좋아요 취소' : '좋아요';
    }

    // 게시물을 화면에 표시하는 함수
    function displayPost(post) {
        const postContainer = document.getElementById('postContainer');
        const commentsContainer = document.getElementById('commentsContainer');

        postContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>작성일: ${formatDate(post.created_at)}</p>
            <p>작성자: ${post.author_username}</p>
            <p>조회수: ${post.views || 0}</p>
            ${post.attachment ? `<p><a href="${post.attachment}" download>첨부파일 다운로드</a></p>` : ''}
            <img src="${post.image}" alt="Post image">
            <p>${post.caption}</p>

            <p>좋아요: ${post.likesCount || 0}개</p>
        `;
        commentsContainer.innerHTML = `
            <h3>댓글</h3>
            ${post.comments ? post.comments.map(comment => `
                <div class="comment">
                    <strong>${comment.author_username}</strong>: ${comment.text}
                </div>
            `).join('') : ''}
        `;
    }

    // 날짜 포맷 함수
    function formatDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoDate).toLocaleDateString('en-US', options);
    }

    // 좋아요 상태 확인 함수 호출
    if (postId) {
        fetchPostDetail();
    }
});