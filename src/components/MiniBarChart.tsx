'use client';

import { motion } from 'framer-motion';

interface MiniBarChartProps {
  data: { label: string; value: number; icon: string }[];
  maxValue?: number;
}

export default function MiniBarChart({ data, maxValue = 100 }: MiniBarChartProps) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-white">{item.label}</span>
            </div>
            <span className="text-xs font-bold text-white/80">{item.value}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(186, 230, 253, 1) 0%, 
                    rgba(147, 197, 253, 1) 50%, 
                    rgba(125, 211, 252, 1) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

