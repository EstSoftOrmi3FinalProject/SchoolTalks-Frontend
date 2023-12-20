// $(document).ready(function() {
//     // 로컬 스토리지에서 액세스 토큰을 가져옵니다.
//     var accessToken = localStorage.getItem("access_token");

//     // 액세스 토큰이 있는지 확인합니다.
//     if (accessToken) {
//         // API 엔드포인트 URL
//         var apiUrl = "http://127.0.0.1:8000/accounts/user/"; // 사용자 ID를 적절히 수정해주세요.

//         // API 요청 보내기 (헤더에 액세스 토큰 추가)
//         $.ajax({
//             url: apiUrl,
//             type: "GET",
//             dataType: "json",
//             headers: {
//                 "Authorization": "Bearer " + accessToken // 액세스 토큰을 헤더에 추가
//             },
//             success: function(data) {
//                 // API 응답을 처리하고 정보를 HTML에 출력
//                 $("#nickname").text(data.nickname);
//                 $("#school").text(data.school_name);
//                 $("#name").text(data.name);
//                 $("#grade").text(data.grade);
//                 $("#about-me").text(data.about_me);
//                 $("#profile-picture").attr("src", data.profile_picture);
//             },
//             error: function(xhr, textStatus, errorThrown) {
//                 console.error("API 오류:", textStatus, errorThrown);
//             }
//         });
//     } else {
//         // 액세스 토큰이 없는 경우에 대한 처리를 여기에 추가합니다.
//         alert("로그인이 필요합니다."); // 예를 들어 로그인 페이지로 리디렉션 또는 경고 메시지 출력
//     }
// });
$(document).ready(function() {
    // 로컬 스토리지에서 액세스 토큰을 가져옵니다.
    var accessToken = localStorage.getItem("access_token");

    // 액세스 토큰이 있는지 확인합니다.
    if (accessToken) {
        // API 엔드포인트 URL
        var apiUrl = "http://127.0.0.1:8000/accounts/user/"; // 사용자 ID를 적절히 수정해주세요.

        // API 요청 보내기 (헤더에 액세스 토큰 추가)
        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken // 액세스 토큰을 헤더에 추가
            },
            success: function(data) {
                // API 응답을 처리하고 정보를 HTML에 출력
                $("#nickname").text(data.nickname);
                $("#school").text(data.school_name);
                $("#name").text(data.name);
                $("#grade").text(data.grade);
                $("#about-me").text(data.about_me);

                // 프로필 사진이 비어있지 않으면 설정하고, 비어있으면 기본 이미지 사용
                if (data.profile_picture) {
                    $("#profile-picture").attr("src", data.profile_picture);
                } else {
                    $("#profile-picture").attr("src", "/assets/images/profile/basic.png");
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error("API 오류:", textStatus, errorThrown);
            }
        });
    } else {
        // 액세스 토큰이 없는 경우에 대한 처리를 여기에 추가합니다.
        alert("로그인이 필요합니다."); // 예를 들어 로그인 페이지로 리디렉션 또는 경고 메시지 출력
    }
});