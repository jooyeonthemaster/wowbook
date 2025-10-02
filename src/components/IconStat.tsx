'use client';

import { motion } from 'framer-motion';

interface IconStatProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
  delay?: number;
}

export default function IconStat({ 
  icon, 
  value, 
  label, 
  color = 'rgba(147, 197, 253, 1)',
  delay = 0 
}: IconStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center justify-center p-4 rounded-2xl glass"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      }}
    >
      <div 
        className="text-4xl mb-2 w-14 h-14 flex items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${color}30, ${color}20)`,
          boxShadow: `0 4px 12px ${color}40`
        }}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/70 text-center">{label}</div>
    </motion.div>
  );
}

