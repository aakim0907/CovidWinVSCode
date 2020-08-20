(function () {
    let count = 0;
    const counter = document.getElementById('lines-of-code-counter');
    const input = document.getElementById("state-name");

    input.addEventListener("keyup", (e)=> {
        if (e.keyCode === 13) {
            e.preventDefault();

            counter.textContent = count++;
        }
    });
}());