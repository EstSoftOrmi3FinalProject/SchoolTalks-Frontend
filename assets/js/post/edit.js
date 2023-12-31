const postSubmit = document.querySelector("#post-submit");
const postDomain = baseDomain + "post/";

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("post_id");

document.addEventListener("DOMContentLoaded", function () {
    tokencheck();
    const token = localStorage.getItem("access_token");
    fetch(`${postDomain}${postId}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            document.querySelector("#post-title").value = data.title;
            document.querySelector("#post-content").value = data.content;
        });
});

postSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    const postTitle = document.querySelector("#post-title").value;
    const postContent = document.querySelector("#post-content").value;

    const post = {
        title: postTitle,
        content: postContent,
    };
    fetch(`${postDomain}${postId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(post),
    })
        .then((res) => {
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
            }
            if (res.status === 200) {
                alert("게시글이 수정되었습니다.");
                window.location.href = `/post/post.html?post_id=${postId}`;
            }
        })
        .catch((err) => console.log(err));
});
