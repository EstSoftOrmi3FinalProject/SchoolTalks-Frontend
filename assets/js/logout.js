const accountsDomain = baseDomain + "accounts/";

function logout() {
    tokencheck();
    const accessToken = localStorage.getItem("access_token");

    // 로그인 상태를 확인하고 버튼을 토글합니다.
    if (accessToken) {
        // 사용자가 로그인한 경우
        document.getElementById("registerButton").style.display = "none";
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "block";
        document.getElementById("navprofile").style.display = "block";
    } else {
        // 사용자가 로그아웃한 경우
        document.getElementById("registerButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "none";
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("navprofile").style.display = "none";
    }

    document
        .getElementById("logoutButton")
        .addEventListener("click", function (e) {
            // 로컬 스토리지에서 'username' 항목을 삭제합니다.
            localStorage.removeItem("user_id");
            localStorage.removeItem("view_name");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        });
}

async function tokencheck() {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        const response = await fetch(`${accountsDomain}token/verify/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: accessToken,
            }),
        });
        switch (response.status) {
            case 200:
                break;
            case 401:
                refresh();
                break;
            default:
                localStorage.removeItem("user_id");
                localStorage.removeItem("view_name");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login.html";
        }
    }
}

async function refresh() {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await fetch(`${accountsDomain}token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });
    switch (response.status) {
        case 200:
            const data = await response.json();
            localStorage.setItem("access_token", data.access);
        case 401:
            localStorage.removeItem("user_id");
            localStorage.removeItem("view_name");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login.html";
    }
}
