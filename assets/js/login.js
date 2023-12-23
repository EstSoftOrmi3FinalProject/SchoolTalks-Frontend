sessionStorage.setItem("previousPage", document.referrer);
const loginForm = document.getElementById("loginForm");
const accountsDomain = baseDomain + "accounts/";

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${accountsDomain}token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.access) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                //사용자 정보를 가져와서 로컬스토리지에 저장
                getuser(data.access);
                // 이전 페이지 URL을 가져와서 리다이렉트
                const previousPage = sessionStorage.getItem("previousPage");
                if (previousPage) {
                    window.location.href = previousPage;
                } else {
                    // 이전 페이지 정보가 없을 경우 기본 페이지로 리다이렉트
                    window.location.href = "/";
                }
            } else {
                alert("아이디 또는 패스워드가 일치하지 않습니다.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

function getuser(token) {
    fetch(`${accountsDomain}user/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("view_name", data.view_name);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
