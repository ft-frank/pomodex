import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Settings, BookOpen, LogOut, User, Target } from 'lucide-react';
import { supabase } from '../supabase/supabase';
import { PokemonSprite } from './PokemonSprite';
import { BattleMenu } from './BattleMenu';
import BattleStats from './BattleStats.tsx'

const BagModal = lazy(() => import('./BagModal'));
const PokedexModal = lazy(() => import('./PokedexModal'));
const StatsModal = lazy(() => import('./StatsModal'));
import { toast, Toaster } from 'sonner';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import {pokemonMap} from '../constants/pokemonMap.tsx'
import { loadCollection, markSeen, markCaught, loadStats, updateSessionStats } from '../supabase/pokemonService'
import { getRandomPokemon, getRarity } from '../constants/pokemonRarity'

// Pokemon names mapping for the message box
const POKEMON_NAMES: Record<number, string> = pokemonMap


export default function BattleScreen() {
  const [minutes, setMinutes] = useState(() => {
  const saved = localStorage.getItem('pomodex-minutes');
  return saved ? Number(saved) : 25;});
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pomodex-minutes');
    return (saved ? Number(saved) : 25) * 60;
  });
  const [isActive, setIsActive] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  const [currentPokemonId, setCurrentPokemonId] = useState(() => {
    const saved = localStorage.getItem('pomodex-current-pokemon');
    return saved ? Number(saved) : getRandomPokemon();
  });
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);
  const [seenPokemon, setSeenPokemon] = useState<number[]>([]);
  const [catchFailed, setCatchFailed] = useState(false);
  const [caughtCounts, setCaughtCounts] = useState<Record<number, number>>({});

  // Modal states
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isPokedexOpen, setIsPokedexOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsopen, setIsStatsOpen] = useState(false)
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0)

  // Load collection from Supabase on mount
  useEffect(() => {
    loadCollection().then(({ caught, seen, caughtCounts: counts }) => {
      setCaughtPokemon(caught);
      setSeenPokemon(seen);
      setCaughtCounts(counts);
    });
    loadStats().then(({ total_session_time, total_sessions, total_attempts }) => {
      setTotalSessionTime(total_session_time);
      setTotalSessions(total_sessions);
      setTotalAttempts(total_attempts)
    });
  }, []);


  // Saving changes to timer
  useEffect(() => {
  localStorage.setItem('pomodex-minutes', String(minutes));
}, [minutes]);

  // Persist current pokemon across reloads
  useEffect(() => {
    localStorage.setItem('pomodex-current-pokemon', String(currentPokemonId));
  }, [currentPokemonId]);

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
    updateSessionStats(minutes);
    
    setTotalSessionTime(prev => prev + minutes);
    setTotalSessions(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);
    

    // Determine catch chance based on how much HP was drained
    const catchChance = Math.min(minutes * 2.2 + 7.8, 95) / 100;
    const caught = Math.random() < catchChance;
    const pokemonName = POKEMON_NAMES[currentPokemonId] || 'The Pokemon';

    // Show a permanent toast prompting user to click to reveal result
    const revealToastId = toast('Timer complete! The Pokéball is shaking...', {
      description: 'Click here to see if you caught it!',
      duration: Infinity,
      action: {
        label: 'Reveal',
        onClick: () => {
          toast.dismiss(revealToastId);
          const prev = Number(sessionStorage.getItem('pomodex-session-focus') ?? 0);
          sessionStorage.setItem('pomodex-session-focus', String(prev + minutes));
          setIsCatching(true);
          if (caught) {
            markCaught(currentPokemonId).then(() => {
              setCaughtPokemon(prev => prev.includes(currentPokemonId) ? prev : [...prev, currentPokemonId]);
              setCaughtCounts(prev => ({ ...prev, [currentPokemonId]: (prev[currentPokemonId] ?? 0) + 1 }));
            });
            toast.success(`Gotcha! ${pokemonName} was caught!`, {
              description: "Check your Pokédex to see your collection.",
              duration: 5000,
            });
            setTimeout(() => {
              setIsCatching(false);
              const nextId = getRandomPokemon();
              setCurrentPokemonId(nextId);
              setTimeLeft(minutes * 60);
            }, 2000);
          } else {
            setCatchFailed(true);
            toast.error(`${pokemonName} broke free!`, {
              description: "Try a longer session next time.",
              duration: 4000,
            });
            setTimeout(() => {
              setIsCatching(false);
              setCatchFailed(false);
              setTimeLeft(minutes * 60);
            }, 2200);
          }
        },
      },
    });
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

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      document.title = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} - Pomodex`;
    } else {
      document.title = 'Pomodex';
    }
    return () => { document.title = 'Pomodex'; };
  }, [isActive, timeLeft]);

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
    const today = new Date().toDateString();
    const stored = localStorage.getItem('rerollDate');
    let count = stored === today ? Number(localStorage.getItem('rerollCount') || 0) : 0;

    if (count >= 5) {
      toast.error("No rerolls left today!", {
        description: "You can find 5 new Pokemon per day. Try again tomorrow.",
      });
      return;
    }

    count++;
    localStorage.setItem('rerollDate', today);
    localStorage.setItem('rerollCount', String(count));

    const nextId = getRandomPokemon();
    setCurrentPokemonId(nextId);
    toast(`A new wild Pokemon appeared! (${5 - count} rerolls left)`);
  };

  const pokemonName = POKEMON_NAMES[currentPokemonId] || "Wild Pokemon";
  const rarity = getRarity(currentPokemonId);
  const catchChance = Math.min(minutes * 2.2 + 7.8, 95);
  const [showStats, setShowStats] = useState(false);
  const [showRarityInfo, setShowRarityInfo] = useState(false);

  
  return (
    <div className="h-screen w-screen bg-[#303030] flex items-center justify-center p-0 font-mono overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Game Boy / DS Screen Wrapper - REMOVE bg-black */}
      <div className="relative w-full h-full max-w-full border-0 md:border-[12px] md:border-[#444444] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header Icons */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-30 grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsPokedexOpen(true)}
            className="relative p-2 sm:p-3 bg-white/10 hover:bg-white/20 hover:z-10 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95 group"
          >
            <BookOpen size={20} className="sm:w-6 sm:h-6" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">POKÉDEX</span>
          </button>
          <button
            onClick={() => setIsStatsOpen(true)}
            className="relative p-2 sm:p-3 bg-white/10 hover:bg-white/20 hover:z-10 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95 group"
          >
            <User size={20} className="sm:w-6 sm:h-6" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">TRAINER</span>
          </button>
          <button
            onClick={() => setShowStats(prev => !prev)}
            className="relative p-2 sm:p-3 bg-white/10 hover:bg-white/20 hover:z-10 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95 group"
          >
            <Target size={20} className="sm:w-6 sm:h-6" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">STATS</span>
          </button>

          {/* Battle Stats Popup */}
          {showStats && <BattleStats rarity = {rarity} catchChance = {catchChance} drainPercent = {drainPercent} minutes = {minutes} />}
        </div>

        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-30">
          <button
            onClick={() => setIsSettingsOpen(prev => !prev)}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all active:scale-95"
          >
            <Settings size={20} className="sm:w-6 sm:h-6" />
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#303030]/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl font-['VT323']">
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setIsSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors text-lg"
              >
                <LogOut size={18} />
                LOG OUT
              </button>
            </div>
          )}
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
              className="absolute top-16 right-4 sm:top-24 sm:right-12 bg-white/95 border-4 border-[#333] rounded-bl-3xl p-3 sm:p-4 w-48 sm:w-64 shadow-lg font-['VT323']"
            >
              <div className="flex justify-between items-center border-b-2 border-gray-300 pb-1 mb-2">
                <span className="text-2xl uppercase tracking-tighter font-bold">{pokemonName}</span>
                <span className="text-xl">Lv {caughtCounts[currentPokemonId] ? caughtCounts[currentPokemonId] + 1 : 1}</span>
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
      <Suspense fallback={null}>
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
          caughtCounts={caughtCounts}
        />

        <StatsModal
          isOpen={isStatsopen}
          onClose={() => setIsStatsOpen(false)}
          totalFocusTime={totalSessionTime}
          totalCaught={caughtPokemon.length}
          totalSessions={totalSessions}
          totalAttempts = {totalAttempts}
          caughtCounts={caughtCounts}
        />
      </Suspense>

    </div>


  );
}
