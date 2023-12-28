// const studyDomain = baseDomain + "study/";

// 좋아요 상태를 추적하여 UI를 업데이트하는 코드 시작
let isLiked = false; // 좋아요 상태를 추적하는 변수 초기화
const likeButton = document.getElementById("likeButton");

function checkLikeStatus(postData) {
    // 서버에서 제공하는 좋아요 상태 정보를 기반으로 isLiked 변수 설정
    // 예: 서버에서 postData에 isLiked 정보를 포함하여 반환한다고 가정
    isLiked = postData.isLiked;
    updateLikeButton(); // 좋아요 버튼 UI 업데이트 함수 호출
}

// 좋아요 버튼 UI 업데이트 함수
function updateLikeButton() {
    // 좋아요 상태에 따라 버튼 스타일 변경
    if (isLiked) {
        likeButton.classList.add("active");
    } else {
        likeButton.classList.remove("active");
    }
}

// 좋아요 버튼 클릭 이벤트 리스너

likeButton.addEventListener("click", async function () {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    const method = isLiked ? "DELETE" : "POST";
    const response = await fetch(`${studyDomain}${postId}/like/`, {
        method: method, // 좋아요 설정 또는 해제를 위한 요청
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("좋아요 처리 중 오류가 발생했습니다.");
    }
    switch (method) {
        case "POST":
            likeButton.classList.add("active");
            isLiked = true;
            break;
        case "DELETE":
            likeButton.classList.remove("active");
            isLiked = false;
            break;
        default:
            throw new Error("요청 메서드가 잘못되었습니다.");
    }
    const data = await response.json();
    document.getElementById("likesCount").innerHTML = data.likesCount;
});
