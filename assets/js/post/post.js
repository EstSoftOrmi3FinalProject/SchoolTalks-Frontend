const title = document.querySelector(".title");
const author = document.querySelector(".author");
const date = document.querySelector(".date");
const hits = document.querySelector(".hits");
const like = document.querySelector(".like");
const content = document.querySelector(".content");
const btnLike = document.querySelector(".btn-like");
const btnModify = document.querySelector(".btn-modify");
const btnDelete = document.querySelector(".btn-delete");
const postDomain = baseDomain + "post/";

document.addEventListener("DOMContentLoaded", function () {
    tokencheck();
    const token = localStorage.getItem("access_token");
    const url = `${postDomain}${postId}/`;
    if (token) {
        const header = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        loadPost(url, header);
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
    window.location.href = `/post/edit.html?post_id=${postId}`;
});

btnDelete.addEventListener("click", () => {
    const deleteConfirm = confirm("정말 삭제하시겠습니까?");
    if (deleteConfirm) {
        fetch(`${postDomain}${postId}/`, {
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
