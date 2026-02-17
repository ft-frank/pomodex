import React, { useEffect } from 'react';
import { X, User, Trophy, Clock, Target, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFocusTime: number; // in minutes
  totalCaught: number;
  totalSessions: number;
  totalAttempts: number;
  caughtCounts: Record<number, number>;
}

const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  totalFocusTime,
  totalCaught,
  totalSessions,
  totalAttempts,
  caughtCounts
}) => {
  const totalCatches = Object.values(caughtCounts).reduce((sum, n) => sum + n, 0);
  const successRate = totalSessions > 0 ? Math.round(totalCatches / totalAttempts * 100) : 0;
  const sessionFocusTime = Number(sessionStorage.getItem('pomodex-session-focus') ?? 0);
  const formatTotalTime = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m}m`;
  };

  // Calculate Rank
  const getRank = (mins: number) => {
    if (mins >= 1000) return "Master Trainer";
    if (mins >= 500) return "Elite Focus";
    if (mins >= 200) return "Ace Student";
    if (mins >= 60) return "Focused Trainer";
    return "Rookie Trainer";
  };

  useEffect(() => {

    if (!isOpen) return;

    const handleKeyDown= (e: KeyboardEvent) => {

      if (e.key == "Escape") {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown);

  } , 
  
  
  [isOpen, onClose])

  const badges = [
    { name: '10 Sessions', earned: totalSessions >= 10 },
    { name: '50 Sessions', earned: totalSessions >= 50 },
    { name: '100 Sessions', earned: totalSessions >= 100 },
    { name: '24hr Focus', earned: totalFocusTime >= 1440 },
    { name: '100hr Focus', earned: totalFocusTime >= 6000 },
    { name: '50 Caught', earned: totalCaught >= 50 },
    { name: '150 Caught', earned: totalCaught >= 150 },
    { name: 'Catch em All', earned: totalCaught >= 493 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md font-['VT323']">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-2xl max-h-full bg-[#E0E0E0] border-4 sm:border-[6px] border-[#303030] rounded-2xl sm:rounded-3xl overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="bg-[#4169E1] p-3 sm:p-4 flex justify-between items-center border-b-4 sm:border-b-[6px] border-[#303030]">
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="text-white" size={24} />
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">TRAINER CARD</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 bg-[#87CEEB]/20">

              {/* Left Column: Trainer Sprite Area */}
              <div className="space-y-4 sm:space-y-6">
                <div className="aspect-square bg-white border-4 border-[#303030] rounded-2xl flex items-center justify-center relative overflow-hidden group max-h-48 sm:max-h-none">
                   <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px]" />
                   <div className="relative z-10 flex flex-col items-center">
                     <img
                       src="/pokemonTrainer.png"
                       alt="Trainer"
                       className="w-28 h-28 sm:w-48 sm:h-48 image-pixelated"
                     />
                     <span className="text-xl sm:text-2xl font-bold text-[#303030] -mt-4"> </span>
                   </div>
                </div>

                <div className="bg-white/80 border-4 border-[#303030] p-3 sm:p-4 rounded-xl">
                  <div className="text-lg sm:text-xl text-gray-500 uppercase font-bold mb-1">Trainer Rank</div>
                  <div className="text-2xl sm:text-3xl text-[#4169E1] font-bold uppercase">{getRank(totalFocusTime)}</div>
                </div>

                <div className="bg-[#FFCC00] border-4 border-[#303030] p-2 sm:p-3 rounded-xl flex items-center gap-3">
                   <Star className="text-[#303030] fill-current" size={20} />
                   <div>
                     <div className="text-xs sm:text-sm font-bold uppercase text-[#303030]">Pokemon Points</div>
                     <div className="text-xl sm:text-2xl font-bold text-[#303030]">{totalFocusTime * 10}P</div>
                   </div>
                </div>
              </div>

              {/* Right Column: Statistics */}
              <div className="flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-lg sm:text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Clock size={16} /> Focus Time
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-[#303030]">{formatTotalTime(totalFocusTime)}</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-lg sm:text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Clock size={16} /> This Session
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-[#303030]">{formatTotalTime(sessionFocusTime)}</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-lg sm:text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Trophy size={16} /> Pokedex Caught
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-[#303030]">{totalCaught} / 493</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-lg sm:text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Target size={16} /> Sessions
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-[#303030]">{totalSessions}</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-lg sm:text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Star size={16} /> Catch Rate
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-[#303030]">{successRate}%</span>
                  </div>
                </div>

                
              </div>
            </div>

            {/* Badges Section */}
            <div className="p-4 sm:p-6 bg-white border-t-4 sm:border-t-[6px] border-[#303030]">
              <div className="text-lg sm:text-xl font-bold uppercase text-gray-400 mb-3 sm:mb-4 tracking-widest text-center">Milestone Badges</div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
                {badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group relative">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#303030] flex items-center justify-center transition-all ${
                        badge.earned ? 'bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg' : 'bg-gray-200 grayscale opacity-40'
                      }`}
                    >
                      {badge.earned ? (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30 animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-400" />
                      )}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Overlay */}
            <div className="bg-[#303030] p-2 text-center">
              <span className="text-white text-xs sm:text-sm uppercase tracking-widest opacity-50">Sinnoh Region Focus League</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
