const fs = require('fs');

async function scrape() {
  console.log("Fetching top 151 pokemon...");
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await res.json();
  
  const pokemonDict = {};

  // For rarity: Legendaries in Gen 1 are Articuno, Zapdos, Moltres, Mewtwo, Mew.
  const legendaries = ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew'];
  const rares = ['dragonite', 'dragonair', 'dratini', 'snorlax', 'lapras', 'aerodactyl', 'omastar', 'kabutops', 'porygon', 'gyarados', 'magmar', 'electabuzz', 'scyther', 'pinsir', 'tauros', 'kangaskhan', 'chansey', 'hitmonlee', 'hitmonchan'];
  
  // To avoid hundreds of requests for evolution levels right now, we can omit them for the expanded library temporarily, 
  // OR we can do a simplified fetch just for the first 151.
  // Actually, since this is a quick script, let's just fetch the types. 
  // Evolution data takes a long time to parse correctly (it's a deeply nested linked list).
  // I will scrape just types, and we can hardcode evolution for a few lines if needed, or rely on XP scaling.
  
  for (let i = 0; i < data.results.length; i++) {
    const poke = data.results[i];
    const detailsRes = await fetch(poke.url);
    const details = await detailsRes.json();
    
    const types = details.types.map(t => t.type.name).join('/');
    // capitalize name
    const name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
    
    let rarity = 'COMMON';
    if (legendaries.includes(poke.name)) rarity = 'LEGENDARY';
    else if (rares.includes(poke.name)) rarity = 'RARE';

    pokemonDict[poke.name] = {
      id: poke.name,
      dexId: details.id,
      name: name,
      type: types,
      rarity
    };
    
    // progress
    if (i % 25 === 0) console.log(`Fetched ${i}/151...`);
  }

  // Hardcode some famous evolutions to not break existing mechanics
  pokemonDict['bulbasaur'].evolution = { level: 16, speciesId: 'ivysaur' };
  pokemonDict['ivysaur'].evolution = { level: 32, speciesId: 'venusaur' };
  pokemonDict['charmander'].evolution = { level: 16, speciesId: 'charmeleon' };
  pokemonDict['charmeleon'].evolution = { level: 36, speciesId: 'charizard' };
  pokemonDict['squirtle'].evolution = { level: 16, speciesId: 'wartortle' };
  pokemonDict['wartortle'].evolution = { level: 36, speciesId: 'blastoise' };
  pokemonDict['pichu'] = { id: 'pichu', dexId: 172, name: 'Pichu', type: 'electric', rarity: 'COMMON', evolution: { level: 10, speciesId: 'pikachu' } }; // Keep pichu since it was there
  pokemonDict['pikachu'].evolution = { level: 25, speciesId: 'raichu' };

  let fileContent = `export type PokemonSpecies = string;\n\n`;
  fileContent += `export interface Evolution {\n  level: number;\n  speciesId: string;\n}\n\n`;
  fileContent += `export interface PokemonMeta {\n  id: string;\n  dexId: number;\n  name: string;\n  type: string;\n  rarity: "COMMON" | "RARE" | "LEGENDARY";\n  evolution?: Evolution;\n}\n\n`;
  fileContent += `export const POKEMON_DATA: Record<string, PokemonMeta> = ${JSON.stringify(pokemonDict, null, 2)};\n\n`;
  fileContent += `export function getPokemonLevel(xp: number): number {\n  return Math.floor(xp / 100) + 1;\n}\n\n`;
  fileContent += `export function getSpriteUrl(speciesId: string): string {\n  const meta = POKEMON_DATA[speciesId];\n  if (!meta) return "/pokemon/unknown.gif";\n  return \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/\${meta.dexId}.gif\`;\n}\n\n`;
  fileContent += `export function checkEvolution(currentSpeciesId: string, currentXp: number): string | null {\n  const meta = POKEMON_DATA[currentSpeciesId];\n  if (!meta || !meta.evolution) return null;\n  const currentLevel = getPokemonLevel(currentXp);\n  if (currentLevel >= meta.evolution.level) return meta.evolution.speciesId;\n  return null;\n}\n`;

  fs.writeFileSync('./src/lib/pokemon-data.ts', fileContent);
  console.log("Successfully generated pokemon-data.ts!");
}

scrape().catch(console.error);
