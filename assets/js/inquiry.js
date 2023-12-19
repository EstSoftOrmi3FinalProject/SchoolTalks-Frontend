    // reCAPTCHA 로드 후 호출되는 함수
    function onSubmit(token) {
        // reCAPTCHA가 확인되면 폼 데이터를 전송합니다.
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const content = document.getElementById("content").value;

        const data = {
            email: email,
            subject: subject,
            content: content
        };

        fetch('http://127.0.0.1:8000/qna/inquiry/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert("문의가 정상적으로 접수되었습니다.");
            document.getElementById("inquiryForm").reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("문의 접수 중 문제가 발생했습니다.");
        });
    }

    document.getElementById("inquiryForm").addEventListener("submit", function(event) {
        // reCAPTCHA 체크 상태 확인
        var captchaResponse = grecaptcha.getResponse();

        if (captchaResponse.length === 0) {
            // 로봇이 아닙니다 체크가 되지 않았으므로 메시지를 표시하고, 제출을 막습니다.
            alert("로봇이 아닙니다 체크를 하셔야 합니다.");
            event.preventDefault();
        }
    });