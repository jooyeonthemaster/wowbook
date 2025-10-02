'use client';

import { motion } from 'framer-motion';

interface WeatherIconProps {
  type: 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy' | 'sunny';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export default function WeatherIcon({ type, size = 'md', animate = true }: WeatherIconProps) {
  const sizeClasses = {
    sm: 'text-5xl',
    md: 'text-7xl',
    lg: 'text-9xl',
    xl: 'text-[10rem]',
  };

  const icons = {
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    'partly-cloudy': '🌤️',
    sunny: '☀️',
  };

  const Container = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { 
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
      delay: 0.1 
    }
  } : {};

  return (
    <Container 
      className={`${sizeClasses[size]} leading-none icon-3d floating`}
      style={{
        filter: `
          drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))
          drop-shadow(0 0 40px rgba(255, 255, 255, 0.6))
          drop-shadow(0 0 60px rgba(255, 255, 255, 0.3))
        `,
      }}
      {...animationProps}
    >
      {icons[type]}
    </Container>
  );
}

