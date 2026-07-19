const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/pokemon-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const evolutions = {
  "caterpie": { level: 7, speciesId: "metapod" },
  "metapod": { level: 10, speciesId: "butterfree" },
  "weedle": { level: 7, speciesId: "kakuna" },
  "kakuna": { level: 10, speciesId: "beedrill" },
  "pidgey": { level: 18, speciesId: "pidgeotto" },
  "pidgeotto": { level: 36, speciesId: "pidgeot" },
  "rattata": { level: 20, speciesId: "raticate" },
  "spearow": { level: 20, speciesId: "fearow" },
  "ekans": { level: 22, speciesId: "arbok" },
  "pikachu": { level: 25, speciesId: "raichu" },
  "sandshrew": { level: 22, speciesId: "sandslash" },
  "nidoran-f": { level: 16, speciesId: "nidorina" },
  "nidorina": { level: 36, speciesId: "nidoqueen" },
  "nidoran-m": { level: 16, speciesId: "nidorino" },
  "nidorino": { level: 36, speciesId: "nidoking" },
  "clefairy": { level: 36, speciesId: "clefable" },
  "vulpix": { level: 36, speciesId: "ninetales" },
  "jigglypuff": { level: 36, speciesId: "wigglytuff" },
  "zubat": { level: 22, speciesId: "golbat" },
  "oddish": { level: 21, speciesId: "gloom" },
  "gloom": { level: 36, speciesId: "vileplume" },
  "paras": { level: 24, speciesId: "parasect" },
  "venonat": { level: 31, speciesId: "venomoth" },
  "diglett": { level: 26, speciesId: "dugtrio" },
  "meowth": { level: 28, speciesId: "persian" },
  "psyduck": { level: 33, speciesId: "golduck" },
  "mankey": { level: 28, speciesId: "primeape" },
  "growlithe": { level: 36, speciesId: "arcanine" },
  "poliwag": { level: 25, speciesId: "poliwhirl" },
  "poliwhirl": { level: 36, speciesId: "poliwrath" },
  "abra": { level: 16, speciesId: "kadabra" },
  "kadabra": { level: 36, speciesId: "alakazam" },
  "machop": { level: 28, speciesId: "machoke" },
  "machoke": { level: 36, speciesId: "machamp" },
  "bellsprout": { level: 21, speciesId: "weepinbell" },
  "weepinbell": { level: 36, speciesId: "victreebel" },
  "tentacool": { level: 30, speciesId: "tentacruel" },
  "geodude": { level: 25, speciesId: "graveler" },
  "graveler": { level: 36, speciesId: "golem" },
  "ponyta": { level: 40, speciesId: "rapidash" },
  "slowpoke": { level: 37, speciesId: "slowbro" },
  "magnemite": { level: 30, speciesId: "magneton" },
  "doduo": { level: 31, speciesId: "dodrio" },
  "seel": { level: 34, speciesId: "dewgong" },
  "grimer": { level: 38, speciesId: "muk" },
  "shellder": { level: 36, speciesId: "cloyster" },
  "gastly": { level: 25, speciesId: "haunter" },
  "haunter": { level: 36, speciesId: "gengar" },
  "drowzee": { level: 26, speciesId: "hypno" },
  "krabby": { level: 28, speciesId: "kingler" },
  "voltorb": { level: 30, speciesId: "electrode" },
  "exeggcute": { level: 36, speciesId: "exeggutor" },
  "cubone": { level: 28, speciesId: "marowak" },
  "koffing": { level: 35, speciesId: "weezing" },
  "rhyhorn": { level: 42, speciesId: "rhydon" },
  "horsea": { level: 32, speciesId: "seadra" },
  "goldeen": { level: 33, speciesId: "seaking" },
  "staryu": { level: 36, speciesId: "starmie" },
  "magikarp": { level: 20, speciesId: "gyarados" },
  "eevee": { level: 25, speciesId: "jolteon" },
  "omanyte": { level: 40, speciesId: "omastar" },
  "kabuto": { level: 40, speciesId: "kabutops" },
  "dratini": { level: 30, speciesId: "dragonair" },
  "dragonair": { level: 55, speciesId: "dragonite" }
};

for (const [key, evo] of Object.entries(evolutions)) {
  const rarityMatch = new RegExp(`"id": "${key}",\\s*"dexId": \\d+,\\s*"name": "[^"]+",\\s*"type": "[^"]+",\\s*"rarity": "(COMMON|RARE|LEGENDARY)"`);
  const match = content.match(rarityMatch);
  if (match) {
    const insertStr = `,\n    "evolution": {\n      "level": ${evo.level},\n      "speciesId": "${evo.speciesId}"\n    }`;
    content = content.replace(match[0], match[0] + insertStr);
  }
}

fs.writeFileSync(filePath, content);
console.log("Successfully updated POKEMON_DATA with evolutions using regex.");
