'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}





