// 게시글 id 가져오기
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("post_id")) {
    sessionStorage.setItem("postId", urlParams.get("post_id"));
}
const postId = sessionStorage.getItem("postId");

function loadComment() {
    const url = `${postDomain}${postId}/comment/`;
    const header = {
        "Content-Type": "application/json",
    };
    fetchComment(url, header);
}
loadComment();

async function fetchComment(url, header) {
    const response = await fetch(url, {
        method: "GET",
        headers: header,
    });
    const data = await response.json();
    const userId = localStorage.getItem("user_id");
    const commentList = document.querySelector(".comment-list");
    commentList.innerHTML = "";

    data.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.className = "comment-item";
        commentItem.id = `comment-item-${comment.id}`;
        commentItem.innerHTML = `
        <div class="comment-author">${comment.author_name}</div>
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
    });
    const commentForm = document.createElement("li");
    commentForm.innerHTML += `
    <form class="comment-form">
        <div class="comment-author">${localStorage.getItem("view_name")}</div>
        <textarea class="form-control comment-form-content" name="content" placeholder="댓글을 입력하세요."></textarea>
        <button class="btn btn-primary btn-sm comment-submit">댓글 작성</button>
        <span style="width: 1.2rem; height: 1.2rem;"></span>
        <span style="width: 1.2rem; height: 1.2rem;"></span>
    </form>
    `;
    commentList.appendChild(commentForm);
    const commentSubmit = document.querySelector(".comment-submit");
    commentSubmit.addEventListener("click", submitComment);

    document.querySelectorAll(".btn-comment-modify").forEach((button) => {
        button.addEventListener("click", () => commentModify(button));
    });
    document.querySelectorAll(".btn-comment-delete").forEach((button) => {
        button.addEventListener("click", () => commentDelete(button));
    });
}

// 댓글 작성 버튼

async function submitComment(e) {
    e.preventDefault();
    const content = document.querySelector(".comment-form-content").value;
    const data = {
        content: content,
    };
    tokencheck();
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${postDomain}${postId}/comment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    switch (response.status) {
        case 401:
            alert("로그인이 필요합니다.");
            break;
        case 201:
            alert("댓글이 작성되었습니다.");
            loadComment();
            break;
        default:
            alert("오류가 발생했습니다.");
            break;
    }
}

// 댓글 삭제 버튼

async function commentDelete(button) {
    const deleteConfirm = confirm("정말 삭제하시겠습니까?");
    if (!deleteConfirm) {
        return;
    }
    tokencheck();
    const id = button.id;
    const commentId = id.split("-")[2];
    const token = localStorage.getItem("access_token");
    const fetchUrl = `${postDomain}${postId}/comment/${commentId}/`;
    const response = await fetch(fetchUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    switch (response.status) {
        case 401:
            alert("로그인이 필요합니다.");
            break;
        case 204:
            alert("삭제되었습니다.");
            loadComment();
            break;
        default:
            alert("오류가 발생했습니다.");
            break;
    }
}

// 댓글 수정 버튼

async function commentModify(button) {
    tokencheck();
    const id = button.id;
    const commentId = id.split("-")[2];
    const token = localStorage.getItem("access_token");
    const fetchUrl = `${postDomain}${postId}/comment/${commentId}/`;
    // 댓글 수정 버튼을 누르면 댓글 내용을 가져와서 수정 폼에 넣어줌
    const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    const commentItem = document.querySelector(`#comment-item-${commentId}`);
    commentItem.innerHTML = `
    <form class="comment-form">
        <div class="comment-author">${localStorage.getItem("view_name")}</div>
        <textarea class="form-control comment-form-content" name="content" placeholder="댓글을 입력하세요.">${
            data.content
        }</textarea>
        <button class="btn btn-primary btn-sm comment-edit-submit">댓글 수정</button>
    </form>
    `;
    const commentContent = document.querySelector(".comment-form-content");
    commentContent.focus();

    const btnCommentModifySubmit = document.querySelector(
        ".comment-edit-submit"
    );
    if (!btnCommentModifySubmit) {
        return;
    }
    btnCommentModifySubmit.addEventListener("click", (e) => {
        e.preventDefault();
        confirm("정말 수정하시겠습니까?");
        if (confirm) {
            tokencheck();
            const token = localStorage.getItem("access_token");
            const fetchUrl = `${postDomain}${postId}/comment/${commentId}/`;
            const fetchHeader = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            commentModifySubmit(fetchUrl, fetchHeader);
        }
    });
}

async function commentModifySubmit(fetchUrl, fetchHeader) {
    const content = document.querySelector(".comment-form-content").value;
    const data = {
        content: content,
    };
    const response = await fetch(fetchUrl, {
        method: "PATCH",
        headers: fetchHeader,
        body: JSON.stringify(data),
    });
    switch (response.status) {
        case 401:
            alert("로그인이 필요합니다.");
            break;
        case 200:
            alert("댓글이 수정되었습니다.");
            loadComment();
            break;
        default:
            alert("오류가 발생했습니다.");
            break;
    }
}
