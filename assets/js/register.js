const accountsDomain = baseDomain + "/accounts";

document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("username", document.getElementById("username").value);
        formData.append("password", document.getElementById("password").value);
        formData.append("nickname", document.getElementById("nickname").value);
        formData.append(
            "school_name",
            document.getElementById("school_name").value
        );
        formData.append("name", document.getElementById("name").value);
        formData.append(
            "grade",
            parseInt(document.getElementById("grade").value)
        );
        formData.append("about_me", document.getElementById("about_me").value);
        formData.append(
            "profile_picture",
            document.getElementById("profile_picture").files[0]
        );

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
                } else {
                    alert("회원 가입 실패");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Signup failed");
            });
    });
