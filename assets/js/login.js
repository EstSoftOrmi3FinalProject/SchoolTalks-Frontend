sessionStorage.setItem('previousPage', document.referrer);

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/accounts/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
// 이전 페이지 URL을 가져와서 리다이렉트
const previousPage = sessionStorage.getItem('previousPage');
if (previousPage) {
window.location.href = previousPage;
} else {
// 이전 페이지 정보가 없을 경우 기본 페이지로 리다이렉트
window.location.href = 'cover.html';
}
        } else {
            alert('아이디 또는 패스워드가 일치하지 않습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});