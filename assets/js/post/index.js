const btnWrite = document.querySelector("#btn-write");

function postload() {
    const postlist = document.querySelector(".postlist");
    document.addEventListener("DOMContentLoaded", function () {
        fetch("http://127.0.0.1:8000/post/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                data.forEach((post) => {
                    const dateObject = new Date(post.created_at);
                    const formattedDate = `
                    ${dateObject.getFullYear()} -
                    ${dateObject.getMonth() + 1} -
                    ${dateObject.getDate()}
                    `;
                    postlist.innerHTML += `
                    <tr>
                        <td class="text-center">${post.id}</td>
                        <td><a href="/post/post.html?post_id=${post.id}">${post.title}</a></td>
                        <td class="text-center">${post.author_name}</td>
                        <td class="text-center">${formattedDate}</td>
                        <td class="text-center">${post.hits}</td>
                    </tr>
                    `;
                });
            });
    });
}

function writeload() {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
        btnWrite.classList.remove("d-none");
    }
}

postload();
writeload();

btnWrite.addEventListener("click", function () {
    window.location.href = "/post/write.html";
});
