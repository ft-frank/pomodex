import React from 'react';
import { X, Clock, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BagModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
  onSetMinutes: (min: number) => void;
}

const BagModal: React.FC<BagModalProps> = ({ isOpen, onClose, minutes, onSetMinutes }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#F0F0F0] border-4 border-[#303030] rounded-2xl overflow-hidden shadow-2xl font-['VT323']"
          >
            {/* Header */}
            <div className="bg-[#FFCC00] p-4 flex justify-between items-center border-b-4 border-[#303030]">
              <h2 className="text-3xl font-bold text-[#303030] tracking-wider uppercase">YOUR BAG</h2>
              <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-white border-4 border-[#303030] rounded-xl flex items-center justify-center">
                  <Clock size={40} className="text-[#303030]" />
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold text-gray-500 uppercase tracking-tighter">Item: Timer Settings</span>
                  <p className="text-lg text-gray-400">Adjust the duration of your focus session.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onSetMinutes(Math.max(5, minutes - 5))}
                  className="w-12 h-12 bg-white border-2 border-[#303030] rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-6xl font-bold">{minutes}</span>
                  <span className="text-lg font-bold text-gray-400 uppercase">MINUTES</span>
                </div>
                <button 
                  onClick={() => onSetMinutes(Math.min(60, minutes + 5))}
                  className="w-12 h-12 bg-white border-2 border-[#303030] rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-[#6BCB77] border-b-4 border-[#2D6A4F] text-white font-bold rounded-xl active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-2xl"
              >
                Confirm Time
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BagModal;
