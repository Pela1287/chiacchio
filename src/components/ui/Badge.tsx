/* ============================================
   CHIACCHIO - Componente Badge
   ============================================ */

import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  outline?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  outline = false,
  className = '',
}: BadgeProps) {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    outline && styles.outline,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

export default Badge;
