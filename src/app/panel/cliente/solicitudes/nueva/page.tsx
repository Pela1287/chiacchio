/* =====================================   CHIACCHIO - Nueva Solicitud de Servicio
   Sistema de Mantenimiento Eléctrico Domiciliario
   ============================================ */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay } from '@/components/ui';
import styles from './page.module.css';

// Solo trabajos eléctricos
const tiposTrabajoElectrico = [
  { value: 'corte_luz', label: '⚡ Corte de luz general', descripcion: 'Sin electricidad en toda la casa' },
  { value: 'termica', label: '🔌 Salta la térmica/diferencial', descripcion: 'La llave se baja constantemente' },
  { value: 'toma_corriente', label: '🔋 Toma corriente dañado', descripcion: 'Enchufe quemado o sin funcionamiento' },
  { value: 'interruptor', label: '💡 Interruptor dañado', descripcion: 'No prende/apaga la luz correctamente' },
  { value: 'lampara', label: '💡 Lámpara/Luminiaria', descripcion: 'Problemas con lamparitas o artefactos' },
  { value: 'tablero', label: '🏭 Tablero eléctrico', descripcion: 'Problemas en el tablero principal' },
  { value: 'puesta_tierra', label: '🌱 Puesta a tierra', descripcion: 'Instalación de toma de tierra' },
  { value: 'cableado', label: '🔗 Cableado nuevo', descripcion: 'Tendido de cables eléctricos' },
