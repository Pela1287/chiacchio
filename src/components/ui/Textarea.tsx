/* ============================================
   CHIACCHIO - Componente Textarea
   ============================================ */

import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  className = '',
  id,
  required,
  value,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const textareaClasses = [
    styles.textarea,
    error && styles.error,
    className
  ].filter(Boolean).join(' ');

  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        required={required}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {error && (
          <span className={styles.errorMessage}>{error}</span>
        )}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
        {showCharCount && (
          <span className={styles.charCounter}>
            {charCount}{maxLength && ` / ${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
}

export default Textarea;
