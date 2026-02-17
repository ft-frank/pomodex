import React from 'react'
import { motion } from 'motion/react';

interface RarityOddsProps {

}

const RarityOdds: React.FC<RarityOddsProps> = () => {
  return (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ height: { duration: 0.25 }, opacity: { duration: 0.2, delay: 0.15 } }}
        className="mt-1 sm:mt-3 bg-white rounded p-1.5 sm:p-3 text-[#303030] overflow-hidden"
    >
    <div className="text-[9px] sm:text-base font-bold border-b border-gray-200 pb-0.5 sm:pb-2 mb-0.5 sm:mb-2 uppercase tracking-wider">Rarity Odds</div>
    <div className="space-y-0.5 sm:space-y-1.5 text-[8px] sm:text-sm">
    {[
        { tier: 'Common', weight: 60, color: 'bg-gray-400' },
        { tier: 'Uncommon', weight: 25, color: 'bg-green-500' },
        { tier: 'Rare', weight: 10, color: 'bg-blue-500' },
        { tier: 'Legendary', weight: 4, color: 'bg-yellow-500' },
        { tier: 'Mythical', weight: 1, color: 'bg-purple-500' },
    ].map(({ tier, weight, color }) => (
        <div key={tier} className="flex items-center gap-1 sm:gap-2">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${color} shrink-0`} />
        <span className="flex-1 uppercase">{tier}</span>
        <span className="font-bold">{weight}%</span>
        </div>
    ))}
    </div>
    </motion.div> )}
  


export default RarityOdds



