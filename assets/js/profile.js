document.addEventListener("DOMContentLoaded", function () {
    // 로컬 스토리지에서 액세스 토큰을 가져옵니다.
    var accessToken = localStorage.getItem("access_token");

    // 액세스 토큰이 있는지 확인합니다.
    if (accessToken) {
        // API 엔드포인트 URL

        // API 요청 보내기 (헤더에 액세스 토큰 추가)
        fetch(`${accountsDomain}user/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken, // 액세스 토큰을 헤더에 추가
            },
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("API 오류");
            }
        })
        .then(function (data) {
            // API 응답을 처리하고 정보를 HTML에 출력
            document.getElementById("nickname").textContent = data.nickname;
            document.getElementById("school").textContent = data.school_name;
            document.getElementById("name").textContent = data.name;
            document.getElementById("grade").textContent = data.grade;
            document.getElementById("about-me").textContent = data.about_me;

            // 프로필 사진이 비어있지 않으면 설정하고, 비어있으면 기본 이미지 사용
            if (data.profile_picture) {
                document.getElementById("profile-picture").src = data.profile_picture;
            } else {
                document.getElementById("profile-picture").src = "/assets/images/profile/basic.png";
            }
        })
        .catch(function (error) {
            console.error("API 오류:", error);
        });
    } else {
        // 액세스 토큰이 없는 경우에 대한 처리를 여기에 추가합니다.
        alert("로그인이 필요합니다."); // 예를 들어 로그인 페이지로 리디렉션 또는 경고 메시지 출력
    }
});

