document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');

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
});

document.getElementById('createPostForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    const formData = new FormData();
    const title = document.getElementById('title').value;
    const caption = document.getElementById('caption').value;
    const image = document.getElementById('image').files[0];
    const attachment = document.getElementById('attachment').files[0]; // 추가된 필드에서 첨부파일 가져오기

    formData.append('title', title); // API 요청 본문에 제목 추가
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('attachment', attachment); // API 요청 본문에 첨부파일 추가

    fetch('http://127.0.0.1:8000/posts/create/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Post creation failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Post created:', data);
        // 성공적으로 게시물이 생성된 후의 처리 로직
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});