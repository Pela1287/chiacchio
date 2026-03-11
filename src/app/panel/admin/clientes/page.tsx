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

        const clientesArray =
          Array.isArray(data) ? data : (data.clientes || []);

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

    } catch {

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

      // generar password automática
      const password = Math.random().toString(36).slice(-8);

      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password
        }),
      });

      const data = await res.json();

      if (res.ok) {

        showToast({
          type: 'success',
          title: 'Cliente creado',
          message: `${formData.nombre} ${formData.apellido} fue registrado correctamente`
        });

        console.log("Cliente creado:", formData);

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

    } catch {

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

      {clientesFiltrados.length === 0 ? (

        <div className={styles.emptyState}>
          <h3>No hay clientes</h3>
          <p>Creá un cliente manualmente o esperá que se registren</p>

          <Button variant="primary" onClick={() => setModalClienteOpen(true)}>
            + Crear Cliente
          </Button>

        </div>

      ) : (

        <div className={styles.clientesGrid}>

          {clientesFiltrados.map((cliente) => (

            <div key={cliente.id} className={styles.clientCard}>

              <div className={styles.clientHeader}>

                <Avatar
                  nombre={cliente.nombre}
                  apellido={cliente.apellido}
                  size="medium"
                />

                <div className={styles.clientInfo}>
                  <p className={styles.clientName}>
                    {cliente.nombre} {cliente.apellido}
                  </p>
                  <p className={styles.clientEmail}>
                    {cliente.email}
                  </p>
                </div>

                <div className={styles.clientBadges}>
                  {cliente.tieneMembresia ? (
                    <Badge variant="success">
                      ✓ Membresía Activa
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      Sin Membresía
                    </Badge>
                  )}
                </div>

              </div>

              <div className={styles.clientDetails}>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Teléfono:</span>
                  <span className={styles.detailValue}>
                    {cliente.telefono || 'No especificado'}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ciudad:</span>
                  <span className={styles.detailValue}>
                    {cliente.ciudad || 'No especificada'}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Cliente desde:</span>
                  <span className={styles.detailValue}>
                    {formatearFecha(cliente.createdAt)}
                  </span>
                </div>

              </div>

              <div className={styles.clientActions}>

                {!cliente.tieneMembresia && (

                  <button
                    onClick={() => {
                      console.log("CLICK MEMBRESIA", cliente.id)
                      abrirModalMembresia(cliente)
                    }}
                  >
                  ⚡ Activar Membresía
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL CREAR CLIENTE */}

      <Modal
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        title="Nuevo Cliente"
      >

        <form onSubmit={handleCrearCliente} className={styles.modalForm}>

          <Input
            label="Nombre *"
            required
            value={formData.nombre}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                nombre: e.target.value
              }))
            }
          />

          <Input
            label="Apellido *"
            required
            value={formData.apellido}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                apellido: e.target.value
              }))
            }
          />

          <Input
            label="Email *"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))
            }
          />

          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                telefono: e.target.value
              }))
            }
          />

          <Button
            type="submit"
            variant="primary"
            loading={guardandoCliente}
          >
            Crear Cliente
          </Button>

        </form>

      </Modal>
      {/* MODAL ACTIVAR MEMBRESIA */}

      <Modal
        isOpen={modalMembresiaOpen}
        onClose={() => setModalMembresiaOpen(false)}
        title="Activar Membresía"
      >

        <div className={styles.modalContent}>

          <p>
            ¿Activar membresía para
            <strong>
              {" "}
              {clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}
            </strong>
            ?
          </p>

          <Button
            variant="primary"
            loading={activandoMembresia}
            onClick={handleActivarMembresia}
          >
            Activar Membresía
          </Button>

        </div>

      </Modal>

    </>
  );
}