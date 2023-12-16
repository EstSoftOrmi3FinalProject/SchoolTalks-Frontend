function includeHtml() {
    const includeTarget = document.querySelectorAll(".includeJs");
    includeTarget.forEach(function (el, idx) {
        const targetFile = el.dataset.includeFile;
        if (targetFile) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(
                            this.responseText,
                            "text/html"
                        );
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
                    } else if (this.status === 404) {
                        el.innerHTML = "include not found.";
                    }
                }
            };
            xhttp.open("GET", targetFile, true);
            xhttp.send();
            return;
        }
    });
}
includeHtml();
