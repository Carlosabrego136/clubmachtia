'use client';

import React from 'react';

type Direction = 'up' | 'down' | 'scale';

const DIRECTION_CLASS: Record<Direction, string> = {
  up: 'animate-fade-up',
  down: 'animate-fade-down',
  scale: 'animate-fade-scale',
};

export default function Animate({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
}) {
  return (
    <div
      className={`opacity-0 ${DIRECTION_CLASS[direction]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
