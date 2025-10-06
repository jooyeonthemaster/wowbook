'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  delay?: number;
}

export default function StatCard({ icon, label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        borderColor: `${color}40`,
      }}
    >
      {/* 배경 장식 */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
        style={{ background: color }}
      />
      
      <div className="relative z-10">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-lg text-white/70">%</span>
        </div>
        <p className="text-sm text-white/80 mt-1 font-medium">{label}</p>
      </div>

      {/* 프로그레스 바 */}
      <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.3, duration: 1 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
}


