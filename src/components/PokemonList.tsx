import React, { useCallback, forwardRef } from 'react';
import { clsx } from 'clsx';
import {pokemonMap} from '../constants/pokemonMap'
import pokeballImg from '../assets/imgs/poke-ball.png'

const POKEMON_NAMES: Record<number, string> = pokemonMap;

const PokemonRow = React.memo(({ index, isCaught, isSelected, onSelect, caughtCount }: {
  index: number;
  isCaught: boolean;
  isSelected: boolean;
  onSelect: (i: number) => void;
  caughtCount: number;
}) => {
  const id = index + 1;
  const handleClick = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "relative flex items-center h-10 px-4 cursor-pointer transition-colors whitespace-nowrap",
        isSelected
          ? "bg-white text-[#303030]"
          : "text-[#606058] hover:bg-white/30"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45" />
      )}

      <div className="flex items-center gap-3 w-full">
        {isCaught ? (
          <img
            src={pokeballImg}
            className="w-5 h-5"
            alt=""
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-black/10" />
        )}

        <span className="text-xl font-bold w-12">
          {id.toString().padStart(3, "0")}
        </span>

        <span className="text-xl uppercase tracking-tighter truncate flex-1">
          {isCaught
            ? POKEMON_NAMES[id]
            : isSelected
            ? `POKEMON ${id}`
            : "------"}
        </span>
        {isCaught && (
          <span className="text-lg text-[#606058] ml-auto">Lv.{caughtCount}</span>
        )}
      </div>
    </div>
  );
});

interface PokemonListProps {
  caughtPokemon: number[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  filteredIndices: number[];
  caughtCounts: Record<number, number>;
}

const PokemonList = forwardRef<HTMLDivElement, PokemonListProps>(
  ({ caughtPokemon, selectedIndex, setSelectedIndex, filteredIndices, caughtCounts}, listRef) => {
    const handleSelect = useCallback((i: number) => {
      setSelectedIndex(i);
    }, [setSelectedIndex]);

    return (
      <div className="w-full md:w-1/4 h-32 md:h-auto bg-[#C0C0B8] border-2 border-[#A0A098] rounded-xl overflow-hidden flex flex-col md:min-h-96">
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto scrollbar-hide py-2"
        >
          {filteredIndices.map((i) => (
            <PokemonRow
              key={i}
              index={i}
              isCaught={caughtPokemon.includes(i + 1)}
              isSelected={selectedIndex === i}
              onSelect={handleSelect}
              caughtCount={caughtCounts[i + 1] ?? 0}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default PokemonList;