import React, { useState, useEffect, useCallback } from 'react';
import { Settings, BookOpen } from 'lucide-react';
import { PokemonSprite } from './PokemonSprite';
import { BattleMenu } from './BattleMenu';
import { BagModal } from './BagModal';
import { toast, Toaster } from 'sonner';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

// Pokemon names mapping for the message box
const POKEMON_NAMES: Record<number, string> = {
  1: "Bulbasaur", 4: "Charmander", 7: "Squirtle", 25: "Pikachu", 133: "Eevee",
  152: "Chikorita", 155: "Cyndaquil", 158: "Totodile", 252: "Treecko",
  255: "Torchic", 258: "Mudkip", 387: "Turtwig", 390: "Chimchar", 393: "Piplup",
  443: "Gible", 448: "Lucario", 483: "Dialga", 484: "Palkia", 487: "Giratina", 493: "Arceus"
};

const DEFAULT_POKEMON_IDS = [1, 4, 7, 25, 133, 152, 155, 158, 252, 255, 258, 387, 390, 393];

export default function App() {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  const [currentPokemonId, setCurrentPokemonId] = useState(387); // Turtwig as default (DP starter)
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);

  // Modal states
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isPokedexOpen, setIsPokedexOpen] = useState(false);

  // Initialize caught pokemon from local storage
  useEffect(() => {
    const saved = localStorage.getItem('caughtPokemon');
    if (saved) {
      try {
        setCaughtPokemon(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse caught pokemon", e);
      }
    }
  }, []);

  // Update time left when minutes change and timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(minutes * 60);
    }
  }, [minutes, isActive]);

  const handleFinish = useCallback(() => {
    setIsActive(false);
    setIsCatching(true);
    
    // Play catch sequence
    setTimeout(() => {
      setCaughtPokemon(prev => {
        const next = [...new Set([...prev, currentPokemonId])];
        localStorage.setItem('caughtPokemon', JSON.stringify(next));
        return next;
      });
      toast.success(`Gotcha! ${POKEMON_NAMES[currentPokemonId] || 'The Pokemon'} was caught!`, {
        description: "Check your Pokédex to see your collection.",
        duration: 5000,
      });
      
      // Reset to next random pokemon after a delay
      setTimeout(() => {
        setIsCatching(false);
        const nextId = DEFAULT_POKEMON_IDS[Math.floor(Math.random() * DEFAULT_POKEMON_IDS.length)];
        setCurrentPokemonId(nextId);
        setTimeLeft(minutes * 60);
      }, 2000);
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

  const hpPercentage = (timeLeft / (minutes * 60)) * 100;

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
    const nextId = DEFAULT_POKEMON_IDS[Math.floor(Math.random() * DEFAULT_POKEMON_IDS.length)];
    setCurrentPokemonId(nextId);
    toast("A new wild Pokemon appeared!");
  };

  const pokemonName = POKEMON_NAMES[currentPokemonId] || "Wild Pokemon";

  return (
    <div className="min-h-screen bg-[#303030] flex items-center justify-center p-0 md:p-8 font-mono overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Game Boy / DS Screen Wrapper */}
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-black border-[12px] border-[#444444] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
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

        {/* Game World Background */}
        <div className="relative flex-1 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1743361657693-7b60363b6d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGxhbmRzY2FwZSUyMGx1c2glMjBoaWxscyUyMGdyZWVuJTIwcG9rZW1vbiUyMGJhdHRsZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwNzI3MjcyfDA&ixlib=rb-4.1.0&q=80&w=1080)' }}>
          {/* Sky Gradient for realism */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent" />
          
          {/* Sprite Area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-24">
            <PokemonSprite id={currentPokemonId} isCatching={isCatching} />
            
            {/* Pokemon Info HUD (Top Right style like games) */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={currentPokemonId}
              className="absolute top-12 right-12 bg-white/95 border-4 border-[#333] rounded-bl-3xl p-4 w-64 shadow-lg font-['VT323']"
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
        <div className="relative z-20 flex justify-center -mt-16 pb-8 px-4">
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

        {/* Decorative elements to mimic hardware */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-20">
          <div className="w-12 h-1 bg-white/50 rounded-full" />
          <div className="w-12 h-1 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Modals */}
      <BagModal 
        isOpen={isBagOpen} 
        onClose={() => setIsBagOpen(false)}
        minutes={minutes}
        onSetMinutes={setMinutes}
      />
      
    </div>
  );
}
