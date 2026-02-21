/* ============================================
   CHIACCHIO - Componente Avatar
   ============================================ */

import React from 'react';
import { getIniciales } from '@/lib/helpers';
import styles from './Avatar.module.css';

interface AvatarProps {
  nombre: string;
  apellido?: string;
  imagen?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'gray' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Avatar({
  nombre,
  apellido = '',
  imagen,
  size = 'medium',
  color = 'primary',
  className = '',
}: AvatarProps) {
  const iniciales = getIniciales(nombre, apellido);

  return (
    <div className={`${styles.avatar} ${styles[size]} ${styles[color]} ${className}`}>
      {imagen ? (
        <img src={imagen} alt={`${nombre} ${apellido}`} className={styles.image} />
      ) : (
        <span>{iniciales}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{
    nombre: string;
    apellido?: string;
    imagen?: string;
  }>;
  max?: number;
  size?: 'small' | 'medium' | 'large';
}

export function AvatarGroup({ users, max = 4, size = 'small' }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={styles.group}>
      {visibleUsers.map((user, index) => (
        <div key={index} className={`${styles.avatar} ${styles[size]} ${styles.groupItem}`}>
          {user.imagen ? (
            <img src={user.imagen} alt={user.nombre} className={styles.image} />
          ) : (
            <span>{getIniciales(user.nombre, user.apellido || '')}</span>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${styles.avatar} ${styles[size]} ${styles.groupItem} ${styles.more}`}>
          <span>+{remaining}</span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
