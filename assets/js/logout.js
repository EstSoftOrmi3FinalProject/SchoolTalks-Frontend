function logout() {
    const accessToken = localStorage.getItem("access_token");

    // 로그인 상태를 확인하고 버튼을 토글합니다.
    if (accessToken) {
        // 사용자가 로그인한 경우
        document.getElementById("registerButton").style.display = "none";
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "block";
    } else {
        // 사용자가 로그아웃한 경우
        document.getElementById("registerButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "none";
        document.getElementById("loginButton").style.display = "block";
    }

    document
        .getElementById("logoutButton")
        .addEventListener("click", function (e) {
            // 로컬 스토리지에서 'username' 항목을 삭제합니다.
            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        });
}
