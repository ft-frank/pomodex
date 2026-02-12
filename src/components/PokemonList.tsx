import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { X, Search, Book, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import {pokemonMap} from '../constants/pokemonMap'
import { List } from "react-window"


interface PokemonListProps {
  caughtPokemon: number[];
  selectedIndex: number;
  setSelectedIndex: Function;
  filteredIndices: number[];
}
const PokemonList = forwardRef<HTMLDivElement, PokemonListProps>(
  ({ caughtPokemon, selectedIndex, setSelectedIndex, filteredIndices }, listRef) => {
    const POKEMON_NAMES: Record<number, string> = pokemonMap;


    return (
      // CHANGED: Mobile uses h-32 (~3 items), desktop uses w-1/5 (20% width)
      <div className="w-full md:w-1/4 h-32 md:h-auto bg-[#C0C0B8] border-2 border-[#A0A098] rounded-xl overflow-hidden flex flex-col md:min-h-96">
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto scrollbar-hide py-2"
        >
          {filteredIndices.map((i) => {
            const id = i + 1;
            const isCaught = caughtPokemon.includes(id);
            const isSelected = selectedIndex === i;

            return (
              <div
                key={id}
                onClick={() => setSelectedIndex(i)}
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
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                      className="w-5 h-5"
                      alt=""
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-black/10" />
                  )}

                  <span className="text-xl font-bold w-12">
                    {id.toString().padStart(3, "0")}
                  </span>

                  <span className="text-xl uppercase tracking-tighter truncate">
                    {isCaught
                      ? POKEMON_NAMES[id]
                      : isSelected
                      ? `POKEMON ${id}`
                      : "------"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default PokemonList;