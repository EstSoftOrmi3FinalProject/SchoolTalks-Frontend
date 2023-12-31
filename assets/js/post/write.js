const postSubmit = document.querySelector("#post-submit");
const postDomain = baseDomain + "post/";

postSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    const postTitle = document.querySelector("#post-title").value;
    const postContent = document.querySelector("#post-content").value;

    const post = {
        title: postTitle,
        content: postContent,
    };
    fetch(`${postDomain}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(post),
    })
        .then((res) => res.json())
        .then((data) => {
            window.location.href = "/post";
        })
        .catch((err) => console.log(err));
});
