const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/pokemon-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find multiple "evolution" blocks right next to each other
// It matches `"evolution": { ... },\n    "evolution": { ... }`
// Actually, it's easier to just match `"evolution": {[^}]+}` globally, but that's risky.

// The duplicate string looks exactly like this:
//     "evolution": {
//       "level": 25,
//       "speciesId": "raichu"
//     },
//     "evolution": {
//       "level": 25,
//       "speciesId": "raichu"
//     }

// We can replace `, "evolution": { ... }, "evolution": { ... }` but the spacing is exact.
// A better way is parsing AST but let's just do a string replace for the exact duplicate pattern.

content = content.replace(/,\s*"evolution":\s*{\s*"level":\s*(\d+),\s*"speciesId":\s*"([^"]+)"\s*},\s*"evolution":\s*{\s*"level":\s*\1,\s*"speciesId":\s*"\2"\s*}/g, (match, level, speciesId) => {
  return `,\n    "evolution": {\n      "level": ${level},\n      "speciesId": "${speciesId}"\n    }`;
});

fs.writeFileSync(filePath, content);
console.log("Successfully deduplicated POKEMON_DATA evolutions.");
