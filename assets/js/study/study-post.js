// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');
    setupUIBasedOnAccessToken(accessToken);
    if (!accessToken) {
        refreshToken();
    } else {
        fetchPosts(1);
    }
    // 검색 버튼 클릭 이벤트 처리

document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput.trim() !== '') {
        performSearch(searchInput);
    }
});

});
// 검색을 수행합니다.

function performSearch(query) {
    const accessToken = localStorage.getItem('access_token');

    const url = `http://127.0.0.1:8000/study/list/?search=${query}`;
    fetchPostsFromUrl(url);
}

// create post 버튼 클릭 이벤트 처리
function setupUIBasedOnAccessToken(accessToken) {
    if (accessToken) {
        document.querySelector('.createfield').innerHTML = `
        <button id="createpost" class="btn btn-success">글쓰기</button>
        `;
        setupEventListeners();
    }
}
// "글쓰기" 버튼의 클릭 이벤트를 처리합니다.

function setupEventListeners() {
    document.getElementById('createpost').addEventListener('click', function() {
        window.location.href = '/study/create-post.html';
    });

}
// 리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.

function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        return;
    }

    fetch('http://127.0.0.1:8000/accounts/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            fetchPosts(1);
        } else {
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// 페이지별 게시물을 가져와 화면에 표시합니다.
let pageNumber = 1; // 현재 페이지 번호 초기화

// ...

// 다음 버튼 클릭 시
function handleNextButtonClick() {
    if (data.next) {
        pageNumber++;
        fetchPosts(pageNumber);
    }
}

// 이전 버튼 클릭 시
function handlePreviousButtonClick() {
    if (data.previous) {
        pageNumber--;
        fetchPosts(pageNumber);
    }
}

// ...

// 페이지별 게시물을 가져와 화면에 표시합니다.
// 페이지별 게시물을 가져와 화면에 표시합니다.
function fetchPosts(pageNumber) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return;
    }

    const url = `http://127.0.0.1:8000/study/list/?page=${pageNumber}`;
    fetch(url, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => {
        if (!response.ok) {
            refreshToken();
            return;
        }
        return response.json();
    })
    .then(data => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = ''; // Clear existing posts
        if (data && data.results) {
            data.results.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }

        if (data) {
            createPagination(data); // 수정: createPagination 함수 호출
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// ...

// URL에서 페이지 번호를 추출합니다.
function getPageNumberFromUrl(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('page');
}


// 게시물 요소를 생성합니다.
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
    <div class="post-card">
        <div class="post-content">
            <h3>📌제목 : ${post.title}</h3>
            <p>📍내용 : ${post.caption}</p>
        </div>
        <div class="post-footer">
        <p>😀이름 : ${post.author_username}</p>

            <a href="/study/post.html?postId=${post.id}" class="post-link">...더보기</a>
        </div>
        </div>

    `;
    return postElement;
}

// // 페이지 링크를 생성합니다.
// function createPagination(data) {
//     const paginationContainer = document.getElementById('paginationContainer');
//     paginationContainer.innerHTML = ''; // Clear existing pagination

//     const ul = document.createElement('ul');
//     ul.classList.add('pagination');

//     // 이전 페이지 링크
//     if (data.previous) {
//         const prevPageNumber = getPageNumberFromUrl(data.previous);
//         ul.appendChild(createPageLink('Previous', prevPageNumber));
//     }

//     // // 페이지 링크 생성
//     // for (let i = 1; i <= Math.ceil(data.count / 10); i++) {
//     //     ul.appendChild(createPageLink(i, i));
//     // }

//     // 다음 페이지 링크
//     if (data.next) {
//         const nextPageNumber = getPageNumberFromUrl(data.next);
//         ul.appendChild(createPageLink('Next', nextPageNumber));
//     }

//     paginationContainer.appendChild(ul);
// }

// // ...

// // 페이지 링크 생성
// function createPageLink(text, pageNumber) {
//     const link = document.createElement('a');
//     link.href = '#';
//     link.textContent = text;
//     link.addEventListener('click', (e) => {
//         e.preventDefault();
//         fetchPosts(pageNumber);
//     });
//     return link;
// }

// 페이지 링크를 생성합니다.
function createPagination(data) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    // Previous 버튼
    if (data.previous) {
        const prevPageNumber = getPageNumberFromUrl(data.previous);
        ul.appendChild(createPageButton('이전', prevPageNumber));
    }

    // Next 버튼
    if (data.next) {
        const nextPageNumber = getPageNumberFromUrl(data.next);
        ul.appendChild(createPageButton('다음', nextPageNumber));
    }

    paginationContainer.appendChild(ul);
}

// 페이지 버튼을 생성합니다.
// 페이지 버튼을 생성합니다.
function createPageButton(text, pageNumber) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('button'); // CSS 클래스 추가
    button.addEventListener('click', () => {
        fetchPosts(pageNumber);
    });
    return button;
}



// 페이지별 게시물을 가져와 화면에 표시합니다.

function fetchPostsFromUrl(url) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return;
    }

    fetch(url, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => {
        if (!response.ok) {
            refreshToken();
            return;
        }
        return response.json();
    })
    .then(data => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = ''; // Clear existing posts
        if (data && data.results) {
            data.results.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }

        if (data) {
            createPaginationLinks(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
