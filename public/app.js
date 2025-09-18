const input = document.getElementById('csv-input');
const list = document.getElementById('rank-list');

function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (c === '"' && next === '"') {
                field += '"';
                i++;
            } else if (c === '"') {
                inQuotes = false;
            } else {
                field += c;
            }
        } else {
            if (c === '"') {
                inQuotes = true;
            } else if (c === ',') {
                row.push(field);
                field = '';
            } else if (c === '\n') {
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
            } else if (c === '\r') {
                // ignore
            } else {
                field += c;
            }
        }
    }
    row.push(field);
    if (row.some(v => v !== '')) rows.push(row);
    return rows;
}

function normalizeCell(s) {
    return (s ?? '').replace(/\u3000/g, ' ').trim();
}

function buildCounts(rows) {
    if (!rows.length) return new Map();
    const dataRows = rows.slice(1);
    const counts = new Map();
    for (const r of dataRows) {
        for (let c = 1; c < r.length; c++) {
            const val = normalizeCell(r[c]);
            if (!val) continue;
            counts.set(val, (counts.get(val) || 0) + 1);
        }
    }
    return counts;
}

function sortEntries(counts) {
    const arr = Array.from(counts.entries());
    arr.sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], 'ja');
    });
    return arr;
}

function renderList(entries) {
    list.innerHTML = '';
    if (!entries.length) {
        list.innerHTML = '<li class="list-item"><span>データがありません</span></li>';
        return;
    }
    entries.forEach(([name, count]) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `<span>${name}</span><small>×${count}</small>`;
        list.appendChild(li);
    });
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('読み込み失敗'));
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file, 'utf-8');
    });
}

input.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const text = await readFileAsText(file);
        const rows = parseCSV(text);
        const counts = buildCounts(rows);
        const entries = sortEntries(counts);
        renderList(entries);
    } catch (err) {
        console.error(err);
        list.innerHTML = '<li class="list-item"><span>CSV解析エラー</span></li>';
    }
});

// デモ初期表示
(function demo() {
    const demo = 'タイムスタンプ,１曲目,2曲目,3曲目\n,,,';
    const rows = parseCSV(demo);
    const counts = buildCounts(rows);
    const entries = sortEntries(counts);
    renderList(entries);
})();