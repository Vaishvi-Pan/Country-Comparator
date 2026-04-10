let allCountries = [];
let selectedData = { res1: null, res2: null };

// RANDOM SELECT
function randomize() {
    if (allCountries.length < 2) return;

    const r1 = allCountries[Math.floor(Math.random() * allCountries.length)].name.common;
    const r2 = allCountries[Math.floor(Math.random() * allCountries.length)].name.common;

    document.getElementById('sel1').value = r1;
    document.getElementById('sel2').value = r2;

    showCountry('sel1', 'res1');
    showCountry('sel2', 'res2');
}

// FETCH ALL COUNTRIES (FIXED)
fetch('https://restcountries.com/v3.1/all?fields=name,cca2,region')
    .then(r => {
        if (!r.ok) throw new Error("API failed");
        return r.json();
    })
    .then(d => {
        allCountries = d.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        const optionsHTML = allCountries
            .filter(c => c.name?.common)
            .map(c => `<option value="${c.name.common}">${c.name.common}</option>`)
            .join('');

        ['sel1', 'sel2'].forEach(id => {
            const sel = document.getElementById(id);
            if (sel) sel.innerHTML += optionsHTML;
        });
    })
    .catch(err => {
        console.error("Dropdown load failed:", err);
    });

// SHOW COUNTRY (FIXED)
function showCountry(selId, resId) {
    const name = document.getElementById(selId).value;
    const div = document.getElementById(resId);

    if (!name) {
        selectedData[resId] = null;
        div.innerHTML = `
            <div class="placeholder-card">
                <i data-lucide="globe"></i>
                <p>Choose a country</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        updateComparisons();
        return;
    }

    div.innerHTML = `<div class="placeholder-card"><p>Loading...</p></div>`;

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`)
        .then(r => {
            if (!r.ok) throw new Error("Country not found");
            return r.json();
        })
        .then(data => {
            if (!data || !data[0]) throw new Error("No data");

            const c = data[0];
            selectedData[resId] = c;

            renderCountryCard(resId, c);
            updateComparisons();
        })
        .catch(err => {
            console.error(err);
            div.innerHTML = `
                <div class="placeholder-card">
                    <p style="color:#ef4444">Failed to load data</p>
                </div>
            `;
        });
}

// RENDER CARD (SAFE VERSION)
function renderCountryCard(resId, c) {
    const div = document.getElementById(resId);

    const neighborsTitle = c.region
        ? `Same Region (${c.region})`
        : 'Other Countries';

    const counterparts = allCountries
        .filter(x => x.region === c.region && x.name.common !== c.name.common)
        .slice(0, 5)
        .map(x => x.name.common)
        .join(', ');

    const currencies = c.currencies
        ? Object.values(c.currencies).map(curr => curr.name).join(', ')
        : 'N/A';

    const languages = c.languages
        ? Object.values(c.languages).join(', ')
        : 'N/A';

    const timezones = c.timezones
        ? c.timezones.join(', ')
        : 'N/A';

    div.innerHTML = `
        <div class="country-card" id="card-${resId}">
            <div class="flag-container">
                <img src="${c.flags?.svg || c.flags?.png || ''}" 
                     alt="${c.name.common} Flag"
                     onerror="this.style.display='none'">
            </div>

            <h2 class="country-title">
                ${c.name.common}
                <span id="badge-${resId}-pop" class="badge badge-winner" style="display:none">Most People</span>
                <span id="badge-${resId}-area" class="badge badge-winner" style="display:none">Largest</span>
            </h2>

            <div class="data-group">
                <div class="data-item">
                    <span class="data-label">Capital</span>
                    <span class="data-value">${c.capital?.[0] || 'N/A'}</span>
                </div>

                <div class="data-item">
                    <span class="data-label">Population</span>
                    <span class="data-value">${c.population?.toLocaleString() || 'N/A'}</span>
                </div>

                <div class="data-item">
                    <span class="data-label">Area</span>
                    <span class="data-value">${c.area ? c.area.toLocaleString() + ' km²' : 'N/A'}</span>
                </div>

                <div class="data-item">
                    <span class="data-label">Currency</span>
                    <span class="data-value">${currencies}</span>
                </div>

                <div class="data-item">
                    <span class="data-label">Languages</span>
                    <span class="data-value">${languages}</span>
                </div>

                <div class="data-item">
                    <span class="data-label">Timezone</span>
                    <span class="data-value">${timezones}</span>
                </div>

                <div class="data-item" style="flex-direction:column; align-items:flex-start;">
                    <span class="data-label">${neighborsTitle}</span>
                    <span class="data-value">${counterparts || 'None'}</span>
                </div>
            </div>

            <div class="comparison-bar-container">
                <div class="bar-label">
                    <span>Population</span>
                    <span id="pop-percent-${resId}">0%</span>
                </div>
                <div class="bar-bg">
                    <div id="pop-bar-${resId}" class="bar-fill"></div>
                </div>
            </div>

            <div class="comparison-bar-container">
                <div class="bar-label">
                    <span>Area</span>
                    <span id="area-percent-${resId}">0%</span>
                </div>
                <div class="bar-bg">
                    <div id="area-bar-${resId}" class="bar-fill"></div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById(`card-${resId}`)?.classList.add('loaded');
        if (window.lucide) lucide.createIcons();
    }, 50);
}

// UPDATE COMPARISON
function updateComparisons() {
    const c1 = selectedData.res1;
    const c2 = selectedData.res2;

    if (!c1 || !c2) return;

    const maxPop = Math.max(c1.population, c2.population);
    updateMetric('pop', c1.population, c2.population, maxPop);

    const maxArea = Math.max(c1.area || 0, c2.area || 0);
    updateMetric('area', c1.area || 0, c2.area || 0, maxArea);
}

// UPDATE METRIC
function updateMetric(type, val1, val2, max) {
    const p1 = (val1 / max) * 100;
    const p2 = (val2 / max) * 100;

    document.getElementById(`${type}-bar-res1`).style.width = `${p1}%`;
    document.getElementById(`${type}-bar-res2`).style.width = `${p2}%`;

    document.getElementById(`${type}-percent-res1`).textContent = `${Math.round(p1)}%`;
    document.getElementById(`${type}-percent-res2`).textContent = `${Math.round(p2)}%`;

    document.getElementById(`badge-res1-${type}`).style.display = val1 > val2 ? 'inline-block' : 'none';
    document.getElementById(`badge-res2-${type}`).style.display = val2 > val1 ? 'inline-block' : 'none';

    updateSummary();
}

// SUMMARY
function updateSummary() {
    const c1 = selectedData.res1;
    const c2 = selectedData.res2;
    const summaryDiv = document.getElementById('comparison-summary');

    if (!c1 || !c2 || !summaryDiv) return;

    const morePop = c1.population > c2.population ? c1.name.common : c2.name.common;
    const lessPop = c1.population > c2.population ? c2.name.common : c1.name.common;

    const ratio = (Math.max(c1.population, c2.population) / Math.min(c1.population, c2.population)).toFixed(1);

    summaryDiv.innerHTML = `<p>${morePop} is ~${ratio}x more populous than ${lessPop}</p>`;
    summaryDiv.classList.add('visible');
}