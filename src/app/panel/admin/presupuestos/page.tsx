/* ============================================
   CHIACCHIO - Panel Admin - Presupuestos
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay, useToast } from '@/components/ui';
import styles from './page.module.css';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

interface PresupuestoItem {
  id?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Presupuesto {
  id: string;
  numero: number;
  clienteId?: string;
  clienteNombre?: string;
  clienteDireccion?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  lugar: string;
  fecha: string;
  subtotal: number;
  descuentoPorcentaje: number;
  descuentoMonto: number;
  total: number;
  financiacion: string;
  cuotas: number;
  estado: string;
  notas?: string;
  items: PresupuestoItem[];
  cliente?: Cliente;
}

const FINANCIACION_OPTIONS = [
  { value: 'contado', label: 'Contado' },
  { value: '3_cuotas', label: '3 cuotas sin interés' },
  { value: '6_cuotas', label: '6 cuotas' },
  { value: 'acuerdo', label: 'A convenir' },
];

const ESTADOS = [
  { value: 'PENDIENTE', label: 'Pendiente', color: '#f59e0b' },
  { value: 'APROBADO', label: 'Aprobado', color: '#22c55e' },
  { value: 'RECHAZADO', label: 'Rechazado', color: '#ef4444' },
  { value: 'VENCIDO', label: 'Vencido', color: '#6b7280' },
];

export default function PresupuestosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    clienteDireccion: '',
    clienteTelefono: '',
    clienteEmail: '',
    lugar: 'La Plata',
    fecha: new Date().toISOString().split('T')[0],
    descuentoPorcentaje: 0,
    financiacion: 'contado',
    cuotas: 1,
    notas: '',
    items: [{ descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }] as PresupuestoItem[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session && ['SUPER', 'ADMIN'].includes(session.user.rol)) {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [presRes, clientesRes] = await Promise.all([
        fetch('/api/admin/presupuestos'),
        fetch('/api/clientes'),
      ]);

      if (presRes.ok) {
        const data = await presRes.json();
        setPresupuestos(data);
      }

      if (clientesRes.ok) {
        const data = await clientesRes.json();
        const clientesArray = Array.isArray(data) ? data : (data.clientes || []);
        setClientes(clientesArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  };

  const calcularDescuento = () => {
    const subtotal = calcularSubtotal();
    return (subtotal * formData.descuentoPorcentaje) / 100;
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDescuento();
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    if (field === 'cantidad' || field === 'precioUnitario') {
      newItems[index] = {
        ...newItems[index],
        [field]: parseFloat(value as string) || 0,
      };
      newItems[index].subtotal = newItems[index].cantidad * newItems[index].precioUnitario;
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleClienteSelect = (clienteId: string) => {
    if (clienteId === 'manual') {
      setFormData({
        ...formData,
        clienteId: '',
        clienteNombre: '',
        clienteDireccion: '',
        clienteTelefono: '',
        clienteEmail: '',
      });
    } else {
      const cliente = clientes.find((c) => c.id === clienteId);
      if (cliente) {
        setFormData({
          ...formData,
          clienteId: cliente.id,
          clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
          clienteDireccion: `${cliente.direccion}, ${cliente.ciudad}`,
          clienteTelefono: cliente.telefono,
          clienteEmail: cliente.email,
        });
      }
    }
  };

  const openCreateModal = () => {
    setFormData({
      clienteId: '',
      clienteNombre: '',
      clienteDireccion: '',
      clienteTelefono: '',
      clienteEmail: '',
      lugar: 'La Plata',
      fecha: new Date().toISOString().split('T')[0],
      descuentoPorcentaje: 0,
      financiacion: 'contado',
      cuotas: 1,
      notas: '',
      items: [{ descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar items
    const validItems = formData.items.filter((item) => item.descripcion && item.precioUnitario > 0);
    if (validItems.length === 0) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Debes agregar al menos un ítem con descripción y precio',
      });
      return;
    }

    // Validar cliente
    if (!formData.clienteId && !formData.clienteNombre) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Debes seleccionar un cliente o ingresar los datos manualmente',
      });
      return;
    }

    setSaving(true);

    try {
      const body = {
        ...formData,
        items: validItems,
        subtotal: calcularSubtotal(),
        descuentoMonto: calcularDescuento(),
        total: calcularTotal(),
      };

      const res = await fetch('/api/admin/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        showToast({
          type: 'success',
          title: 'Presupuesto creado',
          message: `Presupuesto #${data.numero} creado correctamente`,
        });
        setModalOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.error || 'No se pudo crear el presupuesto',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión',
      });
    } finally {
      setSaving(false);
    }
  };

  const openPdfModal = (presupuesto: Presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setPdfModalOpen(true);
  };

  const generatePdf = async () => {
    if (!selectedPresupuesto) return;

    setGeneratingPdf(true);

    try {
      const res = await fetch('/api/admin/presupuestos/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presupuestoId: selectedPresupuesto.id }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Presupuesto_${selectedPresupuesto.numero}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast({
          type: 'success',
          title: 'PDF generado',
          message: 'El presupuesto se descargó correctamente',
        });
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.error || 'No se pudo generar el PDF',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error al generar el PDF',
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getEstadoConfig = (estado: string) => {
    return ESTADOS.find((e) => e.value === estado) || ESTADOS[0];
  };

  if (loading) {
    return <LoadingOverlay text="Cargando presupuestos..." />;
  }

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Presupuestos</h1>
        <button className={styles.btnPrimary} onClick={openCreateModal}>
          + Nuevo Presupuesto
        </button>
      </div>

      {/* Lista de presupuestos */}
      {presupuestos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay presupuestos creados</p>
          <button className={styles.btnPrimary} onClick={openCreateModal}>
            Crear primer presupuesto
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {presupuestos.map((pres) => {
            const estadoConfig = getEstadoConfig(pres.estado);
            return (
              <div key={pres.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.cardNumber}>#{pres.numero}</span>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: estadoConfig.color }}
                    >
                      {estadoConfig.label}
                    </span>
                  </div>
                  <span className={styles.cardDate}>{formatDate(pres.fecha)}</span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.clienteName}>
                    {pres.clienteNombre || `${pres.cliente?.nombre} ${pres.cliente?.apellido}`}
                  </h3>
                  <p className={styles.clienteInfo}>
                    {pres.clienteDireccion || pres.cliente?.direccion}
                  </p>
                </div>

                <div className={styles.cardItems}>
                  {pres.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <span className={styles.itemDesc}>{item.descripcion}</span>
                      <span className={styles.itemPrice}>{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                  {pres.items.length > 3 && (
                    <p className={styles.moreItems}>+{pres.items.length - 3} ítems más</p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.totals}>
                    {pres.descuentoPorcentaje > 0 && (
                      <span className={styles.discount}>
                        Desc: {pres.descuentoPorcentaje}%
                      </span>
                    )}
                    <span className={styles.total}>{formatPrice(pres.total)}</span>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.btnPdf}
                      onClick={() => openPdfModal(pres)}
                    >
                      📄 PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear Presupuesto */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Nuevo Presupuesto</h2>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {/* Datos del cliente */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Datos del Cliente</h3>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Seleccionar Cliente</label>
                    <select
                      className={styles.formSelect}
                      value={formData.clienteId || 'manual'}
                      onChange={(e) => handleClienteSelect(e.target.value)}
                    >
                      <option value="manual">Ingresar manualmente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} {c.apellido} - {c.telefono}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!formData.clienteId && (
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nombre *</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={formData.clienteNombre}
                          onChange={(e) =>
                            setFormData({ ...formData, clienteNombre: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Teléfono</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={formData.clienteTelefono}
                          onChange={(e) =>
                            setFormData({ ...formData, clienteTelefono: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Dirección</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={formData.clienteDireccion}
                          onChange={(e) =>
                            setFormData({ ...formData, clienteDireccion: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                          type="email"
                          className={styles.formInput}
                          value={formData.clienteEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, clienteEmail: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {formData.clienteId && (
                    <div className={styles.clientePreview}>
                      <p>
                        <strong>{formData.clienteNombre}</strong>
                      </p>
                      <p>{formData.clienteDireccion}</p>
                      <p>{formData.clienteTelefono}</p>
                    </div>
                  )}
                </div>

                {/* Lugar y fecha */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Lugar y Fecha</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Lugar</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={formData.lugar}
                        onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Fecha</label>
                      <input
                        type="date"
                        className={styles.formInput}
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Ítems del Presupuesto</h3>

                  {formData.items.map((item, index) => (
                    <div key={index} className={styles.itemForm}>
                      <div className={styles.itemFormRow}>
                        <div className={styles.itemFormDesc}>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Descripción del ítem"
                            value={item.descripcion}
                            onChange={(e) =>
                              handleItemChange(index, 'descripcion', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className={styles.itemFormQty}>
                          <input
                            type="number"
                            className={styles.formInput}
                            placeholder="Cant."
                            value={item.cantidad}
                            onChange={(e) =>
                              handleItemChange(index, 'cantidad', e.target.value)
                            }
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className={styles.itemFormPrice}>
                          <input
                            type="number"
                            className={styles.formInput}
                            placeholder="Precio"
                            value={item.precioUnitario || ''}
                            onChange={(e) =>
                              handleItemChange(index, 'precioUnitario', e.target.value)
                            }
                            min="0"
                            step="100"
                          />
                        </div>
                        <div className={styles.itemFormSubtotal}>
                          <span>{formatPrice(item.subtotal)}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.btnRemoveItem}
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}

                  <button type="button" className={styles.btnAddItem} onClick={addItem}>
                    + Agregar Ítem
                  </button>
                </div>

                {/* Descuento y Financiación */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Descuento y Financiación</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Descuento (%)</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={formData.descuentoPorcentaje}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descuentoPorcentaje: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                        step="5"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Financiación</label>
                      <select
                        className={styles.formSelect}
                        value={formData.financiacion}
                        onChange={(e) =>
                          setFormData({ ...formData, financiacion: e.target.value })
                        }
                      >
                        {FINANCIACION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                <div className={styles.section}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Notas / Observaciones</label>
                    <textarea
                      className={styles.formTextarea}
                      value={formData.notas}
                      onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                      placeholder="Notas adicionales..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Totales */}
                <div className={styles.totalsSection}>
                  <div className={styles.totalsRow}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(calcularSubtotal())}</span>
                  </div>
                  {formData.descuentoPorcentaje > 0 && (
                    <div className={styles.totalsRow}>
                      <span>Descuento ({formData.descuentoPorcentaje}%):</span>
                      <span>- {formatPrice(calcularDescuento())}</span>
                    </div>
                  )}
                  <div className={`${styles.totalsRow} ${styles.totalsFinal}`}>
                    <span>TOTAL:</span>
                    <span>{formatPrice(calcularTotal())}</span>
                  </div>
                  {formData.financiacion === '3_cuotas' && (
                    <div className={styles.totalsRow}>
                      <span>3 cuotas de:</span>
                      <span>{formatPrice(calcularTotal() / 3)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear Presupuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal PDF */}
      {pdfModalOpen && selectedPresupuesto && (
        <div className={styles.modalOverlay} onClick={() => setPdfModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Generar PDF</h2>
              <button className={styles.modalClose} onClick={() => setPdfModalOpen(false)}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.pdfPreview}>
                <p>
                  <strong>Presupuesto #{selectedPresupuesto.numero}</strong>
                </p>
                <p>
                  Cliente:{' '}
                  {selectedPresupuesto.clienteNombre ||
                    `${selectedPresupuesto.cliente?.nombre} ${selectedPresupuesto.cliente?.apellido}`}
                </p>
                <p>Total: {formatPrice(selectedPresupuesto.total)}</p>
                {selectedPresupuesto.descuentoPorcentaje > 0 && (
                  <p>Descuento aplicado: {selectedPresupuesto.descuentoPorcentaje}%</p>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setPdfModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={generatePdf}
                disabled={generatingPdf}
              >
                {generatingPdf ? 'Generando...' : '📄 Descargar PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
