(function () {
    const vscode = acquireVsCodeApi();
    const inputDiv = document.getElementById("state-name");
    const testingSitesDiv = document.getElementById('testing-sites');

    class CovidTestingSites {
        constructor(testingSitesDiv) {
            this.parentDiv = testingSitesDiv;
        }

        _fetchSites(stateInput) {
            try {
                fetch(`https://covid-19-testing.github.io/locations/${stateInput}/complete.json`)
                .then(response => response.json())
                .then(data => {
                    data
                    .sort((d1, d2) => d1.updated > d2.updated)
                    .forEach(d => {
                        const div = document.createElement('div');

                        const name = document.createElement('h3');
                        name.textContent = d.name;
                        div.appendChild(name);

                        const {address_1, city, postal_code} = d.physical_address[0];
                        const address = document.createElement('p');
                        address.textContent = `${address_1}, ${city} ${postal_code}`;
                        div.appendChild(address);

                        const phone = document.createElement('p');
                        phone.textContent = `${d.phones[0].number}`;
                        div.appendChild(phone);

                        const updated = document.createElement('i');
                        updated.textContent = `Last Updated : ${d.updated}`;
                        div.appendChild(updated);

                        const breakline = document.createElement('hr');
                        breakline.className="breakline";
                        div.appendChild(breakline);

                        this.parentDiv.appendChild(div);
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

    const testingSites = new CovidTestingSites(testingSitesDiv);

    inputDiv.addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            try {            
                testingSites._fetchSites(inputDiv.value.toLowerCase());
            } catch (error) {
                vscode.postMessage({
                    command: 'alert',
                    text: error.message
                });
            }
        }
    });
}());