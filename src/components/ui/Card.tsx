/* ============================================
   CHIACCHIO - Componente Card
   ============================================ */

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  compact?: boolean;
  borderless?: boolean;
  featured?: boolean;
}

export function Card({
  children,
  className = '',
  hoverable = false,
  compact = false,
  borderless = false,
  featured = false,
}: CardProps) {
  const classNames = [
    styles.card,
    hoverable && styles.hoverable,
    compact && styles.compact,
    borderless && styles.borderless,
    featured && styles.featured,
    className
  ].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
}

interface CardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  children,
  className = '',
}: CardHeaderProps) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div>
        <h3 className={styles.headerTitle}>{title}</h3>
        {description && (
          <p className={styles.headerDescription}>{description}</p>
        )}
      </div>
      {children && <div className={styles.headerActions}>{children}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}

export default Card;
