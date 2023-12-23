// 댓글 삭제 버튼

function commentDelete() {
    document.querySelectorAll(".btn-comment-delete").forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.id;
            const commentId = id.split("-")[2];
            const deleteConfirm = confirm("정말 삭제하시겠습니까?");
            if (deleteConfirm) {
                const response = await fetch(
                    `${postDomain}${post_id}/comment/${commentId}/delete`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                );
                switch (response.status) {
                    case 401:
                        alert("로그인이 필요합니다.");
                        break;
                    case 204:
                        alert("삭제되었습니다.");
                        window.location.reload();
                        break;
                    default:
                        alert("오류가 발생했습니다.");
                        break;
                }
            }
        });
    });
}

// 댓글 수정 버튼

function commentModify() {
    const btnCommentModify = document.querySelectorAll(".btn-comment-modify");
    btnCommentModify.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.id;
            const commentId = id.split("-")[2];
            const commentItem = document.querySelector(
                `#comment-modify-${commentId}`
            ).parentNode.parentNode;
            const commentContent = document
                .querySelector(`#comment-modify-${commentId}`)
                .parentNode.parentNode.querySelector(".comment-content");
            const commentModifyForm = document.createElement("div");
            commentModifyForm.innerHTML += `
            <form class="comment-form">
                <div class="comment-author">
                    ${localStorage.getItem("view_name")}
                </div>
                <textarea class="form-control comment-content" name="content" placeholder="댓글을 입력하세요.">${
                    commentContent.innerHTML
                }</textarea>
                <button class="btn btn-primary comment-edit-submit">댓글 수정</button>
            </form>
            `;
            commentItem.innerHTML = "";
            commentItem.appendChild(commentModifyForm);
        });
    });

    const btnCommentModifySubmit = document.querySelector(
        ".comment-edit-submit"
    );
    btnCommentModifySubmit.addEventListener("click", (e) => {
        e.preventDefault();
        confirm("정말 수정하시겠습니까?");
        if (confirm) {
            tokencheck();
            const token = localStorage.getItem("access_token");
            const fetchUrl = `${postDomain}${post_id}/comment/${commentId}/update`;
            const fetchHeader = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            commentModifySubmit(fetchUrl, fetchHeader);
        }
    });
}

async function commentModifySubmit(fetchUrl, fetchHeader) {
    const content = document.querySelector(
        ".comment-form > .comment-content"
    ).value;
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
            window.location.reload();
            break;
        default:
            alert("오류가 발생했습니다.");
            break;
    }
}
