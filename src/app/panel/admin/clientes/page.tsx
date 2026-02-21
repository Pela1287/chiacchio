/* ============================================
   CHIACCHIO - Admin - Gestión de Clientes
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Badge, Avatar, Modal, Input, useToast, LoadingOverlay } from '@/components/ui';
import { formatearFecha } from '@/lib/helpers';
import styles from './page.module.css';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  notas?: string;
  activo: boolean;
  createdAt: string;
  tieneMembresia?: boolean;
}

export default function ClientesPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalMembresiaOpen, setModalMembresiaOpen] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [activandoMembresia, setActivandoMembresia] = useState(false);
  const [guardandoCliente, setGuardandoCliente] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'La Plata',
    codigoPostal: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchClientes();
    }
  }, [session]);

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      if (res.ok) {
        const data = await res.json();
        const clientesArray = Array.isArray(data) ? data : (data.clientes || []);
        setClientes(clientesArray);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleActivarMembresia = async () => {
    if (!clienteSeleccionado) return;

    setActivandoMembresia(true);
    try {
      const res = await fetch('/api/admin/membresias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: clienteSeleccionado.id }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Membresía activada',
          message: `Se activó la membresía para ${clienteSeleccionado.nombre}`
        });
        setModalMembresiaOpen(false);
        fetchClientes();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo activar la membresía'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setActivandoMembresia(false);
    }
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoCliente(true);

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Cliente creado',
          message: `${formData.nombre} ${formData.apellido} fue registrado correctamente`
        });
        setModalClienteOpen(false);
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: 'La Plata',
          codigoPostal: '',
        });
        fetchClientes();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo crear el cliente'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setGuardandoCliente(false);
    }
  };

  const abrirModalMembresia = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalMembresiaOpen(true);
  };

  if (loading) {
    return <LoadingOverlay text="Cargando clientes..." />;
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar clientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={() => setModalClienteOpen(true)}>
          + Nuevo Cliente
        </Button>
      </div>

      {/* Lista de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-tertiary)' }}>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>No hay clientes</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Creá un cliente manualmente o esperá que se registren
          </p>
          <Button variant="primary" onClick={() => setModalClienteOpen(true)}>
            + Crear Cliente
          </Button>
        </div>
      ) : (
        <div className={styles.clientesGrid}>
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={styles.clientCard}>
              <div className={styles.clientHeader}>
                <Avatar nombre={cliente.nombre} apellido={cliente.apellido} size="medium" />
                <div className={styles.clientInfo}>
                  <p className={styles.clientName}>{cliente.nombre} {cliente.apellido}</p>
                  <p className={styles.clientEmail}>{cliente.email}</p>
                </div>
                <div className={styles.clientBadges}>
                  {cliente.tieneMembresia ? (
                    <Badge variant="success">✓ Membresía Activa</Badge>
                  ) : (
                    <Badge variant="warning">Sin Membresía</Badge>
                  )}
                </div>
              </div>
              
              <div className={styles.clientDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Teléfono:</span>
                  <span className={styles.detailValue}>{cliente.telefono || 'No especificado'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ciudad:</span>
                  <span className={styles.detailValue}>{cliente.ciudad || 'No especificada'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Cliente desde:</span>
                  <span className={styles.detailValue}>{formatearFecha(cliente.createdAt)}</span>
                </div>
              </div>
              
              <div className={styles.clientActions}>
                {!cliente.tieneMembresia && (
                  <Button 
                    variant="primary" 
                    size="small" 
                    onClick={() => abrirModalMembresia(cliente)}
                  >
                    ⚡ Activar Membresía
                  </Button>
                )}
                <a 
                  href={`https://wa.me/${cliente.telefono?.replace(/\D/g, '')}?text=Hola%20${cliente.nombre},%20te%20escribimos%20de%20Chiacchio`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="small">
                    💬 WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Cliente */}
      <Modal
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        title="Nuevo Cliente"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalClienteOpen(false)}>Cancelar</Button>
            <Button 
              variant="primary" 
              onClick={handleCrearCliente}
              loading={guardandoCliente}
            >
              Crear Cliente
            </Button>
          </>
        }
      >
        <form onSubmit={handleCrearCliente} className={styles.modalForm}>
          <div className={styles.formRow}>
            <Input
              label="Nombre *"
              required
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            />
            <Input
              label="Apellido *"
              required
              value={formData.apellido}
              onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
            />
          </div>
          <Input
            label="Email *"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
            placeholder="+54 9 221 XXX XXXX"
          />
          <Input
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
          />
          <div className={styles.formRow}>
            <Input
              label="Ciudad"
              value={formData.ciudad}
              onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))}
            />
            <Input
              label="Código Postal"
              value={formData.codigoPostal}
              onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
            />
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
            * Se generará una contraseña automática que el cliente podrá cambiar
          </p>
        </form>
      </Modal>

      {/* Modal Activar Membresía */}
      <Modal
        isOpen={modalMembresiaOpen}
        onClose={() => setModalMembresiaOpen(false)}
        title="Activar Membresía"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalMembresiaOpen(false)}>Cancelar</Button>
            <Button 
              variant="primary" 
              onClick={handleActivarMembresia}
              loading={activandoMembresia}
            >
              Activar Membresía
            </Button>
          </>
        }
      >
        <div>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            ¿Activar membresía para este cliente?
          </p>
          {clienteSeleccionado && (
            <div className={styles.modalInfo}>
              <p><strong>Cliente:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
              <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
              <p><strong>Plan:</strong> Eléctrico - $9.900/mes</p>
              <p><strong>Beneficios:</strong> Atención ILIMITADA</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
