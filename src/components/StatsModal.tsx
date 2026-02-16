import React from 'react';
import { X, User, Trophy, Clock, Target, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFocusTime: number; // in minutes
  totalCaught: number;
  totalSessions: number;
  caughtCounts: Record<number, number>;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  totalFocusTime,
  totalCaught,
  totalSessions,
  caughtCounts
}) => {
  const totalCatches = Object.values(caughtCounts).reduce((sum, n) => sum + n, 0);
  const successRate = totalSessions > 0 ? Math.round(totalCatches / totalSessions * 100) : 0;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-['VT323']">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-2xl bg-[#E0E0E0] border-[6px] border-[#303030] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="bg-[#4169E1] p-4 flex justify-between items-center border-b-[6px] border-[#303030]">
              <div className="flex items-center gap-3">
                <User className="text-white" size={32} />
                <h2 className="text-4xl font-bold text-white tracking-widest uppercase">TRAINER CARD</h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#87CEEB]/20">
              
              {/* Left Column: Trainer Sprite Area */}
              <div className="space-y-6">
                <div className="aspect-square bg-white border-4 border-[#303030] rounded-2xl flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px]" />
                   <div className="relative z-10 flex flex-col items-center">
                     <img 
                       src="public/pokemonTrainer.png" 
                       alt="Trainer" 
                       className="w-48 h-48 image-pixelated"
                     />
                     <span className="text-2xl font-bold text-[#303030] -mt-4"> </span>
                   </div>
                </div>
                
                <div className="bg-white/80 border-4 border-[#303030] p-4 rounded-xl">
                  <div className="text-xl text-gray-500 uppercase font-bold mb-1">Trainer Rank</div>
                  <div className="text-3xl text-[#4169E1] font-bold uppercase">{getRank(totalFocusTime)}</div>
                </div>
              </div>

              {/* Right Column: Statistics */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Clock size={18} /> Focus Time
                    </span>
                    <span className="text-5xl font-bold text-[#303030]">{formatTotalTime(totalFocusTime)}</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Trophy size={18} /> Pokedex Caught
                    </span>
                    <span className="text-5xl font-bold text-[#303030]">{totalCaught} / 493</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Target size={18} /> Sessions
                    </span>
                    <span className="text-5xl font-bold text-[#303030]">{totalSessions}</span>
                  </div>

                  <div className="flex flex-col border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-xl text-gray-500 uppercase font-bold flex items-center gap-2">
                      <Star size={18} /> Catch Rate
                    </span>
                    <span className="text-5xl font-bold text-[#303030]">{successRate}%</span>
                  </div>
                </div>

                <div className="bg-[#FFCC00] border-4 border-[#303030] p-3 rounded-xl flex items-center gap-3">
                   <Star className="text-[#303030] fill-current" size={24} />
                   <div>
                     <div className="text-sm font-bold uppercase text-[#303030]">Pokemon Points</div>
                     <div className="text-2xl font-bold text-[#303030]">{totalFocusTime * 10}P</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="p-6 bg-white border-t-[6px] border-[#303030]">
              <div className="text-xl font-bold uppercase text-gray-400 mb-4 tracking-widest text-center">Milestone Badges</div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                {badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group relative">
                    <div 
                      className={`w-12 h-12 rounded-full border-2 border-[#303030] flex items-center justify-center transition-all ${
                        badge.earned ? 'bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg' : 'bg-gray-200 grayscale opacity-40'
                      }`}
                    >
                      {badge.earned ? (
                        <div className="w-8 h-8 rounded-full bg-white/30 animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-400" />
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
              <span className="text-white text-sm uppercase tracking-widest opacity-50">Sinnoh Region Focus League</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
