import React from 'react';
import { Play, Pause, RotateCcw, Backpack, Squirrel, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface BattleMenuProps {
  timerDisplay: string;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onOpenBag: () => void;
  onOpenPokemon: () => void;
  pokemonName: string;
}

export const BattleMenu: React.FC<BattleMenuProps> = ({
  timerDisplay,
  isActive,
  onToggle,
  onReset,
  onOpenBag,
  onOpenPokemon,
  pokemonName
}) => {
  return (
    <div className="w-full max-w-2xl bg-[#E8E8E8] border-4 border-[#303030] rounded-tl-3xl rounded-tr-3xl p-2 sm:p-4 shadow-2xl overflow-hidden font-['VT323']">
      <div className="flex flex-row gap-2 sm:gap-4 h-full">
        {/* Message Area */}
        <div className="flex-1 bg-white border-4 border-[#505050] rounded-xl p-2 sm:p-4 flex flex-col justify-center relative min-h-[90px] sm:min-h-[120px]">
          <p className="text-[#303030] text-lg sm:text-2xl uppercase tracking-wider">
            {isActive ? `${pokemonName} is watching...` : `Wild ${pokemonName} appeared!`}
          </p>
          <div className="mt-1 sm:mt-2 text-4xl sm:text-6xl font-bold text-[#303030] flex items-center gap-2">
            {timerDisplay}
          </div>
          {/* Decorative arrow usually found in Pokemon games */}
          <div className="absolute bottom-2 right-4 animate-bounce text-[#303030]">▼</div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-36 sm:w-72 shrink-0">
          <BattleButton 
            onClick={onToggle} 
            variant="fight" 
            icon={isActive ? <Pause size={20} /> : <Play size={20} />}
            label={isActive ? "PAUSE" : "FIGHT"} 
          />
          <BattleButton 
            onClick={onOpenBag} 
            variant="bag" 
            icon={<Backpack size={20} />}
            label="BAG" 
          />
          <BattleButton 
            onClick={onOpenPokemon} 
            variant="pokemon" 
            icon={<Squirrel size={20} />}
            label="POKEMON" 
          />
          <BattleButton 
            onClick={onReset} 
            variant="run" 
            icon={<LogOut size={20} />}
            label="RUN" 
          />
        </div>
      </div>
    </div>
  );
};

interface BattleButtonProps {
  label: string;
  onClick: () => void;
  variant: 'fight' | 'bag' | 'pokemon' | 'run';
  icon: React.ReactNode;
}

const BattleButton: React.FC<BattleButtonProps> = ({ label, onClick, variant, icon }) => {
  const colors = {
    fight: "bg-[#FF5A5A] hover:bg-[#FF4040] border-[#9B0000] text-white",
    bag: "bg-[#FFCC00] hover:bg-[#FFB700] border-[#9B7B00] text-[#303030]",
    pokemon: "bg-[#6BCB77] hover:bg-[#4EAF5B] border-[#2D6A4F] text-white",
    run: "bg-[#4D96FF] hover:bg-[#3282F6] border-[#0051B8] text-white",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative h-11 sm:h-16 rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-between px-2 sm:px-4 font-bold tracking-widest text-sm sm:text-xl uppercase group overflow-hidden font-['VT323']",
        colors[variant]
      )}
    >
      <span>{label}</span>
      <span className="opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />
    </button>
  );
};
