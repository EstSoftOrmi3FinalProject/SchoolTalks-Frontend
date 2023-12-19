const title = document.querySelector(".title");
const author = document.querySelector(".author");
const date = document.querySelector(".date");
const hits = document.querySelector(".hits");
const like = document.querySelector(".like");
const content = document.querySelector(".content");
const btnLike = document.querySelector(".btn-like");
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get("post_id");
const commentList = document.querySelector(".comment-list");
const commentForm = document.querySelector(".comment-form");
const btnModify = document.querySelector(".btn-modify");
const btnDelete = document.querySelector(".btn-delete");

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("access_token");
    if (token) {
        const header = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        loadPost(header);
        loadCommentForm(token);
    } else {
        const header = {
            "Content-Type": "application/json",
        };
        loadPost(header);
    }
});

function loadPost(header) {
    fetch(`http://127.0.0.1:8000/post/${post_id}`, {
        method: "GET",
        headers: header,
    })
        .then((res) => res.json())
        .then((data) => {
            const dateObject = new Date(data.created_at);
            const formattedDate = `
            ${dateObject.getFullYear()} -
            ${dateObject.getMonth() + 1} -
            ${dateObject.getDate()}
            `;
            title.innerHTML = data.title;
            author.innerHTML = data.author_name;
            date.innerHTML = formattedDate;
            hits.innerHTML = data.hits;
            like.innerHTML = data.likecount;
            content.innerHTML = data.content;
            if (data.is_like) {
                btnLike.classList.add("active");
            }
            data.comments.forEach((comment) => {
                const commentItem = document.createElement("li");
                const dateObject = new Date(comment.created_at);
                const formattedDate = `
                ${dateObject.getFullYear()} -
                ${dateObject.getMonth() + 1} -
                ${dateObject.getDate()}
                `;
                commentItem.innerHTML = `
                <div class="comment-item">
                    <div class="comment-author">${comment.author_name}</div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="comment-date">${formattedDate}</div>
                </div>
                `;
                commentList.appendChild(commentItem);
            });
        });
}

function loadCommentForm(header, user_name) {
    commentForm.innerHTML += `
    <form class="comment-form">
        <div class="comment-author">댓글</div>
        <textarea class="form-control comment-content" name="content" placeholder="댓글을 입력하세요."></textarea>
        <button class="btn btn-primary btn-sm comment-submit">댓글 작성</button>
    </form>
    `;
    submitComment();
}

function submitComment() {
    const commentSubmit = document.querySelector(".comment-submit");
    commentSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        const content = document.querySelector(
            ".comment-form > .comment-content"
        ).value;
        const data = {
            content: content,
        };
        fetch(`http://127.0.0.1:8000/post/${post_id}/comment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(data),
        }).then((res) => {
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
            }
            if (res.status === 201) {
                alert("댓글이 작성되었습니다.");
                // window.location.reload();
            }
        });
    });
}

// 좋아요가 이미 눌려있는지 확인하고 눌려있으면 active 클래스 추가
// 좋아요가 눌려있지 않으면 active 클래스 제거

btnLike.addEventListener("click", () => {
    if (btnLike.classList.contains("active")) {
        likeoff(post_id);
    } else {
        likeon(post_id);
    }
});

function likeon(post_id) {
    fetch(`http://127.0.0.1:8000/post/${post_id}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    })
        .then((res) => {
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
            }
            if (res.status === 201) {
                btnLike.classList.add("active");
            }
            if (res.status === 409) {
                btnLike.classList.add("active");
            }
            return res.json();
        })
        .then((data) => {
            like.innerHTML = data.likecount;
        });
}

function likeoff(post_id) {
    fetch(`http://127.0.0.1:8000/post/${post_id}/like`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    })
        .then((res) => {
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
            }
            if (res.status === 200) {
                btnLike.classList.remove("active");
            }
            return res.json();
        })
        .then((data) => {
            like.innerHTML = data.likecount;
        });
}

// 수정, 삭제 버튼

btnModify.addEventListener("click", () => {
    window.location.href = `/post/edit.html?post_id=${post_id}`;
});

btnDelete.addEventListener("click", () => {
    const deleteConfirm = confirm("정말 삭제하시겠습니까?");
    if (deleteConfirm) {
        fetch(`http://127.0.0.1:8000/post/${post_id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }).then((res) => {
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
            }
            if (res.status === 204) {
                alert("삭제되었습니다.");
                window.location.href = "/post";
            }
        });
    }
});
