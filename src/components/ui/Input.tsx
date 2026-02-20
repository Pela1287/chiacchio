/* ============================================
   CHIACCHIO - Componente Input
   ============================================ */

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  size = 'medium',
  icon,
  iconRight,
  className = '',
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = [
    styles.input,
    error && styles.error,
    icon && styles.hasIcon,
    iconRight && styles.hasIconRight,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${styles.inputWrapper} ${styles[size]}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          className={inputClasses}
          required={required}
          {...props}
        />
        {iconRight && <span className={`${styles.icon} ${styles.iconRight}`}>{iconRight}</span>}
      </div>
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
      {helperText && !error && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
}

export default Input;
