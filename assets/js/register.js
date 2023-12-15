document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('password2', document.getElementById('password2').value);
    formData.append('nickname', document.getElementById('nickname').value);
    formData.append('school_name', document.getElementById('school_name').value);
    formData.append('name', document.getElementById('name').value);
    formData.append('grade', parseInt(document.getElementById('grade').value));
    formData.append('about_me', document.getElementById('about_me').value);
    formData.append('profile_picture', document.getElementById('profile_picture').files[0]);

    // 유효성 검증
    if (formData.get('password') !== formData.get('password2')) {
        alert('패스워드가 일치하지 않습니다.');
        return;
    }

    fetch('http://127.0.0.1:8000/accounts/signup/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.username) {
            // alert('Signup successful'); // alert가 있으면 href가 실행되지 않음
            window.location.href = 'login.html';
        } else {
            alert('Signup failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed');
    });
});
</script>