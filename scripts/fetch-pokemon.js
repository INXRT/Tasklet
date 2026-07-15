const fs = require('fs');
const https = require('https');
const path = require('path');

const POKEMONS = [
  'bulbasaur', 'ivysaur', 'venusaur',
  'charmander', 'charmeleon', 'charizard',
  'pichu', 'pikachu', 'raichu'
];

const BASE_URL = 'https://play.pokemonshowdown.com/sprites/gen5ani';
const DIR = path.join(__dirname, '../public/pokemon');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => reject(new Error(`Failed to download: ${response.statusCode}`)));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const name of POKEMONS) {
    console.log(`Downloading ${name}...`);
    try {
      await download(`${BASE_URL}/${name}.gif`, path.join(DIR, `${name}.gif`));
      console.log(`✓ ${name} done`);
    } catch (e) {
      console.error(`✗ ${name} failed: ${e.message}`);
    }
  }
  
  // Also get some items for the shop
  const ITEMS = [
    { url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', name: 'poke-ball.png' },
    { url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png', name: 'oran-berry.png' },
    { url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png', name: 'rare-candy.png' }
  ];
  
  const ITEM_DIR = path.join(__dirname, '../public/items');
  if (!fs.existsSync(ITEM_DIR)) {
    fs.mkdirSync(ITEM_DIR, { recursive: true });
  }
  
  for (const item of ITEMS) {
    console.log(`Downloading ${item.name}...`);
    try {
      await download(item.url, path.join(ITEM_DIR, item.name));
      console.log(`✓ ${item.name} done`);
    } catch (e) {
      console.error(`✗ ${item.name} failed: ${e.message}`);
    }
  }
}

run();
