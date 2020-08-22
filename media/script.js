(function () {
    const vscode = acquireVsCodeApi();
    const inputDiv = document.getElementById("state-name");
    const testingSitesDiv = document.getElementById('testing-sites');

    class CovidTestingSites {
        constructor(testingSitesDiv, vscode) {
            this.parentDiv = testingSitesDiv;
            this.vsCodeEnv = vscode;
        }

        _parseAddressToQuery(address) { return address.replace(/\s/g, '+'); }

        _fetchSites(stateInput) {
            try {
                fetch(`https://covid-19-testing.github.io/locations/${stateInput}/complete.json`)
                .then(response => response.json())
                .then(data => {
                    data
                    .sort((siteA, siteB) => (Number(new Date(siteB.updated)) - Number(new Date(siteA.updated))))
                    .forEach((site, idx) => {
                        const div = document.createElement('div');

                        const name = document.createElement('h3');
                        name.textContent = site.name;

                        const {address_1, city, postal_code} = site.physical_address[0];
                        const address = document.createElement('p');
                        address.textContent = `${address_1}, ${city} ${postal_code}`;

                        name.onclick = function() {
                            const query = site.name + ' ' + address_1;
                            vscode.postMessage({
                                command: 'information',
                                name: site.name, 
                                url: `https://www.bing.com/maps?q=${query.replace(/\s/g, '+')}`
                            });
                            // const uri = vscode.Uri.parse(`https://www.bing.com/maps?q=${this._parseAddressToQuery(address.value)}`);
                            // const uri = this.vsCodeEnv.Uri.parse(`https://www.google.com`);
                            // this.vsCodeEnv.env.openExternal(uri);
                            // vscode.commands.executeCommand("vscode.open", uri);
                        };
                        div.appendChild(name);
                        div.appendChild(address);

                        const phone = document.createElement('p');
                        phone.textContent = `${site.phones[0].number}`;
                        div.appendChild(phone);

                        const updated = document.createElement('i');
                        updated.textContent = `Last Updated : ${site.updated}`;
                        div.appendChild(updated);

                        if (idx < data.length -1) {
                            const breakline = document.createElement('hr');
                            breakline.className="breakline";
                            div.appendChild(breakline);
                        }

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

    const testingSites = new CovidTestingSites(testingSitesDiv, vscode);

    inputDiv.addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            try {        
                testingSitesDiv.innerHTML = '';
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