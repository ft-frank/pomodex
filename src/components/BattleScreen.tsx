import React, { useState, useEffect, useCallback } from 'react';
import { Settings, BookOpen } from 'lucide-react';
import { PokemonSprite } from './PokemonSprite';
import { BattleMenu } from './BattleMenu';
import { BagModal } from './BagModal';
import {PokedexModal} from './PokedexModal.tsx'
import { toast, Toaster } from 'sonner';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import {pokemonMap} from '../constants/pokemonMap.tsx'
import { loadCollection, markSeen, markCaught } from '../supabase/pokemonService'

// Pokemon names mapping for the message box
const POKEMON_NAMES: Record<number, string> = pokemonMap


export default function BattleScreen() {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  const [currentPokemonId, setCurrentPokemonId] = useState(() => Math.floor(Math.random() * 493) + 1);
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);
  const [seenPokemon, setSeenPokemon] = useState<number[]>([]);
  const [catchFailed, setCatchFailed] = useState(false);

  // Modal states
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isPokedexOpen, setIsPokedexOpen] = useState(false);

  // Load collection from Supabase on mount
  useEffect(() => {
    loadCollection().then(({ caught, seen }) => {
      setCaughtPokemon(caught);
      setSeenPokemon(seen);
    });
  }, []);

  // Mark current pokemon as seen whenever it changes
  useEffect(() => {
    setSeenPokemon(prev => prev.includes(currentPokemonId) ? prev : [...prev, currentPokemonId]);
    markSeen(currentPokemonId);
  }, [currentPokemonId]);

  // Update time left when minutes change and timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(minutes * 60);
    }
  }, [minutes, isActive]);

  const handleFinish = useCallback(() => {
    setIsActive(false);
    setIsCatching(true);

    // Determine catch chance based on how much HP was drained
    const catchChance = Math.min(minutes * 2.2 + 7.8, 95) / 100;
    const caught = Math.random() < catchChance;

    setTimeout(() => {
      if (caught) {
        markCaught(currentPokemonId).then(() => {
          setCaughtPokemon(prev => prev.includes(currentPokemonId) ? prev : [...prev, currentPokemonId]);
        });
        toast.success(`Gotcha! ${POKEMON_NAMES[currentPokemonId] || 'The Pokemon'} was caught!`, {
          description: "Check your Pokédex to see your collection.",
          duration: 5000,
        });
        setTimeout(() => {
          setIsCatching(false);
          const nextId = Math.floor(Math.random() * 493) + 1;
          setCurrentPokemonId(nextId);
          setTimeLeft(minutes * 60);
        }, 2000);
      } else {
        setCatchFailed(true);
        toast.error(`${POKEMON_NAMES[currentPokemonId] || 'The Pokemon'} broke free!`, {
          description: "Try a longer session next time.",
          duration: 4000,
        });
        setTimeout(() => {
          setIsCatching(false);
          setCatchFailed(false);
          setTimeLeft(minutes * 60);
        }, 2200);
      }
    }, 1500);
  }, [currentPokemonId, minutes]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleFinish]);

  const drainPercent = Math.min(minutes * 2.2 + 7.8, 95);
  const hpPercentage = (100 - drainPercent) + (timeLeft / (minutes * 60)) * drainPercent;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    toast.info("Timer reset!");
  };

  const handleRandomizePokemon = () => {
    const nextId = Math.floor(Math.random() * 493) + 1;
    setCurrentPokemonId(nextId);
    toast("A new wild Pokemon appeared!");
  };

  const pokemonName = POKEMON_NAMES[currentPokemonId] || "Wild Pokemon";

  return (
    <div className="h-screen w-screen bg-[#303030] flex items-center justify-center p-0 font-mono overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Game Boy / DS Screen Wrapper - REMOVE bg-black */}
      <div className="relative w-full h-full max-w-full border-0 md:border-[12px] md:border-[#444444] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header Icons */}
        <div className="absolute top-6 left-6 z-30 flex gap-2">
          <button 
            onClick={() => setIsPokedexOpen(true)}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95 group"
          >
            <BookOpen size={24} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">POKÉDEX</span>
          </button>
        </div>

        <div className="absolute top-6 right-6 z-30">
          <button 
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95 group"
          >
            <Settings size={24} />
            <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SETTINGS</span>
          </button>
        </div>

        {/* Game World Background - NOW FILLS ENTIRE SCREEN */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1743361657693-7b60363b6d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGxhbmRzY2FwZSUyMGx1c2glMjBoaWxscyUyMGdyZWVuJTIwcG9rZW1vbiUyMGJhdHRsZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwNzI3MjcyfDA&ixlib=rb-4.1.0&q=80&w=1080)' }}>
          {/* Sky Gradient for realism */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent" />
          
          {/* Sprite Area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-24">
            <PokemonSprite id={currentPokemonId} isCatching={isCatching} catchFailed={catchFailed} />
            
            {/* Pokemon Info HUD */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={currentPokemonId}
              className="absolute top-24 right-12 bg-white/95 border-4 border-[#333] rounded-bl-3xl p-4 w-64 shadow-lg font-['VT323']"
            >
              <div className="flex justify-between items-center border-b-2 border-gray-300 pb-1 mb-2">
                <span className="text-2xl uppercase tracking-tighter font-bold">{pokemonName}</span>
                <span className="text-xl">Lv 25</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400 italic">HP</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full border border-gray-400 overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full transition-all duration-1000",
                      hpPercentage > 50 ? "bg-green-500" : hpPercentage > 20 ? "bg-yellow-500" : "bg-red-600"
                    )}
                    style={{ width: `${hpPercentage}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* UI Controls Area */}
        <div className="relative z-20 flex justify-center items-end pb-8 px-4 h-full pointer-events-none">
          <div className="pointer-events-auto">
            <BattleMenu 
              timerDisplay={formatTime(timeLeft)}
              isActive={isActive}
              onToggle={() => setIsActive(!isActive)}
              onReset={handleReset}
              onOpenBag={() => setIsBagOpen(true)}
              onOpenPokemon={handleRandomizePokemon}
              pokemonName={pokemonName}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <BagModal 
        isOpen={isBagOpen} 
        onClose={() => setIsBagOpen(false)}
        minutes={minutes}
        onSetMinutes={setMinutes}
      />

      <PokedexModal
        isOpen={isPokedexOpen}
        onClose={() => setIsPokedexOpen(false)}
        caughtPokemon={caughtPokemon}
        seenPokemon={seenPokemon}
      />
    </div>
  );
}
