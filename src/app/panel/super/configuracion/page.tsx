/* ============================================
   CHIACCHIO - Panel Super Usuario - Configuracion
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Badge, LoadingOverlay, useToast } from '@/components/ui';
import styles from '../../admin/page.module.css';

interface ConfigItem {
  id: string;
  clave: string;
  valor: string;
  descripcion?: string;
}

export default function ConfiguracionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [config, setConfig] = useState({
    nombreEmpresa: 'Chiacchio',
    direccionEmpresa: '',
    telefonoEmpresa: '',
    emailEmpresa: '',
    precioMembresia: '9900',
    moneda: 'ARS',
    ivaPorcentaje: '21',
  });

  useEffect(() => {
    if (session?.user) {
      const userRole = (session.user as any).role || (session.user as any).rol;
      if (userRole !== 'SUPER') {
        router.push('/panel');
        return;
      }
      fetchConfig();
    }
  }, [session, router]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/configuracion');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          // Mapear configuración a objeto
          const configMap: Record<string, string> = {};
          data.config.forEach((item: ConfigItem) => {
            configMap[item.clave] = item.valor;
          });
          setConfig(prev => ({
            ...prev,
            nombreEmpresa: configMap['nombre_empresa'] || prev.nombreEmpresa,
            direccionEmpresa: configMap['direccion_empresa'] || '',
            telefonoEmpresa: configMap['telefono_empresa'] || '',
            emailEmpresa: configMap['email_empresa'] || '',
            precioMembresia: configMap['precio_membresia'] || prev.precioMembresia,
            moneda: configMap['moneda'] || prev.moneda,
            ivaPorcentaje: configMap['iva_porcentaje'] || prev.ivaPorcentaje,
          }));
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
      const configItems = [
        { clave: 'nombre_empresa', valor: config.nombreEmpresa },
        { clave: 'direccion_empresa', valor: config.direccionEmpresa },
        { clave: 'telefono_empresa', valor: config.telefonoEmpresa },
        { clave: 'email_empresa', valor: config.emailEmpresa },
        { clave: 'precio_membresia', valor: config.precioMembresia },
        { clave: 'moneda', valor: config.moneda },
        { clave: 'iva_porcentaje', valor: config.ivaPorcentaje },
      ];

      const res = await fetch('/api/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configItems }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Configuracion guardada',
          message: 'Los cambios se aplicaron correctamente'
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo guardar la configuracion'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexion'
      });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando configuracion..." />;
  }

  return (
    <>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
          Configuracion del Sistema
        </h1>
      </div>

      {/* Config Cards */}
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        {/* Datos de la Empresa */}
        <div className={styles.list} style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            📋 Datos de la Empresa
          </h2>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={config.nombreEmpresa}
                onChange={(e) => setConfig({ ...config, nombreEmpresa: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Direccion
              </label>
              <input
                type="text"
                value={config.direccionEmpresa}
                onChange={(e) => setConfig({ ...config, direccionEmpresa: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Telefono
                </label>
                <input
                  type="tel"
                  value={config.telefonoEmpresa}
                  onChange={(e) => setConfig({ ...config, telefonoEmpresa: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={config.emailEmpresa}
                  onChange={(e) => setConfig({ ...config, emailEmpresa: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuración Financiera */}
        <div className={styles.list} style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            💰 Configuracion Financiera
          </h2>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Precio Membresia Mensual
                </label>
                <input
                  type="number"
                  value={config.precioMembresia}
                  onChange={(e) => setConfig({ ...config, precioMembresia: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Moneda
                </label>
                <select
                  value={config.moneda}
                  onChange={(e) => setConfig({ ...config, moneda: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="USD">USD - Dolar</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Porcentaje IVA (%)
              </label>
              <input
                type="number"
                value={config.ivaPorcentaje}
                onChange={(e) => setConfig({ ...config, ivaPorcentaje: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className={styles.list} style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            🔧 Estado del Sistema
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>Base de Datos</span>
              <Badge variant="success">Conectada</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>WhatsApp Bot</span>
              <Badge variant="warning">Pendiente</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
              <span>Sistema de Autenticacion</span>
              <Badge variant="success">Activo</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={guardando}
          style={{ minWidth: '150px' }}
        >
          Guardar Cambios
        </Button>
      </div>
    </>
  );
}
