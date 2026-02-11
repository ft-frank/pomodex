// utils/usePokemonFilter.ts
import { useMemo } from 'react';
import { pokemonMap } from '../constants/pokemonMap';

export const usePokemonFilter = (searchTerm: string | null) => {
  return useMemo(() => {
    if (!searchTerm) {
      return Array.from({ length: 493 }, (_, i) => i);
    }

    const lowerSearch = searchTerm.toLowerCase();
    return Array.from({ length: 493 }, (_, i) => i).filter(i => {
      const id = i + 1;
      const name = pokemonMap[id];
      return name && name.toLowerCase().startsWith(lowerSearch);
    });
  }, [searchTerm]);
};