(function () {
    const vscode = acquireVsCodeApi();
    const inputDiv = document.getElementById("state-name");
    const testingSitesDiv = document.getElementById('testing-sites');

    class CovidTestingSites {
        constructor(testingSitesDiv) {
            this.parentDiv = testingSitesDiv;
        }

        _fetchSites(stateInput) {
            fetch(`https://covid-19-testing.github.io/locations/${stateInput}/complete.json`)
            .then(response => response.json())
            .then(data => {
                data
                .sort((siteA, siteB) => (Number(new Date(siteB.updated)) - Number(new Date(siteA.updated))))
                .forEach((site, idx) => {
                    const div = document.createElement('div');

                    const {address_1, city, postal_code} = site.physical_address[0];
                    const address = document.createElement('p');
                    address.textContent = `${address_1}, ${city} ${postal_code}`;

                    const name = document.createElement('h3');
                    name.textContent = site.name;
                    const query = site.name + ' ' + address_1;
                    name.onclick = () => {
                        vscode.postMessage({
                            command: 'information',
                            name: site.name, 
                            url: `https://www.bing.com/maps?q=${query.replace(/\s/g, '+')}`
                        });
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
                    
                    this.parentDiv.classList.add('testing-sites');
                    this.parentDiv.appendChild(div);
                });
            });
        }
    }

    const testingSites = new CovidTestingSites(testingSitesDiv);

    inputDiv.addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            testingSitesDiv.innerHTML = ''; 
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