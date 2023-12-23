const title = document.querySelector(".title");
const author = document.querySelector(".author");
const date = document.querySelector(".date");
const hits = document.querySelector(".hits");
const like = document.querySelector(".like");
const content = document.querySelector(".content");
const btnLike = document.querySelector(".btn-like");
const commentList = document.querySelector(".comment-list");
const commentForm = document.querySelector(".comment-form");
const btnModify = document.querySelector(".btn-modify");
const btnDelete = document.querySelector(".btn-delete");
const userId = localStorage.getItem("user_id");
const postDomain = baseDomain + "post/";

// 게시글 id 가져오기
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get("post_id");

document.addEventListener("DOMContentLoaded", function () {
    tokencheck();
    const token = localStorage.getItem("access_token");
    const url = `${postDomain}${post_id}/`;
    if (token) {
        const header = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        loadPost(url, header);
        loadCommentForm(token);
    } else {
        const header = {
            "Content-Type": "application/json",
        };
        loadPost(url, header);
    }
});

// 게시글 불러오기
async function loadPost(url, header) {
    const response = await fetch(url, {
        method: "GET",
        headers: header,
    });
    const data = await response.json();

    title.innerHTML = data.title;
    author.innerHTML = data.author_name;
    date.innerHTML = formattedDate(data.created_at);
    hits.innerHTML = data.hits;
    like.innerHTML = data.likecount;
    content.innerHTML = data.content;

    if (data.is_like) {
        btnLike.classList.add("active");
    }

    data.comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.className = "comment-item";
        commentItem.innerHTML = `
        <div class="comment-author">${comment.author}</div>
        <div class="comment-content">${comment.content}</div>
        <div class="comment-date">
            ${formattedDate(comment.created_at)}
        </div>
        <div class="comment-setting">
            ${
                comment.author == userId
                    ? `
                <span class="btn-comment-modify" id="comment-modify-${comment.id}"></span>
                <span class="btn-comment-delete" id="comment-delete-${comment.id}"></span>
                `
                    : `
                <span style="width: 1.2rem; height: 1.2rem;"></span>
                <span style="width: 1.2rem; height: 1.2rem;"></span>
                `
            }
        </div>
        `;
        commentList.appendChild(commentItem);
        commentModify();
        commentDelete();
    });
    onModifyRemoveBtn(data.author);
}

function formattedDate(date) {
    const dateObject = new Date(date);
    const formattedDate = `
    ${dateObject.getFullYear()} -
    ${dateObject.getMonth() + 1} -
    ${dateObject.getDate()}
    `;
    return formattedDate;
}

function loadCommentForm(header, user_name) {
    commentForm.innerHTML += `
    <form class="comment-form">
        <div class="comment-author">${localStorage.getItem("view_name")}</div>
        <textarea class="form-control comment-content" name="content" placeholder="댓글을 입력하세요."></textarea>
        <button class="btn btn-primary btn-sm comment-submit">댓글 작성</button>
    </form>
    `;
    const commentSubmit = document.querySelector(".comment-submit");
    commentSubmit.addEventListener("click", submitComment);
}

async function submitComment(e) {
    e.preventDefault();
    const content = document.querySelector(
        ".comment-form > .comment-content"
    ).value;
    const data = {
        content: content,
    };
    const response = await fetch(`${postDomain}${post_id}/comment/create`, {
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
            window.location.reload();
        }
    });
}

// 수정, 삭제 버튼 활성화
// 로그인한 사용자와 게시글 작성자가 같을 경우에만 활성화

function onModifyRemoveBtn(author_id) {
    const user_id = localStorage.getItem("user_id");
    if (user_id == author_id) {
        btnModify.classList.remove("d-none");
        btnDelete.classList.remove("d-none");
    }
}

// 수정, 삭제 버튼

btnModify.addEventListener("click", () => {
    window.location.href = `/post/edit.html?post_id=${post_id}`;
});

btnDelete.addEventListener("click", () => {
    const deleteConfirm = confirm("정말 삭제하시겠습니까?");
    if (deleteConfirm) {
        fetch(`${postDomain}${post_id}/`, {
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
