fetch('https://restcountries.com/v3.1/all?fields=name')
    .then(r => r.json())
    .then(d => {
        data = d.sort((a, b) => a.name.common.localeCompare(b.name.common));

        ['sel1', 'sel2'].forEach(id => {
            const sel = document.getElementById(id);

            data.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.name.common;
                opt.textContent = c.name.common;
                sel.appendChild(opt);
            });
        });
    })
    .catch(() => {
        console.log("Dropdown load failed");
    });

function showCountry(selId, resId) {
    const name = document.getElementById(selId).value;
    const div = document.getElementById(resId);

    if (!name) {
        div.innerHTML = '<p class="placeholder">Select a country above</p>';
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${name}`)
        .then(r => r.json())
        .then(data => {
            const c = data[0];

            const currencies = c.currencies
                ? Object.values(c.currencies).map(x => x.name).join(', ')
                : 'N/A';

            const languages = c.languages
                ? Object.values(c.languages).join(', ')
                : 'N/A';

            const borders = c.borders ? c.borders.join(', ') : 'None';
            const carSign = c.car?.signs ? c.car.signs.join(', ') : 'N/A';
            const demonym = c.demonyms?.eng?.m || 'N/A';

            div.innerHTML = `
                <img src="${c.flags.png}">
                <p class="country-name">${c.name.common}</p>

                <p><span>Capital: </span>${c.capital ? c.capital[0] : 'N/A'}</p>
                <p><span>Continent: </span>${c.continents?.join(', ') || 'N/A'}</p>
                <p><span>Region: </span>${c.region}</p>

                <p><span>Population: </span>${c.population.toLocaleString()}</p>
                <p><span>Area: </span>${c.area?.toLocaleString() || 'N/A'} km²</p>

                <p><span>Currency: </span>${currencies}</p>
                <p><span>Languages: </span>${languages}</p>

                <p><span>Timezones: </span>${c.timezones?.join(', ') || 'N/A'}</p>

                <p><span>UN Member: </span>${c.unMember ? 'Yes' : 'No'}</p>
                <p><span>Landlocked: </span>${c.landlocked ? 'Yes' : 'No'}</p>

                <p><span>Borders: </span>${borders}</p>
                <p><span>Car Sign: </span>${carSign}</p>

                <p><span>Country Code: </span>${c.cca2} / ${c.cca3}</p>
                <p><span>Demonym: </span>${demonym}</p>

                <p><span>Map: </span>
                <a href="${c.maps.googleMaps}" target="_blank">View Map</a></p>
            `;
        })
        .catch(() => {
            div.innerHTML = '<p style="color:red">Error loading data</p>';
        });
}