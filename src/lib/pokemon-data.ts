export type PokemonSpecies = "bulbasaur" | "charmander" | "pichu";

export interface Evolution {
  level: number;
  speciesId: string;
}

export interface PokemonMeta {
  id: string;
  name: string;
  type: string;
  evolution?: Evolution;
}

export const POKEMON_DATA: Record<string, PokemonMeta> = {
  // Grass Line
  bulbasaur: {
    id: "bulbasaur",
    name: "Bulbasaur",
    type: "Grass/Poison",
    evolution: { level: 16, speciesId: "ivysaur" }
  },
  ivysaur: {
    id: "ivysaur",
    name: "Ivysaur",
    type: "Grass/Poison",
    evolution: { level: 32, speciesId: "venusaur" }
  },
  venusaur: {
    id: "venusaur",
    name: "Venusaur",
    type: "Grass/Poison"
  },
  
  // Fire Line
  charmander: {
    id: "charmander",
    name: "Charmander",
    type: "Fire",
    evolution: { level: 16, speciesId: "charmeleon" }
  },
  charmeleon: {
    id: "charmeleon",
    name: "Charmeleon",
    type: "Fire",
    evolution: { level: 36, speciesId: "charizard" }
  },
  charizard: {
    id: "charizard",
    name: "Charizard",
    type: "Fire/Flying"
  },
  
  // Electric Line
  pichu: {
    id: "pichu",
    name: "Pichu",
    type: "Electric",
    evolution: { level: 10, speciesId: "pikachu" }
  },
  pikachu: {
    id: "pikachu",
    name: "Pikachu",
    type: "Electric",
    evolution: { level: 25, speciesId: "raichu" }
  },
  raichu: {
    id: "raichu",
    name: "Raichu",
    type: "Electric"
  }
};

export function getPokemonLevel(xp: number): number {
  // Simple formula: Level = floor(xp / 100) + 1
  return Math.floor(xp / 100) + 1;
}

export function getSpriteUrl(speciesId: string): string {
  return `/pokemon/${speciesId}.gif`;
}

export function checkEvolution(currentSpeciesId: string, currentXp: number): string | null {
  const meta = POKEMON_DATA[currentSpeciesId];
  if (!meta || !meta.evolution) return null;
  
  const currentLevel = getPokemonLevel(currentXp);
  if (currentLevel >= meta.evolution.level) {
    return meta.evolution.speciesId;
  }
  
  return null;
}
