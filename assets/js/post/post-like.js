// 좋아요가 이미 눌려있는지 확인하고 눌려있으면 active 클래스 추가
// 좋아요가 눌려있지 않으면 active 클래스 제거

btnLike.addEventListener("click", () => {
    tokencheck();
    const fetchUrl = `${postDomain}${postId}/like/`;
    const fetchHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    if (btnLike.classList.contains("active")) {
        likeoff(fetchUrl, fetchHeader);
    } else {
        likeon(fetchUrl, fetchHeader);
    }
});

async function likeon(fetchUrl, fetchHeader) {
    const response = await fetch(fetchUrl, {
        method: "POST",
        headers: fetchHeader,
    });
    // ststus code에 따라 분기
    switch (response.status) {
        case 401:
            alert("로그인이 필요합니다.");
            break;
        case 409:
            alert("이미 좋아요를 누르셨습니다.");
            btnLike.classList.add("active");
            break;
        case 201:
            btnLike.classList.add("active");
            // 좋아요 개수를 가져와서 화면에 표시
            const data = await response.json();
            like.innerHTML = data.likecount;
            break;
    }
}

async function likeoff(fetchUrl, fetchHeader) {
    const response = await fetch(fetchUrl, {
        method: "DELETE",
        headers: fetchHeader,
    });
    // ststus code에 따라 분기
    switch (response.status) {
        case 401:
            alert("로그인이 필요합니다.");
            break;
        case 200:
            btnLike.classList.remove("active");
            // 좋아요 개수를 가져와서 화면에 표시
            const data = await response.json();
            like.innerHTML = data.likecount;
            break;
    }
}
