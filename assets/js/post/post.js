const title = document.querySelector(".title");
const author = document.querySelector(".author");
const date = document.querySelector(".date");
const hits = document.querySelector(".hits");
const like = document.querySelector(".like");
const content = document.querySelector(".content");
const btnLike = document.querySelector(".btn-like");

function loadpost() {
    const urlParams = new URLSearchParams(window.location.search);
    const post_id = urlParams.get("post_id");

    fetch(`http://127.0.0.1:8000/post/${post_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
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
            console.log(data.is_like);
            if (data.is_like) {
                btnLike.classList.add("active");
            }
            data.comments.forEach((comment) => {
                const commentList = document.querySelector(".comment-list");
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
loadpost();

btnLike.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const post_id = urlParams.get("post_id");
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
