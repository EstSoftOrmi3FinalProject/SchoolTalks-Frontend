const btnWrite = document.querySelector("#btn-write");
const btnSearch = document.querySelector("#btn-search");
const postlist = document.querySelector(".postlist");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const postDomain = baseDomain + "post/";

function fetchPost() {
    document.addEventListener("DOMContentLoaded", function () {
        fetch(`${postDomain}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => postload(data));
    });
}

function writeload() {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
        btnWrite.classList.remove("d-none");
    }
}

function formatDate(isoDate) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(isoDate).toLocaleString("ko-KR", options);
}

function postload(data) {
    postlist.innerHTML = `
    <tr>
        <th class="col-1 text-center">글번호</th>
        <th class="col text-center">글제목</th>
        <th class="col-2 text-center">작성자</th>
        <th class="col-2 text-center">작성일자</th>
        <th class="col-1 text-center">조회수</th>
    </tr>
    `;
    data.results.forEach((post) => {
        const date = formatDate(post.created_at);
        postlist.innerHTML += `
        <tr>
            <td class="text-center">${post.id}</td>
            <td><a href="/post/post.html?post_id=${post.id}">${post.title}</a></td>
            <td class="text-center">${post.author_name}</td>
            <td class="text-center">${date}</td>
            <td class="text-center">${post.hits}</td>
        </tr>
        `;
    });
    if (data.previous) {
        previous.classList.remove("d-none");
        previous.dataset.url = data.previous;
    } else {
        previous.classList.add("d-none");
    }
    if (data.next) {
        next.classList.remove("d-none");
        next.dataset.url = data.next;
    } else {
        next.classList.add("d-none");
    }
}

fetchPost();
writeload();

btnWrite.addEventListener("click", function () {
    window.location.href = "/post/write.html";
});

// 검색 기능

btnSearch.addEventListener("click", function (e) {
    e.preventDefault();
    const type = document.querySelector("#search-select");
    const search = document.querySelector("#search-value");
    fetch(`${postDomain}?${type.value}=${search.value}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => postload(data));
});

// 페이지네이션 기능
previous.addEventListener("click", function () {
    fetch(previous.dataset.url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => postload(data));
});

next.addEventListener("click", function () {
    fetch(next.dataset.url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => postload(data));
});
