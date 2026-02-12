import React from 'react';
import { motion } from 'motion/react';

interface PokemonSpriteProps {
  id: number;
  isCatching?: boolean;
}

export const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, isCatching }) => {
  // Using downloaded sprites
  const spriteUrl = `/sprites/${id}.png`;

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Gen 4 Battle Platform / Circle */}
      <div className="absolute bottom-16 w-56 h-16 bg-[#D8E8D0] border-t-2 border-b-8 border-[#B8C8A8] rounded-[100%] shadow-lg overflow-hidden flex items-center justify-center">
         {/* Texture/Grass detail inside platform */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#507030 1px, transparent 0)', backgroundSize: '10px 10px' }} />
      </div>
      
      <motion.div
        key={id}
        animate={isCatching ? {
          scale: [1, 1.2, 0],
          y: [0, -50, 0],
          rotate: [0, 360, 720],
          opacity: [1, 1, 0]
        } : {
          y: [0, -8, 0],
        }}
        transition={isCatching ? {
          duration: 1,
          ease: "easeInOut"
        } : {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 -mt-12"
      >
        <img
          src={spriteUrl}
          alt="Pokemon"
          className="w-48 h-48 image-render-pixel"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      {isCatching && (
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: [0, 1.2, 1], y: [100, -20, 0] }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute z-20"
        >
          <img 
            src="src/assets/imgs/poke-ball.png"
            alt="Pokeball" 
            className="w-12 h-12"
            style={{ imageRendering: 'pixelated' }}
          />
        </motion.div>
      )}
    </div>
  );
};
