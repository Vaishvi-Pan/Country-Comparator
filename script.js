let allCountries = [];
let selectedData = { res1: null, res2: null };

function randomize() {
    if (allCountries.length < 2) return;
    const r1 = allCountries[Math.floor(Math.random() * allCountries.length)].name.common;
    const r2 = allCountries[Math.floor(Math.random() * allCountries.length)].name.common;
    
    document.getElementById('sel1').value = r1;
    document.getElementById('sel2').value = r2;
    
    showCountry('sel1', 'res1');
    showCountry('sel2', 'res2');
}

// Fetch all country names for dropdowns
fetch('https://restcountries.com/v3.1/all?fields=name,cca2,region')
    .then(r => r.json())
    .then(d => {
        // [SORT] alphabetical sorting
        allCountries = d.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // [MAP] generate option tags
        const optionsHTML = allCountries
            .filter(c => c.name.common) // [FILTER] ensure common name exists
            .map(c => `<option value="${c.name.common}">${c.name.common}</option>`)
            .join('');

        ['sel1', 'sel2'].forEach(id => {
            const sel = document.getElementById(id);
            sel.innerHTML += optionsHTML;
        });
    })
    .catch(() => console.error("Dropdown load failed"));

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
        lucide.createIcons();
        updateComparisons();
        return;
    }

    div.innerHTML = `<div class="placeholder-card"><p>Loading...</p></div>`;

    fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        .then(r => r.json())
        .then(data => {
            const c = data[0];
            selectedData[resId] = c;
            renderCountryCard(resId, c);
            updateComparisons();
        })
        .catch(() => {
            div.innerHTML = '<div class="placeholder-card"><p style="color:#ef4444">Error loading data</p></div>';
        });
}

function renderCountryCard(resId, c) {
    const div = document.getElementById(resId);
    
    // [FILTER & MAP] Find same-region countries for context
    const neighborsTitle = c.region ? `Same Region (${c.region})` : 'Other Countries';
    const counterparts = allCountries
        .filter(x => x.region === c.region && x.name.common !== c.name.common)
        .slice(0, 5)
        .map(x => x.name.common)
        .join(', ');

    div.innerHTML = `
        <div class="country-card" id="card-${resId}">
            <div class="flag-container">
                <img src="${c.flags.svg || c.flags.png}" alt="${c.name.common} Flag">
            </div>
            
            <h2 class="country-title">
                ${c.name.common}
                <span id="badge-${resId}-pop" class="badge badge-winner" style="display:none">Most People</span>
                <span id="badge-${resId}-area" class="badge badge-winner" style="display:none">Largest</span>
            </h2>

            <div class="data-group">
                <div class="data-item">
                    <span class="data-label"><i data-lucide="map-pin"></i> Capital</span>
                    <span class="data-value">${c.capital ? c.capital[0] : 'N/A'}</span>
                </div>
                <div class="data-item">
                    <span class="data-label"><i data-lucide="users"></i> Population</span>
                    <span class="data-value">${c.population.toLocaleString()}</span>
                </div>
                <div class="data-item">
                    <span class="data-label"><i data-lucide="maximize"></i> Area</span>
                    <span class="data-value">${c.area ? c.area.toLocaleString() + ' km²' : 'N/A'}</span>
                </div>
                <div class="data-item">
                    <span class="data-label"><i data-lucide="coins"></i> Currency</span>
                    <span class="data-value">${currencies}</span>
                </div>
                <div class="data-item">
                    <span class="data-label"><i data-lucide="languages"></i> Languages</span>
                    <span class="data-value">${languages}</span>
                </div>
                <div class="data-item">
                    <span class="data-label"><i data-lucide="clock"></i> Timezone</span>
                    <span class="data-value">${timezones}</span>
                </div>
                <div class="data-item" style="flex-direction:column; align-items:flex-start; border-top: 1px solid rgba(255,255,255,0.1); padding-top:1rem; margin-top:0.5rem;">
                    <span class="data-label" style="font-size:0.8rem; margin-bottom:0.4rem;">${neighborsTitle}</span>
                    <span class="data-value" style="font-size:0.85rem; font-weight:400; color:var(--text-secondary);">${counterparts || 'None'}</span>
                </div>
            </div>

            <div class="comparison-bar-container">
                <div class="bar-label">
                    <span>Population Scale</span>
                    <span id="pop-percent-${resId}">0%</span>
                </div>
                <div class="bar-bg">
                    <div id="pop-bar-${resId}" class="bar-fill"></div>
                </div>
            </div>

            <div class="comparison-bar-container">
                <div class="bar-label">
                    <span>Area Scale</span>
                    <span id="area-percent-${resId}">0%</span>
                </div>
                <div class="bar-bg">
                    <div id="area-bar-${resId}" class="bar-fill"></div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById(`card-${resId}`).classList.add('loaded');
        lucide.createIcons();
    }, 50);
}

function updateComparisons() {
    const c1 = selectedData.res1;
    const c2 = selectedData.res2;

    if (!c1 || !c2) {
        // Reset bars to 100% and hide badges if only one or none selected
        ['res1', 'res2'].forEach(id => {
            const popBar = document.getElementById(`pop-bar-${id}`);
            const areaBar = document.getElementById(`area-bar-${id}`);
            if (popBar) popBar.style.width = '100%';
            if (areaBar) areaBar.style.width = '100%';
        });
        return;
    }

    // Compare Population
    const maxPop = Math.max(c1.population, c2.population);
    updateMetric('pop', c1.population, c2.population, maxPop);

    // Compare Area
    const maxArea = Math.max(c1.area || 0, c2.area || 0);
    updateMetric('area', c1.area || 0, c2.area || 0, maxArea);
}

function updateMetric(type, val1, val2, max) {
    const bar1 = document.getElementById(`${type}-bar-res1`);
    const bar2 = document.getElementById(`${type}-bar-res2`);
    const perc1 = document.getElementById(`${type}-percent-res1`);
    const perc2 = document.getElementById(`${type}-percent-res2`);
    const badge1 = document.getElementById(`badge-res1-${type}`);
    const badge2 = document.getElementById(`badge-res2-${type}`);

    if (bar1 && bar2) {
        const p1 = (val1 / max) * 100;
        const p2 = (val2 / max) * 100;
        
        bar1.style.width = `${p1}%`;
        bar2.style.width = `${p2}%`;
        
        if (perc1) perc1.textContent = `${Math.round(p1)}%`;
        if (perc2) perc2.textContent = `${Math.round(p2)}%`;

        // Badges
        if (badge1 && badge2) {
            badge1.style.display = val1 > val2 ? 'inline-block' : 'none';
            badge2.style.display = val2 > val1 ? 'inline-block' : 'none';
        }
        
        updateSummary();
    }
}

function updateSummary() {
    const c1 = selectedData.res1;
    const c2 = selectedData.res2;
    const summaryDiv = document.getElementById('comparison-summary');
    
    if (!c1 || !c2 || !summaryDiv) return;

    let text = "";
    const popRatio = c1.population > c2.population 
        ? (c1.population / c2.population).toFixed(1)
        : (c2.population / c1.population).toFixed(1);
    
    const morePop = c1.population > c2.population ? c1.name.common : c2.name.common;
    const lessPop = c1.population > c2.population ? c2.name.common : c1.name.common;

    text = `${morePop} is approximately ${popRatio}x more populous than ${lessPop}.`;
    
    summaryDiv.innerHTML = `<p>${text}</p>`;
    summaryDiv.classList.add('visible');
}