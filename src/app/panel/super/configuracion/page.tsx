'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge, Button, LoadingOverlay, useToast } from '@/components/ui';
import styles from './page.module.css';

interface Configuracion {
  id: string;
  clave: string;
  valor: string;
  descripcion: string | null;
}

export default function ConfiguracionPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [configs, setConfigs] = useState<Configuracion[]>([]);
  const [editando, setEditando] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  const fetchConfiguracion = async () => {
    try {
      const res = await fetch('/api/configuracion');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
        
        const inicial: Record<string, string> = {};
        data.forEach((c: Configuracion) => {
          inicial[c.clave] = c.valor;
        });
        setEditando(inicial);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfig = async (clave: string) => {
    setGuardando(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, valor: editando[clave] }),
      });

      const result = await res.json();

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Configuración guardada',
          message: `${clave} actualizado correctamente`
        });
        fetchConfiguracion();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: result.error || 'No se pudo guardar'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setGuardando(false);
    }
  };

  const renderCampo = (config: Configuracion) => {
    const valor = editando[config.clave] || config.valor;
    const cambio = valor !== config.valor;

    if (config.clave.includes('descuento')) {
      return (
        <div className={styles.campo}>
          <input
            type="number"
            min="0"
            max="100"
            value={valor}
            onChange={(e) => setEditando({ ...editando, [config.clave]: e.target.value })}
            className={`${styles.configInput} ${cambio ? styles.cambiado : ''}`}
          />
          <span className={styles.unidad}>%</span>
        </div>
      );
    }

    if (config.clave.includes('precio')) {
      return (
        <div className={styles.campo}>
          <span className={styles.moneda}>$</span>
          <input
            type="number"
            min="1000"
            max="100000"
            value={valor}
            onChange={(e) => setEditando({ ...editando, [config.clave]: e.target.value })}
            className={`${styles.configInput} ${cambio ? styles.cambiado : ''}`}
          />
        </div>
      );
    }

    if (config.clave.includes('whatsapp') || config.clave.includes('telefono')) {
      return (
        <input
          type="tel"
          value={valor}
          onChange={(e) => setEditando({ ...editando, [config.clave]: e.target.value })}
          className={`${styles.configInput} ${cambio ? styles.cambiado : ''}`}
          placeholder="+5492216011455"
        />
      );
    }

    return (
      <input
        type="text"
        value={valor}
        onChange={(e) => setEditando({ ...editando, [config.clave]: e.target.value })}
        className={`${styles.configInput} ${cambio ? styles.cambiado : ''}`}
      />
    );
  };

  const getCategoria = (clave: string): string => {
    if (clave.includes('membresia') || clave.includes('descuento')) return 'Precios y Descuentos';
    if (clave.includes('whatsapp') || clave.includes('telefono')) return 'WhatsApp';
    if (clave.includes('mercado_pago') || clave.includes('pago')) return 'Pagos';
    return 'General';
  };

  const categorias = Array.from(new Set(configs.map(c => getCategoria(c.clave))));

  if (loading) {
    return <LoadingOverlay text="Cargando configuración..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configuración del Sistema</h1>
      </div>

      {categorias.map(categoria => {
        const configsCategoria = configs.filter(c => getCategoria(c.clave) === categoria);

        return (
          <div key={categoria} className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>{categoria}</h2>

            <div className={styles.configGrid}>
              {configsCategoria.map(config => {
                const cambio = editando[config.clave] !== config.valor;

                return (
                  <div key={config.id} className={styles.configCard}>
                    <div className={styles.configHeader}>
                      <div>
                        <div className={styles.configClave}>{config.clave}</div>
                        {config.descripcion && (
                          <div className={styles.configDesc}>{config.descripcion}</div>
                        )}
                      </div>
                      {cambio && <Badge variant="warning">Sin guardar</Badge>}
                    </div>

                    <div className={styles.configBody}>
                      {renderCampo(config)}
                    </div>

                    {cambio && (
                      <div className={styles.configFooter}>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setEditando({ 
                            ...editando, 
                            [config.clave]: config.valor 
                          })}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          loading={guardando}
                          onClick={() => guardarConfig(config.clave)}
                        >
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className={styles.advertencia}>
        <strong>⚠️ Advertencia:</strong> Los cambios en la configuración afectan 
        inmediatamente a todo el sistema. Verifica los valores antes de guardar.
      </div>
    </div>
  );
}
