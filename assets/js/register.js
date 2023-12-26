localStorage.getItem("access_token")
if (localStorage.getItem("access_token")) {
    alert("이미 로그인 되어있습니다.");
    window.location.href = "/";
}

const username = document.getElementById("username");
const password = document.getElementById("password");
const password_check = document.getElementById("password_check");
const message = document.getElementById("message");
const nickname = document.getElementById("nickname");
const school_name = document.getElementById("school_name");
const get_name = document.getElementById("name");
const grade = document.getElementById("grade");
const about_me = document.getElementById("about_me");
const profile_picture = document.getElementById("profile_picture");

function checkPasswordMatch() {
    if (password.value !== "" && password_check.value !== "") {
        if (password.value === password_check.value) {
            message.innerHTML = "비밀번호와 동일합니다.";
            message.style.color = "green";
        } else {
            message.innerHTML = "비밀번호와 다릅니다.";
            message.style.color = "red";
        }
    }
}

password.addEventListener("input", checkPasswordMatch);
password_check.addEventListener("input", checkPasswordMatch);

document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        if (password.value !== password_check.value) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        const formData = new FormData();
        formData.append("username", username.value);
        formData.append("password", password.value);
        formData.append("nickname", nickname.value);
        formData.append("school_name", school_name.value);
        formData.append("name", get_name.value);
        formData.append("grade", parseInt(grade.value));
        formData.append("about_me", about_me.value);
        formData.append("profile_picture", profile_picture.files[0]);

        fetch(`${accountsDomain}signup/`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const isUsernamePresent = !!data.username; // 임시 변수에 저장
                delete data.username; // data 객체에서 username 삭제
                if (isUsernamePresent) {
                    alert("회원 가입 성공");
                    window.location.href = "/login";
                } else {
                    alert("회원 가입 실패");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Signup failed");
            });
    });
