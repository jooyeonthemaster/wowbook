'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-white">
          질문 {current} / {total}
        </span>
        <span className="text-xs font-semibold text-white/80">
          {Math.round(percentage)}%
        </span>
      </div>
      <div 
        className="w-full h-2 rounded-full overflow-hidden relative" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{ 
            background: `linear-gradient(90deg, rgba(186, 230, 253, 1) 0%, rgba(147, 197, 253, 1) 50%, rgba(125, 211, 252, 1) 100%)`,
            boxShadow: '0 0 20px rgba(147, 197, 253, 0.6), 0 0 40px rgba(147, 197, 253, 0.3)'
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

