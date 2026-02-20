/* ============================================
   CHIACCHIO - Componente Spinner
   ============================================ */

import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
  className?: string;
}

export function Spinner({ size = 'medium', color = 'primary', className = '' }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}

interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = 'Cargando...' }: LoadingOverlayProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Spinner size="large" />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  text?: string;
}

export function InlineLoader({ text }: InlineLoaderProps) {
  return (
    <div className={styles.inlineLoader}>
      <div className={styles.container}>
        <Spinner size="medium" />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
}

export default Spinner;
