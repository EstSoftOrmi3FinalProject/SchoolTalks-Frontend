function includeHtml() {
    const includeTarget = document.querySelectorAll(".includeJs");
    includeTarget.forEach(function (el, idx) {
        const targetFile = el.dataset.includeFile;
        if (targetFile) {
            fetch(targetFile)
                .then((response) => response.text())
                .then((html) => {
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(html, "text/html");
                    const currentHref = window.location.pathname;
                    console.log(currentHref);
                    const activeElement = htmlDoc.querySelector(
                        `[href="${currentHref}"]`
                    );
                    if (activeElement) {
                        activeElement.classList.add("active");
                    }
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
