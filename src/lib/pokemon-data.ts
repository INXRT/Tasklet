export type PokemonSpecies = string;

export interface Evolution {
  level: number;
  speciesId: string;
}

export interface PokemonMeta {
  id: string;
  dexId: number;
  name: string;
  type: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY";
  evolution?: Evolution;
}

export const POKEMON_DATA: Record<string, PokemonMeta> = {
  "bulbasaur": {
    "id": "bulbasaur",
    "dexId": 1,
    "name": "Bulbasaur",
    "type": "grass/poison",
    "rarity": "COMMON",
    "evolution": {
      "level": 16,
      "speciesId": "ivysaur"
    }
  },
  "ivysaur": {
    "id": "ivysaur",
    "dexId": 2,
    "name": "Ivysaur",
    "type": "grass/poison",
    "rarity": "COMMON",
    "evolution": {
      "level": 32,
      "speciesId": "venusaur"
    }
  },
  "venusaur": {
    "id": "venusaur",
    "dexId": 3,
    "name": "Venusaur",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "charmander": {
    "id": "charmander",
    "dexId": 4,
    "name": "Charmander",
    "type": "fire",
    "rarity": "COMMON",
    "evolution": {
      "level": 16,
      "speciesId": "charmeleon"
    }
  },
  "charmeleon": {
    "id": "charmeleon",
    "dexId": 5,
    "name": "Charmeleon",
    "type": "fire",
    "rarity": "COMMON",
    "evolution": {
      "level": 36,
      "speciesId": "charizard"
    }
  },
  "charizard": {
    "id": "charizard",
    "dexId": 6,
    "name": "Charizard",
    "type": "fire/flying",
    "rarity": "COMMON"
  },
  "squirtle": {
    "id": "squirtle",
    "dexId": 7,
    "name": "Squirtle",
    "type": "water",
    "rarity": "COMMON",
    "evolution": {
      "level": 16,
      "speciesId": "wartortle"
    }
  },
  "wartortle": {
    "id": "wartortle",
    "dexId": 8,
    "name": "Wartortle",
    "type": "water",
    "rarity": "COMMON",
    "evolution": {
      "level": 36,
      "speciesId": "blastoise"
    }
  },
  "blastoise": {
    "id": "blastoise",
    "dexId": 9,
    "name": "Blastoise",
    "type": "water",
    "rarity": "COMMON"
  },
  "caterpie": {
    "id": "caterpie",
    "dexId": 10,
    "name": "Caterpie",
    "type": "bug",
    "rarity": "COMMON"
  },
  "metapod": {
    "id": "metapod",
    "dexId": 11,
    "name": "Metapod",
    "type": "bug",
    "rarity": "COMMON"
  },
  "butterfree": {
    "id": "butterfree",
    "dexId": 12,
    "name": "Butterfree",
    "type": "bug/flying",
    "rarity": "COMMON"
  },
  "weedle": {
    "id": "weedle",
    "dexId": 13,
    "name": "Weedle",
    "type": "bug/poison",
    "rarity": "COMMON"
  },
  "kakuna": {
    "id": "kakuna",
    "dexId": 14,
    "name": "Kakuna",
    "type": "bug/poison",
    "rarity": "COMMON"
  },
  "beedrill": {
    "id": "beedrill",
    "dexId": 15,
    "name": "Beedrill",
    "type": "bug/poison",
    "rarity": "COMMON"
  },
  "pidgey": {
    "id": "pidgey",
    "dexId": 16,
    "name": "Pidgey",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "pidgeotto": {
    "id": "pidgeotto",
    "dexId": 17,
    "name": "Pidgeotto",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "pidgeot": {
    "id": "pidgeot",
    "dexId": 18,
    "name": "Pidgeot",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "rattata": {
    "id": "rattata",
    "dexId": 19,
    "name": "Rattata",
    "type": "normal",
    "rarity": "COMMON"
  },
  "raticate": {
    "id": "raticate",
    "dexId": 20,
    "name": "Raticate",
    "type": "normal",
    "rarity": "COMMON"
  },
  "spearow": {
    "id": "spearow",
    "dexId": 21,
    "name": "Spearow",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "fearow": {
    "id": "fearow",
    "dexId": 22,
    "name": "Fearow",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "ekans": {
    "id": "ekans",
    "dexId": 23,
    "name": "Ekans",
    "type": "poison",
    "rarity": "COMMON"
  },
  "arbok": {
    "id": "arbok",
    "dexId": 24,
    "name": "Arbok",
    "type": "poison",
    "rarity": "COMMON"
  },
  "pikachu": {
    "id": "pikachu",
    "dexId": 25,
    "name": "Pikachu",
    "type": "electric",
    "rarity": "COMMON",
    "evolution": {
      "level": 25,
      "speciesId": "raichu"
    }
  },
  "raichu": {
    "id": "raichu",
    "dexId": 26,
    "name": "Raichu",
    "type": "electric",
    "rarity": "COMMON"
  },
  "sandshrew": {
    "id": "sandshrew",
    "dexId": 27,
    "name": "Sandshrew",
    "type": "ground",
    "rarity": "COMMON"
  },
  "sandslash": {
    "id": "sandslash",
    "dexId": 28,
    "name": "Sandslash",
    "type": "ground",
    "rarity": "COMMON"
  },
  "nidoran-f": {
    "id": "nidoran-f",
    "dexId": 29,
    "name": "Nidoran-f",
    "type": "poison",
    "rarity": "COMMON"
  },
  "nidorina": {
    "id": "nidorina",
    "dexId": 30,
    "name": "Nidorina",
    "type": "poison",
    "rarity": "COMMON"
  },
  "nidoqueen": {
    "id": "nidoqueen",
    "dexId": 31,
    "name": "Nidoqueen",
    "type": "poison/ground",
    "rarity": "COMMON"
  },
  "nidoran-m": {
    "id": "nidoran-m",
    "dexId": 32,
    "name": "Nidoran-m",
    "type": "poison",
    "rarity": "COMMON"
  },
  "nidorino": {
    "id": "nidorino",
    "dexId": 33,
    "name": "Nidorino",
    "type": "poison",
    "rarity": "COMMON"
  },
  "nidoking": {
    "id": "nidoking",
    "dexId": 34,
    "name": "Nidoking",
    "type": "poison/ground",
    "rarity": "COMMON"
  },
  "clefairy": {
    "id": "clefairy",
    "dexId": 35,
    "name": "Clefairy",
    "type": "fairy",
    "rarity": "COMMON"
  },
  "clefable": {
    "id": "clefable",
    "dexId": 36,
    "name": "Clefable",
    "type": "fairy",
    "rarity": "COMMON"
  },
  "vulpix": {
    "id": "vulpix",
    "dexId": 37,
    "name": "Vulpix",
    "type": "fire",
    "rarity": "COMMON"
  },
  "ninetales": {
    "id": "ninetales",
    "dexId": 38,
    "name": "Ninetales",
    "type": "fire",
    "rarity": "COMMON"
  },
  "jigglypuff": {
    "id": "jigglypuff",
    "dexId": 39,
    "name": "Jigglypuff",
    "type": "normal/fairy",
    "rarity": "COMMON"
  },
  "wigglytuff": {
    "id": "wigglytuff",
    "dexId": 40,
    "name": "Wigglytuff",
    "type": "normal/fairy",
    "rarity": "COMMON"
  },
  "zubat": {
    "id": "zubat",
    "dexId": 41,
    "name": "Zubat",
    "type": "poison/flying",
    "rarity": "COMMON"
  },
  "golbat": {
    "id": "golbat",
    "dexId": 42,
    "name": "Golbat",
    "type": "poison/flying",
    "rarity": "COMMON"
  },
  "oddish": {
    "id": "oddish",
    "dexId": 43,
    "name": "Oddish",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "gloom": {
    "id": "gloom",
    "dexId": 44,
    "name": "Gloom",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "vileplume": {
    "id": "vileplume",
    "dexId": 45,
    "name": "Vileplume",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "paras": {
    "id": "paras",
    "dexId": 46,
    "name": "Paras",
    "type": "bug/grass",
    "rarity": "COMMON"
  },
  "parasect": {
    "id": "parasect",
    "dexId": 47,
    "name": "Parasect",
    "type": "bug/grass",
    "rarity": "COMMON"
  },
  "venonat": {
    "id": "venonat",
    "dexId": 48,
    "name": "Venonat",
    "type": "bug/poison",
    "rarity": "COMMON"
  },
  "venomoth": {
    "id": "venomoth",
    "dexId": 49,
    "name": "Venomoth",
    "type": "bug/poison",
    "rarity": "COMMON"
  },
  "diglett": {
    "id": "diglett",
    "dexId": 50,
    "name": "Diglett",
    "type": "ground",
    "rarity": "COMMON"
  },
  "dugtrio": {
    "id": "dugtrio",
    "dexId": 51,
    "name": "Dugtrio",
    "type": "ground",
    "rarity": "COMMON"
  },
  "meowth": {
    "id": "meowth",
    "dexId": 52,
    "name": "Meowth",
    "type": "normal",
    "rarity": "COMMON"
  },
  "persian": {
    "id": "persian",
    "dexId": 53,
    "name": "Persian",
    "type": "normal",
    "rarity": "COMMON"
  },
  "psyduck": {
    "id": "psyduck",
    "dexId": 54,
    "name": "Psyduck",
    "type": "water",
    "rarity": "COMMON"
  },
  "golduck": {
    "id": "golduck",
    "dexId": 55,
    "name": "Golduck",
    "type": "water",
    "rarity": "COMMON"
  },
  "mankey": {
    "id": "mankey",
    "dexId": 56,
    "name": "Mankey",
    "type": "fighting",
    "rarity": "COMMON"
  },
  "primeape": {
    "id": "primeape",
    "dexId": 57,
    "name": "Primeape",
    "type": "fighting",
    "rarity": "COMMON"
  },
  "growlithe": {
    "id": "growlithe",
    "dexId": 58,
    "name": "Growlithe",
    "type": "fire",
    "rarity": "COMMON"
  },
  "arcanine": {
    "id": "arcanine",
    "dexId": 59,
    "name": "Arcanine",
    "type": "fire",
    "rarity": "COMMON"
  },
  "poliwag": {
    "id": "poliwag",
    "dexId": 60,
    "name": "Poliwag",
    "type": "water",
    "rarity": "COMMON"
  },
  "poliwhirl": {
    "id": "poliwhirl",
    "dexId": 61,
    "name": "Poliwhirl",
    "type": "water",
    "rarity": "COMMON"
  },
  "poliwrath": {
    "id": "poliwrath",
    "dexId": 62,
    "name": "Poliwrath",
    "type": "water/fighting",
    "rarity": "COMMON"
  },
  "abra": {
    "id": "abra",
    "dexId": 63,
    "name": "Abra",
    "type": "psychic",
    "rarity": "COMMON"
  },
  "kadabra": {
    "id": "kadabra",
    "dexId": 64,
    "name": "Kadabra",
    "type": "psychic",
    "rarity": "COMMON"
  },
  "alakazam": {
    "id": "alakazam",
    "dexId": 65,
    "name": "Alakazam",
    "type": "psychic",
    "rarity": "COMMON"
  },
  "machop": {
    "id": "machop",
    "dexId": 66,
    "name": "Machop",
    "type": "fighting",
    "rarity": "COMMON"
  },
  "machoke": {
    "id": "machoke",
    "dexId": 67,
    "name": "Machoke",
    "type": "fighting",
    "rarity": "COMMON"
  },
  "machamp": {
    "id": "machamp",
    "dexId": 68,
    "name": "Machamp",
    "type": "fighting",
    "rarity": "COMMON"
  },
  "bellsprout": {
    "id": "bellsprout",
    "dexId": 69,
    "name": "Bellsprout",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "weepinbell": {
    "id": "weepinbell",
    "dexId": 70,
    "name": "Weepinbell",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "victreebel": {
    "id": "victreebel",
    "dexId": 71,
    "name": "Victreebel",
    "type": "grass/poison",
    "rarity": "COMMON"
  },
  "tentacool": {
    "id": "tentacool",
    "dexId": 72,
    "name": "Tentacool",
    "type": "water/poison",
    "rarity": "COMMON"
  },
  "tentacruel": {
    "id": "tentacruel",
    "dexId": 73,
    "name": "Tentacruel",
    "type": "water/poison",
    "rarity": "COMMON"
  },
  "geodude": {
    "id": "geodude",
    "dexId": 74,
    "name": "Geodude",
    "type": "rock/ground",
    "rarity": "COMMON"
  },
  "graveler": {
    "id": "graveler",
    "dexId": 75,
    "name": "Graveler",
    "type": "rock/ground",
    "rarity": "COMMON"
  },
  "golem": {
    "id": "golem",
    "dexId": 76,
    "name": "Golem",
    "type": "rock/ground",
    "rarity": "COMMON"
  },
  "ponyta": {
    "id": "ponyta",
    "dexId": 77,
    "name": "Ponyta",
    "type": "fire",
    "rarity": "COMMON"
  },
  "rapidash": {
    "id": "rapidash",
    "dexId": 78,
    "name": "Rapidash",
    "type": "fire",
    "rarity": "COMMON"
  },
  "slowpoke": {
    "id": "slowpoke",
    "dexId": 79,
    "name": "Slowpoke",
    "type": "water/psychic",
    "rarity": "COMMON"
  },
  "slowbro": {
    "id": "slowbro",
    "dexId": 80,
    "name": "Slowbro",
    "type": "water/psychic",
    "rarity": "COMMON"
  },
  "magnemite": {
    "id": "magnemite",
    "dexId": 81,
    "name": "Magnemite",
    "type": "electric/steel",
    "rarity": "COMMON"
  },
  "magneton": {
    "id": "magneton",
    "dexId": 82,
    "name": "Magneton",
    "type": "electric/steel",
    "rarity": "COMMON"
  },
  "farfetchd": {
    "id": "farfetchd",
    "dexId": 83,
    "name": "Farfetchd",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "doduo": {
    "id": "doduo",
    "dexId": 84,
    "name": "Doduo",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "dodrio": {
    "id": "dodrio",
    "dexId": 85,
    "name": "Dodrio",
    "type": "normal/flying",
    "rarity": "COMMON"
  },
  "seel": {
    "id": "seel",
    "dexId": 86,
    "name": "Seel",
    "type": "water",
    "rarity": "COMMON"
  },
  "dewgong": {
    "id": "dewgong",
    "dexId": 87,
    "name": "Dewgong",
    "type": "water/ice",
    "rarity": "COMMON"
  },
  "grimer": {
    "id": "grimer",
    "dexId": 88,
    "name": "Grimer",
    "type": "poison",
    "rarity": "COMMON"
  },
  "muk": {
    "id": "muk",
    "dexId": 89,
    "name": "Muk",
    "type": "poison",
    "rarity": "COMMON"
  },
  "shellder": {
    "id": "shellder",
    "dexId": 90,
    "name": "Shellder",
    "type": "water",
    "rarity": "COMMON"
  },
  "cloyster": {
    "id": "cloyster",
    "dexId": 91,
    "name": "Cloyster",
    "type": "water/ice",
    "rarity": "COMMON"
  },
  "gastly": {
    "id": "gastly",
    "dexId": 92,
    "name": "Gastly",
    "type": "ghost/poison",
    "rarity": "COMMON"
  },
  "haunter": {
    "id": "haunter",
    "dexId": 93,
    "name": "Haunter",
    "type": "ghost/poison",
    "rarity": "COMMON"
  },
  "gengar": {
    "id": "gengar",
    "dexId": 94,
    "name": "Gengar",
    "type": "ghost/poison",
    "rarity": "COMMON"
  },
  "onix": {
    "id": "onix",
    "dexId": 95,
    "name": "Onix",
    "type": "rock/ground",
    "rarity": "COMMON"
  },
  "drowzee": {
    "id": "drowzee",
    "dexId": 96,
    "name": "Drowzee",
    "type": "psychic",
    "rarity": "COMMON"
  },
  "hypno": {
    "id": "hypno",
    "dexId": 97,
    "name": "Hypno",
    "type": "psychic",
    "rarity": "COMMON"
  },
  "krabby": {
    "id": "krabby",
    "dexId": 98,
    "name": "Krabby",
    "type": "water",
    "rarity": "COMMON"
  },
  "kingler": {
    "id": "kingler",
    "dexId": 99,
    "name": "Kingler",
    "type": "water",
    "rarity": "COMMON"
  },
  "voltorb": {
    "id": "voltorb",
    "dexId": 100,
    "name": "Voltorb",
    "type": "electric",
    "rarity": "COMMON"
  },
  "electrode": {
    "id": "electrode",
    "dexId": 101,
    "name": "Electrode",
    "type": "electric",
    "rarity": "COMMON"
  },
  "exeggcute": {
    "id": "exeggcute",
    "dexId": 102,
    "name": "Exeggcute",
    "type": "grass/psychic",
    "rarity": "COMMON"
  },
  "exeggutor": {
    "id": "exeggutor",
    "dexId": 103,
    "name": "Exeggutor",
    "type": "grass/psychic",
    "rarity": "COMMON"
  },
  "cubone": {
    "id": "cubone",
    "dexId": 104,
    "name": "Cubone",
    "type": "ground",
    "rarity": "COMMON"
  },
  "marowak": {
    "id": "marowak",
    "dexId": 105,
    "name": "Marowak",
    "type": "ground",
    "rarity": "COMMON"
  },
  "hitmonlee": {
    "id": "hitmonlee",
    "dexId": 106,
    "name": "Hitmonlee",
    "type": "fighting",
    "rarity": "RARE"
  },
  "hitmonchan": {
    "id": "hitmonchan",
    "dexId": 107,
    "name": "Hitmonchan",
    "type": "fighting",
    "rarity": "RARE"
  },
  "lickitung": {
    "id": "lickitung",
    "dexId": 108,
    "name": "Lickitung",
    "type": "normal",
    "rarity": "COMMON"
  },
  "koffing": {
    "id": "koffing",
    "dexId": 109,
    "name": "Koffing",
    "type": "poison",
    "rarity": "COMMON"
  },
  "weezing": {
    "id": "weezing",
    "dexId": 110,
    "name": "Weezing",
    "type": "poison",
    "rarity": "COMMON"
  },
  "rhyhorn": {
    "id": "rhyhorn",
    "dexId": 111,
    "name": "Rhyhorn",
    "type": "ground/rock",
    "rarity": "COMMON"
  },
  "rhydon": {
    "id": "rhydon",
    "dexId": 112,
    "name": "Rhydon",
    "type": "ground/rock",
    "rarity": "COMMON"
  },
  "chansey": {
    "id": "chansey",
    "dexId": 113,
    "name": "Chansey",
    "type": "normal",
    "rarity": "RARE"
  },
  "tangela": {
    "id": "tangela",
    "dexId": 114,
    "name": "Tangela",
    "type": "grass",
    "rarity": "COMMON"
  },
  "kangaskhan": {
    "id": "kangaskhan",
    "dexId": 115,
    "name": "Kangaskhan",
    "type": "normal",
    "rarity": "RARE"
  },
  "horsea": {
    "id": "horsea",
    "dexId": 116,
    "name": "Horsea",
    "type": "water",
    "rarity": "COMMON"
  },
  "seadra": {
    "id": "seadra",
    "dexId": 117,
    "name": "Seadra",
    "type": "water",
    "rarity": "COMMON"
  },
  "goldeen": {
    "id": "goldeen",
    "dexId": 118,
    "name": "Goldeen",
    "type": "water",
    "rarity": "COMMON"
  },
  "seaking": {
    "id": "seaking",
    "dexId": 119,
    "name": "Seaking",
    "type": "water",
    "rarity": "COMMON"
  },
  "staryu": {
    "id": "staryu",
    "dexId": 120,
    "name": "Staryu",
    "type": "water",
    "rarity": "COMMON"
  },
  "starmie": {
    "id": "starmie",
    "dexId": 121,
    "name": "Starmie",
    "type": "water/psychic",
    "rarity": "COMMON"
  },
  "mr-mime": {
    "id": "mr-mime",
    "dexId": 122,
    "name": "Mr-mime",
    "type": "psychic/fairy",
    "rarity": "COMMON"
  },
  "scyther": {
    "id": "scyther",
    "dexId": 123,
    "name": "Scyther",
    "type": "bug/flying",
    "rarity": "RARE"
  },
  "jynx": {
    "id": "jynx",
    "dexId": 124,
    "name": "Jynx",
    "type": "ice/psychic",
    "rarity": "COMMON"
  },
  "electabuzz": {
    "id": "electabuzz",
    "dexId": 125,
    "name": "Electabuzz",
    "type": "electric",
    "rarity": "RARE"
  },
  "magmar": {
    "id": "magmar",
    "dexId": 126,
    "name": "Magmar",
    "type": "fire",
    "rarity": "RARE"
  },
  "pinsir": {
    "id": "pinsir",
    "dexId": 127,
    "name": "Pinsir",
    "type": "bug",
    "rarity": "RARE"
  },
  "tauros": {
    "id": "tauros",
    "dexId": 128,
    "name": "Tauros",
    "type": "normal",
    "rarity": "RARE"
  },
  "magikarp": {
    "id": "magikarp",
    "dexId": 129,
    "name": "Magikarp",
    "type": "water",
    "rarity": "COMMON"
  },
  "gyarados": {
    "id": "gyarados",
    "dexId": 130,
    "name": "Gyarados",
    "type": "water/flying",
    "rarity": "RARE"
  },
  "lapras": {
    "id": "lapras",
    "dexId": 131,
    "name": "Lapras",
    "type": "water/ice",
    "rarity": "RARE"
  },
  "ditto": {
    "id": "ditto",
    "dexId": 132,
    "name": "Ditto",
    "type": "normal",
    "rarity": "COMMON"
  },
  "eevee": {
    "id": "eevee",
    "dexId": 133,
    "name": "Eevee",
    "type": "normal",
    "rarity": "COMMON"
  },
  "vaporeon": {
    "id": "vaporeon",
    "dexId": 134,
    "name": "Vaporeon",
    "type": "water",
    "rarity": "COMMON"
  },
  "jolteon": {
    "id": "jolteon",
    "dexId": 135,
    "name": "Jolteon",
    "type": "electric",
    "rarity": "COMMON"
  },
  "flareon": {
    "id": "flareon",
    "dexId": 136,
    "name": "Flareon",
    "type": "fire",
    "rarity": "COMMON"
  },
  "porygon": {
    "id": "porygon",
    "dexId": 137,
    "name": "Porygon",
    "type": "normal",
    "rarity": "RARE"
  },
  "omanyte": {
    "id": "omanyte",
    "dexId": 138,
    "name": "Omanyte",
    "type": "rock/water",
    "rarity": "COMMON"
  },
  "omastar": {
    "id": "omastar",
    "dexId": 139,
    "name": "Omastar",
    "type": "rock/water",
    "rarity": "RARE"
  },
  "kabuto": {
    "id": "kabuto",
    "dexId": 140,
    "name": "Kabuto",
    "type": "rock/water",
    "rarity": "COMMON"
  },
  "kabutops": {
    "id": "kabutops",
    "dexId": 141,
    "name": "Kabutops",
    "type": "rock/water",
    "rarity": "RARE"
  },
  "aerodactyl": {
    "id": "aerodactyl",
    "dexId": 142,
    "name": "Aerodactyl",
    "type": "rock/flying",
    "rarity": "RARE"
  },
  "snorlax": {
    "id": "snorlax",
    "dexId": 143,
    "name": "Snorlax",
    "type": "normal",
    "rarity": "RARE"
  },
  "articuno": {
    "id": "articuno",
    "dexId": 144,
    "name": "Articuno",
    "type": "ice/flying",
    "rarity": "LEGENDARY"
  },
  "zapdos": {
    "id": "zapdos",
    "dexId": 145,
    "name": "Zapdos",
    "type": "electric/flying",
    "rarity": "LEGENDARY"
  },
  "moltres": {
    "id": "moltres",
    "dexId": 146,
    "name": "Moltres",
    "type": "fire/flying",
    "rarity": "LEGENDARY"
  },
  "dratini": {
    "id": "dratini",
    "dexId": 147,
    "name": "Dratini",
    "type": "dragon",
    "rarity": "RARE"
  },
  "dragonair": {
    "id": "dragonair",
    "dexId": 148,
    "name": "Dragonair",
    "type": "dragon",
    "rarity": "RARE"
  },
  "dragonite": {
    "id": "dragonite",
    "dexId": 149,
    "name": "Dragonite",
    "type": "dragon/flying",
    "rarity": "RARE"
  },
  "mewtwo": {
    "id": "mewtwo",
    "dexId": 150,
    "name": "Mewtwo",
    "type": "psychic",
    "rarity": "LEGENDARY"
  },
  "mew": {
    "id": "mew",
    "dexId": 151,
    "name": "Mew",
    "type": "psychic",
    "rarity": "LEGENDARY"
  },
  "pichu": {
    "id": "pichu",
    "dexId": 172,
    "name": "Pichu",
    "type": "electric",
    "rarity": "COMMON",
    "evolution": {
      "level": 10,
      "speciesId": "pikachu"
    }
  }
};

export function getPokemonLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getSpriteUrl(speciesId: string): string {
  const meta = POKEMON_DATA[speciesId];
  if (!meta) return "/pokemon/unknown.gif";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${meta.dexId}.gif`;
}

export function checkEvolution(currentSpeciesId: string, currentXp: number): string | null {
  const meta = POKEMON_DATA[currentSpeciesId];
  if (!meta || !meta.evolution) return null;
  const currentLevel = getPokemonLevel(currentXp);
  if (currentLevel >= meta.evolution.level) return meta.evolution.speciesId;
  return null;
}
