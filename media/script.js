(function () {
    const vscode = acquireVsCodeApi();

    let count = 0;
    const counter = document.getElementById('lines-of-code-counter');
    const inputDiv = document.getElementById("state-name");
    const testingSitesDiv = document.getElementById('testing-sites');

    class CovidTestingSites {
        constructor(testingSitesDiv) {
            this.parentDiv = testingSitesDiv;
        }

        _fetchSites() {
            const h1 = document.createElement('h1');
            h1.textContent = 'hello';
            this.parentDiv.appendChild(h1);

            try {
                fetch("https://covid-19-testing.github.io/locations/washington/complete.json")
                .then(response => response.json())
                .then(data => {
                    const h1 = document.createElement('h1');
                    h1.textContent = 'hi';
                    this.parentDiv.appendChild(h1);

                    data.forEach(d => {
                        const h2 = document.createElement('h2');
                        h2.textContent = d.name;
                        this.parentDiv.appendChild(h2);
                    });
                });
            } catch (error) {
                vscode.postMessage({
                    command: 'alert',
                    text: error.message
                });
            }
        }
    }

    const testingSites = new CovidTestingSites(inputDiv, testingSitesDiv);

    inputDiv.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            counter.textContent = count++;
            try {
                testingSites._fetchSites();
            } catch (error) {
                vscode.postMessage({
                    command: 'alert',
                    text: error.message
                });
            }
        }
    });
}());