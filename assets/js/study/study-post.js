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

// create post 버튼 클릭 이벤트 처리
function setupUIBasedOnAccessToken(accessToken) {
    if (accessToken) {
        document.querySelector('.createfield').innerHTML = `
        <button id="createpost" class="btn btn-success">Create</button>
        `;
        setupEventListeners();
    }
}

function setupEventListeners() {
    document.getElementById('createpost').addEventListener('click', function() {
        window.location.href = 'create-post.html';
    });

}

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

        if (data.pagination) {
            createPaginationLinks(data.pagination);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// UI수정
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
    <div class="post-card">
        <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.caption}</p>

        </div>
        <div class="post-footer">
            <a href="post.html?postId=${post.id}" class="post-link">...더보기</a>
        </div>
        </div>

    `;
    return postElement;
}

function createPageLink(text, pageNumber) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        fetchPosts(pageNumber);
    });
    return link;
}
// ... (이전 코드 생략)

function createPaginationLinks(data) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    // Previous page link
    if (data.previous) {
        const prevPageNumber = getPageNumberFromUrl(data.previous);
        ul.appendChild(createPageLink('Previous', prevPageNumber));
    }

    // Next page link
    if (data.next) {
        const nextPageNumber = getPageNumberFromUrl(data.next);
        ul.appendChild(createPageLink('Next', nextPageNumber));
    }

    paginationContainer.appendChild(ul);
}



function getPageNumberFromUrl(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('page');
}



function createPageLink(text, pageUrl) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageNumber = pageUrl.split('=')[1];
        fetchPosts(pageNumber);
    });
    return link;
}


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
