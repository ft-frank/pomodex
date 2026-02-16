import React, { useState, useRef, useEffect, useMemo, useCallback, startTransition } from 'react';
import { X, Search, Book, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import PokemonList from "./PokemonList"
import { usePokemonFilter } from '../utils/usePokemonFilter'



interface PokedexModalProps {
  isOpen: boolean;
  onClose: () => void;
  caughtPokemon: number[];
  seenPokemon: number[];
  caughtCounts: Record<number, number>;
}


// Gen 4 End is 493. We'll show a range.


export const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose, caughtPokemon, seenPokemon, caughtCounts }) => {
  const [searchTerm, setSearchTerm] = useState(null) 
  const listRef = useRef<HTMLDivElement>(null);
  const filteredPokemonIndices = usePokemonFilter(searchTerm);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [empty, changeEmpty] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'seen' | 'obtained'>('all');

  const displayedIndices = useMemo(() => {
    if (filterMode === 'all') return filteredPokemonIndices;
    if (filterMode === 'seen') return filteredPokemonIndices.filter(i => seenPokemon.includes(i + 1));
    return filteredPokemonIndices.filter(i => caughtPokemon.includes(i + 1));
  }, [filterMode, filteredPokemonIndices, seenPokemon, caughtPokemon]);

  const cycleFilter = () => {
    setFilterMode(prev => prev === 'all' ? 'seen' : prev === 'seen' ? 'obtained' : 'all');
  };

  // Close on B or Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to selected item when it changes
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
  if (displayedIndices.length > 0) {
    setSelectedIndex(displayedIndices[0]);
    changeEmpty(false)
  }
  else{changeEmpty(true)}
}, [displayedIndices])

  const setIndex = function(index: number) {
    setSelectedIndex(index)
  }

  const handleNext = () => {  const currentPosition = displayedIndices.indexOf(selectedIndex);
    if (currentPosition < displayedIndices.length - 1) {
      setSelectedIndex(displayedIndices[currentPosition + 1]);
    }

  }

  const handlePrev = () => { const currentPosition = displayedIndices.indexOf(selectedIndex);
    if (currentPosition > 0) {
      setSelectedIndex(displayedIndices[currentPosition - 1]);
    }

  }

  
    const seenCount = seenPokemon.length

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md font-['VT323']">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col gap-1 sm:gap-2 w-full h-full"
          >
            {/* MAIN DISPLAY SCREEN */}
            <div className="flex-1 bg-[#D8D8D0] border-4 sm:border-8 border-[#303030] rounded-xl overflow-hidden flex flex-col relative shadow-2xl min-h-0">
              {/* Header Bar */}
              <div className="h-10 bg-[#808080] border-b-4 border-black/20 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-white text-xl tracking-widest uppercase italic">NATIONAL POKÉDEX</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-black/40 rounded-full" />
                  <div className="w-2 h-2 bg-black/40 rounded-full" />
                </div>
              </div>

              {/* Main Display Area */}
              <div className="flex-1 flex flex-col md:flex-row p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden min-h-0">
                {/* Left: Sprite Display */}
                <div className="w-full flex flex-col gap-2 sm:gap-4 min-h-0">
                  <div className="w-full min-h-32 sm:min-h-48 md:min-h-0 h-full max-h-60 sm:max-h-96 md:max-h-none bg-white border-4 border-[#A0A098] rounded-2xl p-2 sm:p-4 flex items-center justify-center relative shadow-inner">
                    <div className="absolute inset-0 border-4 border-yellow-200/50 rounded-xl pointer-events-none" />
                    <div className="relative w-full h-full flex items-center justify-center min-h-24 sm:min-h-40">
                      {!empty && caughtPokemon.includes(selectedIndex + 1) ? (
                        <>
                        <img
                          src={`/sprites/${selectedIndex + 1}.png`}
                          alt="Pokemon"
                          className="w-full h-full object-contain"
                          style={{ imageRendering: 'pixelated' }}
                        />
                        <span className="absolute bottom-2 right-2 text-xl sm:text-2xl font-bold text-[#303030] bg-yellow-300/80 px-2 py-0.5 rounded-lg border-2 border-[#303030]">
                          Lv.{caughtCounts[selectedIndex + 1] ?? 1}
                        </span>
                        </>
                      ) : !empty && seenPokemon.includes(selectedIndex + 1) ? (
                        <img
                          src={`/sprites/${selectedIndex + 1}.png`}
                          alt="Pokemon"
                          className="w-full h-full object-contain"
                          style={{ imageRendering: 'pixelated', filter: 'brightness(0)' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-black/10 flex items-center justify-center rounded-lg">
                          <span className="text-4xl text-black/20">?</span>
                        </div>
                      )}
                  </div>
                  </div>
                </div>

                {/* Right: List Area */}
                <PokemonList caughtPokemon = {caughtPokemon} selectedIndex = {selectedIndex} setSelectedIndex= {setSelectedIndex} filteredIndices = {displayedIndices} caughtCounts={caughtCounts}/>
              </div>

              {/* Stats Bar */}
              <div className="h-16 md:h-20 bg-[#808080] border-t-4 border-black/20 flex items-center px-4 md:px-8 justify-between text-white">
                <div className="flex flex-col items-center">
                  <span className="text-xs md:text-sm opacity-80">SEEN</span>
                  <span className="text-2xl md:text-3xl font-bold">{seenCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs md:text-sm opacity-80">OBTAINED</span>
                  <span className="text-2xl md:text-3xl font-bold">{caughtPokemon.length}</span>
                </div>
                    
                    <button
                      onClick={cycleFilter}
                      className="flex items-center justify-center gap-2 bg-black/20 w-40 md:w-48 px-3 md:px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
                    >
                      <span className="text-lg md:text-xl">Filter: {filterMode === 'all' ? 'All' : filterMode === 'seen' ? 'Seen' : 'Obtained'}</span>
                    </button>

                    <button 
                      onClick={onClose}
                      className="flex items-center gap-2 bg-black/20 px-3 md:px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
                    >
                      

                      <span className="text-lg md:text-xl">QUIT</span>
                    </button>
        
              </div>
            </div>

            {/* CONTROLS SCREEN */}
            <div className="h-48 sm:h-64 bg-[#B0B0A8] border-4 sm:border-8 border-[#303030] rounded-xl overflow-hidden flex relative shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              
              {/* Left Column: Buttons */}
              <div className="w-1/2 p-4 md:p-6 flex flex-col justify-center gap-3 md:gap-4 z-10">
                <BottomButton 
                  setIndex = {setIndex}
                  setSearchTerm = {setSearchTerm}
                  label="SEARCH" 
                  sub="POKÉMON" 
                  color="green" 
                  icon={<Search size={24} />} 
                />

              </div>

              {/* Center: Scroll Controls */}
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 md:gap-8 z-10">
                <ScrollButton onClick={handlePrev} direction="up" />
                <ScrollButton onClick={handleNext} direction="down" />
              </div>

              {/* Right Side: Pokeball Graphic */}
              <div className="flex-1 flex items-center justify-center p-1 sm:p-2 md:p-4 relative">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
                  {/* The Large Pokeball */}
                  <div className="absolute inset-0 rounded-full border-4 md:border-8 border-[#303030] overflow-hidden bg-white shadow-2xl">
                    <div className="h-1/2 bg-[#F04040]" />
                    <div className="absolute top-1/2 left-0 right-0 h-2 md:h-4 bg-[#303030] -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 bg-[#303030] rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 md:w-10 md:h-10 bg-white border-2 md:border-4 border-[#303030] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface BottomButtonProps {
  setIndex: Function;
  setSearchTerm: Function;
  label: string;
  sub: string;
  color: 'green' | 'teal' | 'lightGreen';
  icon: React.ReactNode;

}

const BottomButton: React.FC<BottomButtonProps> = ({ 
  setIndex, 
  setSearchTerm, 
  label, 
  sub, 
  color, 
  icon 
}) => {
  // Memoize colors object to prevent recreation on every render
  const colors = useMemo(() => ({
    green: "from-[#80C860] to-[#60A840] border-[#406030]",
    teal: "from-[#60C0C0] to-[#40A0A0] border-[#305050]",
    lightGreen: "from-[#A0D860] to-[#80B840] border-[#507030]",
  }), []);

  // Memoize the button classes
  const buttonClasses = useMemo(
    () => clsx(
      "w-full h-12 sm:h-16 md:h-20 bg-gradient-to-b border-b-4 border-r-4 rounded-2xl flex items-center px-3 md:px-4 gap-2 sm:gap-3 md:gap-4 active:translate-y-1 active:border-b-0 hover:brightness-90 transition-all",
      colors[color]
    ),
    [color, colors]
  );

  // Optimize the submit handler
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('searchValue') as string;

    // FIX: Check if it's a valid number string first
    const numValue = Number(searchValue);
    if (!isNaN(numValue) && searchValue.trim() !== '') {
      startTransition(() => setIndex(numValue - 1));
    } else {
      startTransition(() => setSearchTerm(searchValue));
    }
  }, [setIndex, setSearchTerm]);

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={buttonClasses}>
        <div className="flex-1 text-left min-w-0">
          <div className="text-lg md:text-2xl font-bold text-white tracking-tighter leading-tight truncate">
            {label}
          </div>
          <div className="text-base md:text-xl font-bold text-white/80 tracking-tighter leading-tight truncate">
            {sub}
          </div>
        </div>
        <div className="bg-white/20 p-1.5 md:p-2 rounded-full text-white flex-shrink-0">
          {icon}
        </div>
      </button>

      <input
        className="w-full h-10 sm:h-16 md:h-20 bg-white bg-opacity-10 border-b-4 border-r-4 rounded-2xl flex items-center px-3 md:px-4 gap-2 sm:gap-3 md:gap-4 active:translate-y-1 active:border-b-0 transition-all text-sm sm:text-base hover:brightness-90"
        type="text" 
        name="searchValue" 
        placeholder="Search ID or Name Here"
      />
    </form>
  );
};

const ScrollButton: React.FC<{ onClick: () => void; direction: 'up' | 'down' }> = ({ onClick, direction }) => (
  <button 
    onClick={onClick}
    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#D8D0] border-4 border-[#303030] rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:bg-black/20 transition-all"
  >
    <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 border-2 border-[#303030] rounded-full flex items-center justify-center">
      {direction === 'up' ? <ArrowUp size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <ArrowDown size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />}
    </div>
  </button>
);