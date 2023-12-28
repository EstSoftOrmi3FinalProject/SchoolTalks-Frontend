const studyDomain = baseDomain + "study/";

// URL에서 게시물 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

// 게시물 상세 정보를 불러오는 함수
function fetchPostDetail() {
    const accessToken = localStorage.getItem("access_token");

    fetch(`${studyDomain}${postId}/`, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            displayPost(data);
            checkLikeStatus(data); // 좋아요 상태 확인 함수 호출
        })
        .catch((error) => console.error("Error:", error));
}

// 게시물을 화면에 표시하는 함수
function displayPost(post) {
    const postContainer = document.getElementById("postContainer");
    const commentsContainer = document.getElementById("commentsContainer");

    postContainer.innerHTML = `
        <h2>🎈${post.title}</h2>
        <p>😉작성자: ${post.author_username}</p>
        <p>📅작성일: ${formatDate(post.created_at)}</p>
        <p>🧨조회수: ${post.views || 0}</p>
        <p id="likesCount">${post.likesCount || 0}</p>
        <p>💌${post.caption.replace(/\n/g, "<br>")}</p>
        ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
        ${
            post.attachment
                ? `<p><a href="${post.attachment}" download>첨부파일 다운로드</a></p>`
                : ""
        }
    `;
}

// 댓글 정보를 불러오는 함수
function fetchCommentDetail() {
    const accessToken = localStorage.getItem("access_token");

    // 댓글 정보 요청
    fetch(`${studyDomain}${postId}/comments/`, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    })
        .then((response) => response.json())
        .then((comments) => {
            displayComments(comments); // 댓글 정보 표시
        })
        .catch((error) => console.error("Error:", error));
}

// 댓글을 화면에 표시하는 함수
function displayComments(comments) {
    const commentsContainer = document.getElementById("commentsContainer");
    const commentsHTML = `<h3>댓글</h3><br>${
        comments && comments.length > 0
            ? comments
                  .map(
                      (comment) => `
        <div class="comment">
            <strong>😀작성자:${comment.author_username}</strong>: ${comment.text}
            <button class="editCommentButton" data-comment-id="${comment.id}">수정</button>
            <button class="deleteCommentButton" data-comment-id="${comment.id}">삭제</button>
        </div>
        <br>
    `
                  )
                  .join("")
            : "댓글이 없습니다."
    }`;

    commentsContainer.innerHTML = commentsHTML;
}

// 페이지 로드 시 댓글 정보를 요청
window.addEventListener("load", function () {
    fetchCommentDetail();
});

// 날짜와 시간만 포맷하는 함수
function formatDate(isoDate) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(isoDate).toLocaleString("en-US", options);
}

// 예시 날짜
const exampleDate = "2023-12-17T14:26:27.789221+09:00";
console.log(formatDate(exampleDate)); // 날짜와 시간이 표시됩니다.

// 댓글 작성 이벤트 리스너
document
    .getElementById("commentForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const commentText = document.getElementById("commentText").value;
        const accessToken = localStorage.getItem("access_token");
        // 댓글 작성 관련 API 요청 로직
        // POST: posts/posts/comments/
        // post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
        // author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
        // text = models.TextField()
        // created_at = models.DateTimeField(auto_now_add=True)
        fetch(`${studyDomain}comments/`, {
            method: "POST", // 좋아요 설정 또는 해제를 위한 POST 요청
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post: postId,
                text: commentText,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("댓글 작성 중 오류가 발생했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("댓글 작성됨:", data);
                // 댓글 작성 후 UI 업데이트 로직 (예: 댓글 목록 갱신)
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("댓글 작성 실패");
            });
    });

// 페이지 로드 시 게시물 상세 정보를 불러옵니다
if (postId) {
    fetchPostDetail();
} else {
    console.error("URL 주소가 잘못되었습니다.");
}

// 수정 버튼 클릭 이벤트 리스너
document
    .getElementById("editPostButton")
    .addEventListener("click", function () {
        if (postId) {
            const editPostUrl = `edit-post.html?postId=${postId}`;
            window.location.href = editPostUrl;
        }
    });

//추가

// 댓글 수정 버튼 클릭 이벤트 리스너
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("editCommentButton")) {
        const commentId = event.target.getAttribute("data-comment-id");
        const newCommentText = prompt("댓글을 수정하세요:");
        if (newCommentText !== null) {
            updateComment(commentId, newCommentText);
        }
    }
});

// 댓글 삭제 버튼 클릭 이벤트 리스너
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteCommentButton")) {
        const commentId = event.target.getAttribute("data-comment-id");
        if (confirm("댓글을 삭제하시겠습니까?")) {
            deleteComment(commentId);
        }
    }
});

// 댓글 수정 함수
function updateComment(commentId, newCommentText) {
    const accessToken = localStorage.getItem("access_token");
    fetch(`${studyDomain}comments/${commentId}/`, {
        method: "PATCH", // 댓글 수정을 위한 PATCH 요청
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: newCommentText,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("댓글 수정 중 오류가 발생했습니다.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("댓글 수정됨:", data);
            // 댓글 수정 후 UI 업데이트 로직 (예: 댓글 목록 다시 불러오기)
            fetchCommentDetail();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("댓글 수정 실패");
        });
}

// 댓글 삭제 함수
function deleteComment(commentId) {
    const accessToken = localStorage.getItem("access_token");
    fetch(`${studyDomain}comments/${commentId}/`, {
        method: "DELETE", // 댓글 삭제를 위한 DELETE 요청
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    })
        .then((response) => {
            if (response.status === 204) {
                console.log("댓글 삭제됨:", data);
                // 댓글 삭제 후 UI 업데이트 로직 (예: 댓글 목록 다시 불러오기)
                fetchCommentDetail();

                // 페이지 새로고침
                window.location.reload();
            }
            return response.json();
        })
        .then((data) => {})
        .catch((error) => {
            console.error("Error:", error);
            window.location.reload();
        });
}
