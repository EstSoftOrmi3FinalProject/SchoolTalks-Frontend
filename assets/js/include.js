function includeHtml() {
    // 본문의 클래스가 includeJs인 모든 항목을 가져옵니다.
    const includeTarget = document.querySelectorAll(".includeJs");
    // 해당 항목들을 차례차례 순회를 돕니다.
    includeTarget.forEach(function (el, idx) {
        // 이번 항목의 data-include-file 속성을 읽어낸다.
        const targetFile = el.dataset.includeFile;
        if (targetFile) {
            // 해당 속성의 html을 fetch로 불러낸다.
            fetch(targetFile)
                .then((response) => response.text())
                .then((html) => {
                    // html text로 꺼낸다
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(html, "text/html");
                    // 현재 주소의 path를 받는다.
                    const currentHref = window.location.pathname.split("/")[1];
                    // 해당 주소의 path와 동일한 링크를 가진 header에 active 클래스를 삽입한다.(css)
                    const activeElement = htmlDoc.querySelector(
                        `[href="/${currentHref}"]`
                    );
                    if (activeElement) {
                        activeElement.classList.add("active");
                    }
                    // fetch로 받아온 html text를 삽입한다.
                    el.innerHTML = htmlDoc.body.innerHTML;
                    logout();
                    // mobile();
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    el.innerHTML = "include not found.";
                });
        }
    });
}
includeHtml();

function mobile() {
    //===== mobile-menu-btn
    let navbarToggler = document.querySelector(".mobile-menu-btn");
    navbarToggler.addEventListener("click", function () {
        navbarToggler.classList.toggle("active");
    });
}
