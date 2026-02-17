import React, { useCallback, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { List, type ListImperativeAPI } from 'react-window';
import {pokemonMap} from '../constants/pokemonMap'
import pokeballImg from '../assets/imgs/poke-ball.png'

const POKEMON_NAMES: Record<number, string> = pokemonMap;
const ROW_HEIGHT = 40;

interface RowExtraProps {
  filteredIndices: number[];
  caughtPokemon: number[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  caughtCounts: Record<number, number>;
}

const PokemonRowComponent = ({
  index,
  style,
  filteredIndices,
  caughtPokemon,
  selectedIndex,
  onSelect,
  caughtCounts,
}: {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: Record<string, unknown>;
} & RowExtraProps) => {
  const i = filteredIndices[index];
  const id = i + 1;
  const isCaught = caughtPokemon.includes(id);
  const isSelected = selectedIndex === i;
  const caughtCount = caughtCounts[id] ?? 0;

  return (
    <div style={style}>
      <div
        onClick={() => onSelect(i)}
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
    </div>
  );
};

interface PokemonListProps {
  caughtPokemon: number[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  filteredIndices: number[];
  caughtCounts: Record<number, number>;
}

const PokemonList: React.FC<PokemonListProps> = ({
  caughtPokemon,
  selectedIndex,
  setSelectedIndex,
  filteredIndices,
  caughtCounts,
}) => {
  const listRef = useRef<ListImperativeAPI>(null);

  const handleSelect = useCallback((i: number) => {
    setSelectedIndex(i);
  }, [setSelectedIndex]);

  // Scroll to selected item when selectedIndex changes
  useEffect(() => {
    if (listRef.current) {
      const position = filteredIndices.indexOf(selectedIndex);
      if (position >= 0) {
        listRef.current.scrollToRow({ index: position, align: 'smart' });
      }
    }
  }, [selectedIndex, filteredIndices]);

  const rowProps: RowExtraProps = {
    filteredIndices,
    caughtPokemon,
    selectedIndex,
    onSelect: handleSelect,
    caughtCounts,
  };

  return (
    <div className="w-full md:w-1/4 h-32 md:h-auto bg-[#C0C0B8] border-2 border-[#A0A098] rounded-xl overflow-hidden flex flex-col md:min-h-96">
      <List<RowExtraProps>
        listRef={listRef}
        rowComponent={PokemonRowComponent}
        rowCount={filteredIndices.length}
        rowHeight={ROW_HEIGHT}
        rowProps={rowProps}
        className="flex-1 scrollbar-hide"
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default PokemonList;
