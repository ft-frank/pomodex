import React,{useState} from 'react'
import { motion } from 'motion/react';
import RarityOdds from './RarityOdds' 

interface BattleStatsProps{
  
  rarity: string,
  catchChance: number,
  drainPercent:number,
  minutes:number,



}



const BattleStats: React.FC<BattleStatsProps> = ({rarity, catchChance, drainPercent, minutes}) => {

  const rarityColors: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    legendary: 'text-yellow-400',
    mythical: 'text-purple-400',
  };

  const [showRarityInfo, setShowRarityInfo] = useState(false)

  return (
    <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl p-1.5 sm:p-4 font-['VT323'] text-white w-[28vw] sm:w-56 md:w-64 shadow-2xl"
    >
              <div className="text-[10px] sm:text-xl font-bold border-b border-white/20 pb-0.5 sm:pb-2 mb-0.5 sm:mb-2 uppercase tracking-wider">Battle Stats</div>
              <div className="space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-base">
                <div className="flex justify-between">
                  <span className="text-white/60">Rarity</span>
                  <span className={`uppercase font-bold ${rarityColors[rarity]}`}>{rarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Catch</span>
                  <span className="font-bold">{catchChance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">HP Drain</span>
                  <span className="font-bold">{drainPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Timer</span>
                  <span className="font-bold">{minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Rerolls</span>
                  <span className="font-bold">{5 - (localStorage.getItem('rerollDate') === new Date().toDateString() ? Number(localStorage.getItem('rerollCount') || 0) : 0)} left</span>
                </div>
              </div>
              <button
                onClick={() => setShowRarityInfo(prev => !prev)}
                className="mt-1 sm:mt-3 pt-0.5 sm:pt-2 border-t border-white/20 w-full text-left text-[8px] sm:text-xs text-white/50 hover:text-white/80 transition-colors uppercase tracking-wider"
              >
                {showRarityInfo ? '▲ Hide' : '▼ View'} Odds
              </button>

              {showRarityInfo && <RarityOdds />}
      </ motion.div>


  )
} 

export default BattleStats