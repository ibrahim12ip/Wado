const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_JS = path.join(__dirname, '..', '..', 'frontend', 'js', 'data.js');
const GAMES_LIST = path.join(__dirname, 'open-source-games.json');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WadoSync/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Parse error: ${data.slice(0, 100)}`)); }
      });
    }).on('error', reject);
  });
}

async function getReleaseAsset(repo, pattern) {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=1`;
  const releases = await fetchJSON(url);
  if (!releases || releases.length === 0 || releases.message) return null;

  const release = releases[0];
  if (!release.assets) return null;

  const asset = release.assets.find(a => new RegExp(pattern, 'i').test(a.name));
  if (!asset) return null;

  return {
    name: asset.name,
    size: asset.size,
    downloadUrl: asset.browser_download_url
  };
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function syncGames() {
  const games = JSON.parse(fs.readFileSync(GAMES_LIST, 'utf-8'));
  const results = [];

  for (const game of games) {
    console.log(`\nProcessing: ${game.title}`);

    let downloadUrl = `https://github.com/${game.repo}/releases/latest`;
    let fileSize = 'Bilinmiyor';

    try {
      const asset = await getReleaseAsset(game.repo, game.assetPattern);
      if (asset) {
        fileSize = `${(asset.size / 1024 / 1024).toFixed(0)} MB`;
        downloadUrl = asset.downloadUrl;
        console.log(`  Asset: ${asset.name} (${fileSize})`);
      } else {
        console.log(`  No matching asset found, using releases/latest`);
      }
      await sleep(1500);
    } catch (err) {
      console.log(`  API error: ${err.message}, using releases/latest`);
    }

    results.push({
      id: 0,
      title: game.title,
      category: game.category,
      rating: game.rating,
      year: game.year,
      image: game.image,
      bg: game.image,
      description: game.description,
      features: game.features,
      trailer: '',
      tags: game.tags,
      releaseDate: game.releaseDate,
      developer: game.developer,
      sysReq: {
        min: { os: 'Windows 7/8/10', cpu: '2.0 GHz', ram: '2 GB', gpu: 'Intel HD Graphics', storage: fileSize },
        rec: { os: 'Windows 10/11', cpu: '3.0 GHz', ram: '4 GB', gpu: 'Dedicated GPU', storage: fileSize }
      },
      downloadUrl,
      fileSize
    });
  }

  return results;
}

function generateEntries(games, startId) {
  const gameEntries = games.map((g, i) => ({
    id: startId + i + 1,
    title: g.title,
    category: g.category,
    rating: g.rating,
    year: g.year,
    image: g.image,
    bg: g.bg,
    description: g.description,
    features: g.features,
    trailer: g.trailer,
    tags: g.tags,
    releaseDate: g.releaseDate,
    developer: g.developer,
    sysReq: g.sysReq
  }));

  const downloadEntries = {};
  gameEntries.forEach((g, i) => {
    downloadEntries[g.id] = {
      fileSize: games[i].fileSize,
      type: 'free',
      downloads: 0,
      downloadUrl: games[i].downloadUrl
    };
  });

  return { gameEntries, downloadEntries };
}

function appendToDataJs({ gameEntries, downloadEntries }) {
  let content = fs.readFileSync(DATA_JS, 'utf-8');

  // Generate game entries
  const gameBlock = gameEntries.map(g =>
    `    {\n      id: ${g.id}, title: "${g.title}", category: "${g.category}", rating: ${g.rating}, year: ${g.year},\n      image: "${g.image}",\n      bg: "${g.bg}",\n      description: "${g.description.replace(/"/g, "'")}",\n      features: [${g.features.map(f => `"${f}"`).join(', ')}],\n      trailer: "",\n      tags: [${g.tags.map(t => `"${t}"`).join(', ')}],\n      releaseDate: "${g.releaseDate}",\n      developer: "${g.developer}",\n      sysReq: {\n        min: { os: "${g.sysReq.min.os}", cpu: "${g.sysReq.min.cpu}", ram: "${g.sysReq.min.ram}", gpu: "${g.sysReq.min.gpu}", storage: "${g.sysReq.min.storage}" },\n        rec: { os: "${g.sysReq.rec.os}", cpu: "${g.sysReq.rec.cpu}", ram: "${g.sysReq.rec.ram}", gpu: "${g.sysReq.rec.gpu}", storage: "${g.sysReq.rec.storage}" }\n      }\n    }`
  ).join(',\n');

  const dlBlock = Object.entries(downloadEntries).map(([id, dl]) =>
    `    ${id}: { fileSize: '${dl.fileSize}', type: '${dl.type}', downloads: ${dl.downloads}, downloadUrl: '${dl.downloadUrl}' }`
  ).join(',\n');

  // Debug: find exact markers
  const gamesEnd = content.indexOf('  reviews:');
  const dlEnd = content.lastIndexOf('  getGame(');
  if (gamesEnd === -1) { console.error('No reviews marker'); return; }
  if (dlEnd === -1) { console.error('No getGame marker'); return; }

  // Find the last `]` before reviews
  const gameInsertPos = content.lastIndexOf(']', gamesEnd);
  if (gameInsertPos === -1) { console.error('No ] before reviews'); return; }

  // Find the last `}` before getGame
  const dlInsertPos = content.lastIndexOf('}', dlEnd);
  if (dlInsertPos === -1) { console.error('No } before getGame'); return; }

  content = content.slice(0, gameInsertPos) + '\n' + gameBlock + '\n' + content.slice(gameInsertPos);
  // After slice, positions shifted by gameBlock length
  const shift = gameBlock.length + 1;
  const newDlEnd = content.lastIndexOf('}', dlEnd + shift);
  content = content.slice(0, newDlEnd) + '\n' + dlBlock + '\n' + content.slice(newDlEnd);

  fs.writeFileSync(DATA_JS, content, 'utf-8');
  console.log(`\n✓ Added ${gameEntries.length} open source games to data.js`);
}

async function main() {
  console.log('=== Wado Open Source Game Sync ===\n');

  const lastId = 20;
  const games = await syncGames();
  const entries = generateEntries(games, lastId);

  appendToDataJs(entries);

  console.log('\nDone! Run `git add -A && git commit -m "Add open source games" && git push` to deploy.');
}

main().catch(console.error);
