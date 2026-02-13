export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical';

const TIER_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  legendary: 4,
  mythical: 1,
};

const MYTHICAL_IDS = [
  151, // Mew
  251, // Celebi
  385, // Jirachi
  386, // Deoxys
  489, // Phione
  490, // Manaphy
  491, // Darkrai
  492, // Shaymin
  493, // Arceus
];

const LEGENDARY_IDS = [
  // Gen 1 — Birds + Mewtwo
  144, 145, 146, 150,
  // Gen 2 — Beasts + Tower duo
  243, 244, 245, 249, 250,
  // Gen 3 — Regis, Lati@s, Weather trio
  377, 378, 379, 380, 381, 382, 383, 384,
  // Gen 4 — Lake trio, Creation trio, others
  480, 481, 482, 483, 484, 485, 486, 487, 488,
];

const RARE_IDS = [
  // Final-stage starters
  3, 6, 9, 154, 157, 160, 254, 257, 260, 389, 392, 395,
  // Pseudo-legendaries
  149, 248, 373, 376, 445,
  // Eeveelutions
  134, 135, 136, 196, 197, 470, 471,
  // Notable strong Pokemon
  130, // Gyarados
  131, // Lapras
  142, // Aerodactyl
  143, // Snorlax
  181, // Ampharos
  212, // Scizor
  230, // Kingdra
  242, // Blissey
  282, // Gardevoir
  289, // Slaking
  306, // Aggron
  330, // Flygon
  350, // Milotic
  359, // Absol
  398, // Staraptor
  407, // Roserade
  442, // Spiritomb
  448, // Lucario
  461, // Weavile
  462, // Magnezone
  464, // Rhyperior
  466, // Electivire
  467, // Magmortar
  468, // Togekiss
  469, // Yanmega
  472, // Gliscor
  473, // Mamoswine
  474, // Porygon-Z
  475, // Gallade
  477, // Dusknoir
  478, // Froslass
  479, // Rotom
];

const UNCOMMON_IDS = [
  // Starters (stage 1 & 2)
  1, 2, 4, 5, 7, 8,
  152, 153, 155, 156, 158, 159,
  252, 253, 255, 256, 258, 259,
  387, 388, 390, 391, 393, 394,
  // Eevee
  133,
  // Pseudo-legendary pre-evos
  147, 148, 246, 247, 371, 372, 374, 375, 443, 444,
  // Fossil Pokemon
  138, 139, 140, 141, 345, 346, 347, 348, 408, 409, 410, 411,
  // Notable Pokemon
  25, 26,       // Pikachu, Raichu
  37, 38,       // Vulpix, Ninetales
  58, 59,       // Growlithe, Arcanine
  65,           // Alakazam
  68,           // Machamp
  76,           // Golem
  94,           // Gengar
  115,          // Kangaskhan
  123,          // Scyther
  127,          // Pinsir
  128,          // Tauros
  129,          // Magikarp
  137,          // Porygon
  175, 176,     // Togepi, Togetic
  214,          // Heracross
  227,          // Skarmory
  241,          // Miltank
  280, 281,     // Ralts, Kirlia
  302,          // Sableye
  303,          // Mawile
  304, 305,     // Aron, Lairon
  349,          // Feebas
  403, 404, 405, // Shinx, Luxio, Luxray
  447,          // Riolu
];

// Build rarity lookup
const rarityMap = new Map<number, Rarity>();
MYTHICAL_IDS.forEach(id => rarityMap.set(id, 'mythical'));
LEGENDARY_IDS.forEach(id => rarityMap.set(id, 'legendary'));
RARE_IDS.forEach(id => rarityMap.set(id, 'rare'));
UNCOMMON_IDS.forEach(id => rarityMap.set(id, 'uncommon'));

// Build tier pools
const tierPools: Record<Rarity, number[]> = {
  mythical: MYTHICAL_IDS,
  legendary: LEGENDARY_IDS,
  rare: RARE_IDS,
  uncommon: UNCOMMON_IDS,
  common: [],
};

// Everything not assigned is common
for (let id = 1; id <= 493; id++) {
  if (!rarityMap.has(id)) {
    tierPools.common.push(id);
    rarityMap.set(id, 'common');
  }
}

export function getRarity(pokemonId: number): Rarity {
  return rarityMap.get(pokemonId) ?? 'common';
}

export function getRandomPokemon(): number {
  const totalWeight = Object.values(TIER_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;

  for (const [tier, weight] of Object.entries(TIER_WEIGHTS) as [Rarity, number][]) {
    roll -= weight;
    if (roll <= 0) {
      const pool = tierPools[tier];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // Fallback
  return Math.floor(Math.random() * 493) + 1;
}
