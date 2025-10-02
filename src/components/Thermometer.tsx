'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ThermometerProps {
  value: number;
  height?: number;
  label?: string;
}

export default function Thermometer({ value, height = 200, label }: ThermometerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ height: `${height}px`, width: '60px' }}>
        {/* 온도계 배경 */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 w-8 rounded-full overflow-hidden"
          style={{ 
            height: `${height - 30}px`,
            top: 0,
            background: 'rgba(255, 255, 255, 0.2)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* 채워지는 부분 */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 rounded-full"
            style={{
              background: `linear-gradient(to top, 
                rgba(125, 211, 252, 1) 0%, 
                rgba(147, 197, 253, 1) 50%, 
                rgba(186, 230, 253, 1) 100%)`,
              boxShadow: '0 0 20px rgba(147, 197, 253, 0.4)'
            }}
          />
          
          {/* 눈금 표시 */}
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute right-0 w-2 h-0.5 bg-white/30"
              style={{ bottom: `${mark}%` }}
            />
          ))}
        </div>
        
        {/* 하단 원형 */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            bottom: 0,
            background: `linear-gradient(135deg, rgba(125, 211, 252, 1), rgba(186, 230, 253, 1))`,
            boxShadow: '0 4px 20px rgba(147, 197, 253, 0.5)'
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white font-bold text-sm"
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>
      
      {label && (
        <p className="text-sm font-semibold text-white/90">{label}</p>
      )}
    </div>
  );
}

