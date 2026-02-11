import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Book, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import PokemonList from "./PokemonList"
import { usePokemonFilter } from '../utils/usePokemonFilter'



interface PokedexModalProps {
  isOpen: boolean;
  onClose: () => void;
  caughtPokemon: number[];
}

// React-Window

// function Window({ names }: { names: string[] }) {
//   return (
//     <List
//       rowComponent={RowComponent}
//       rowCount={names.length}
//       rowHeight={25}
//       rowProps={{ names }}
//     />
//   );
// }




// Gen 4 End is 493. We'll show a range.


export const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose, caughtPokemon }) => {
  const [searchTerm, setSearchTerm] = useState(null) 
  const listRef = useRef<HTMLDivElement>(null);
  const filteredPokemonIndices = usePokemonFilter(searchTerm);
  const [selectedIndex, setSelectedIndex] = useState(0);
  

  
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
  if (filteredPokemonIndices.length > 0) {
    setSelectedIndex(filteredPokemonIndices[0]);
  }
}, [filteredPokemonIndices])

  const setIndex = function(index: number) {
    setSelectedIndex(index)
  }

  const handleNext = () => {  const currentPosition = filteredPokemonIndices.indexOf(selectedIndex);
    if (currentPosition < filteredPokemonIndices.length - 1) {
      setSelectedIndex(filteredPokemonIndices[currentPosition + 1]);
    }
    
  }

  const handlePrev = () => { const currentPosition = filteredPokemonIndices.indexOf(selectedIndex);
    if (currentPosition > 0) {
      setSelectedIndex(filteredPokemonIndices[currentPosition - 1]);
    }
    
  }

  // Mock seen count (caught + some random "seen" ones)
    const seenCount = caughtPokemon.length //change later

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['VT323']">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col gap-2 w-full h-full"
          >
            {/* MAIN DISPLAY SCREEN */}
            <div className="flex-1 bg-[#D8D8D0] border-8 border-[#303030] rounded-xl overflow-hidden flex flex-col relative shadow-2xl min-h-0">
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
              <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden min-h-0">
                {/* Left: Sprite Display */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 min-h-0">
                  <div className="w-full h-full max-h-96 md:max-h-none bg-white border-4 border-[#A0A098] rounded-2xl p-4 flex items-center justify-center relative shadow-inner">
                    <div className="absolute inset-0 border-4 border-yellow-200/50 rounded-xl pointer-events-none" />
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                            src={`sprites/${selectedIndex + 1}.png`} 
                            alt="Pokemon"
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                        />
                      {!caughtPokemon.includes(selectedIndex + 1) && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <span className="text-4xl text-black/20">?</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: List Area */}
                <PokemonList caughtPokemon = {caughtPokemon} selectedIndex = {selectedIndex} setSelectedIndex= {setSelectedIndex} filteredIndices = {filteredPokemonIndices}/>
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
                  onClick={onClose}
                  className="flex items-center gap-2 bg-black/20 px-3 md:px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white rounded-full flex items-center justify-center text-xs">B</div>
                  <span className="text-lg md:text-xl">QUIT</span>
                </button>
              </div>
            </div>

            {/* CONTROLS SCREEN */}
            <div className="h-64 bg-[#B0B0A8] border-8 border-[#303030] rounded-xl overflow-hidden flex relative shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              
              {/* Left Column: Buttons */}
              <div className="w-1/2 p-4 md:p-6 flex flex-col justify-center gap-3 md:gap-4 z-10">
                <BottomButton 
                  setIndex = {setIndex}
                  indices = {filteredPokemonIndices}
                  setSearchTerm = {setSearchTerm}
                  label="SEARCH" 
                  sub="POKÉMON" 
                  color="green" 
                  icon={<Search size={24} />} 
                />

              </div>

              {/* Center: Scroll Controls */}
              <div className="flex flex-col items-center justify-center gap-6 md:gap-8 z-10">
                <ScrollButton onClick={handlePrev} direction="up" />
                <ScrollButton onClick={handleNext} direction="down" />
              </div>

              {/* Right Side: Pokeball Graphic */}
              <div className="flex-1 flex items-center justify-center p-2 md:p-4 relative">
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
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
  indices: number[];
  setSearchTerm: Function;
  label: string;
  sub: string;
  color: 'green' | 'teal' | 'lightGreen';
  icon: React.ReactNode;

}

const BottomButton: React.FC<BottomButtonProps> = ({ setIndex, indices, setSearchTerm, label, sub, color, icon }) => {
  

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get('searchValue') as string;
        
        if (typeof searchValue == "number") {
            const numValue = Number(searchValue);
            setIndex(numValue - 1);
        }
        else if (typeof searchValue == "string") {
          setSearchTerm(searchValue)
    
        }
    };


  const colors = {
    green: "from-[#80C860] to-[#60A840] border-[#406030]",
    teal: "from-[#60C0C0] to-[#40A0A0] border-[#305050]",
    lightGreen: "from-[#A0D860] to-[#80B840] border-[#507030]",
  };

  return (
    <>
        <form onSubmit = {handleSubmit}>
            <button type = "submit"  className={clsx(
            "w-full h-16 md:h-20 bg-gradient-to-b border-b-4 border-r-4 rounded-2xl flex items-center px-3 md:px-4 gap-3 md:gap-4 active:translate-y-1 active:border-b-0 transition-all",
            colors[color]
            )}>
            <div className="flex-1 text-left min-w-0">
                <div className="text-lg md:text-2xl font-bold text-white tracking-tighter leading-tight truncate">{label}</div>
                <div className="text-base md:text-xl font-bold text-white/80 tracking-tighter leading-tight truncate">{sub}</div>
            </div>
            <div className="bg-white/20 p-1.5 md:p-2 rounded-full text-white flex-shrink-0">
                {icon}
            </div>
            </button>

            <input className = "w-full h-16 md:h-20 bg-white bg-opacity-10 border-b-4 border-r-4 rounded-2xl flex items-center px-3 md:px-4 gap-3 md:gap-4 active:translate-y-1 active:border-b-0 transition-all"
            
            type = "text" name = "searchValue" placeholder = "Search ID or Name Here"></input>
        </form>        
      
    </>
  );
};

const ScrollButton: React.FC<{ onClick: () => void; direction: 'up' | 'down' }> = ({ onClick, direction }) => (
  <button 
    onClick={onClick}
    className="w-12 h-12 md:w-16 md:h-16 bg-[#D8D0] border-4 border-[#303030] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
  >
    <div className="w-9 h-9 md:w-12 md:h-12 border-2 border-[#303030] rounded-full flex items-center justify-center">
      {direction === 'up' ? <ArrowUp size={20} className="md:w-6 md:h-6" /> : <ArrowDown size={20} className="md:w-6 md:h-6" />}
    </div>
  </button>
);