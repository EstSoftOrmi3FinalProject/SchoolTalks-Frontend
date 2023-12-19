const postSubmit = document.querySelector("#post-submit");

postSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    const postTitle = document.querySelector("#post-title").value;
    const postContent = document.querySelector("#post-content").value;

    const post = {
        title: postTitle,
        content: postContent,
    };
    fetch("http://127.0.0.1:8000/post/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(post),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                // window.location.href = "/post";
            }
        })
        .catch((err) => console.log(err));
});
