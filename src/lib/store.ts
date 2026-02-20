/* ============================================
   CHIACCHIO - Store Global con Zustand
   FASE 2: Integración con API real
   ============================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, Cliente, Membresia, Servicio, 
  Solicitud, Presupuesto, Lead, UserRole 
} from '@/types';

// ===== AUTH STORE =====
interface AuthState {
  usuario: User | null;
  cliente: Cliente | null;
  isAutenticado: boolean;
  isLoading: boolean;
  setUsuario: (usuario: User | null) => void;
  setCliente: (cliente: Cliente | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cliente: null,
      isAutenticado: false,
      isLoading: true,

      setUsuario: (usuario) => set({ 
        usuario, 
        isAutenticado: !!usuario,
        isLoading: false 
      }),

      setCliente: (cliente) => set({ cliente }),

      logout: () => {
        set({
          usuario: null,
          cliente: null,
          isAutenticado: false,
        });
        // Llamar a la API de logout
        fetch('/api/auth/signout', { method: 'POST' });
      },
    }),
    {
      name: 'chiacchio-auth',
      partialize: (state) => ({ 
        usuario: state.usuario,
        cliente: state.cliente,
      }),
    }
  )
);

// ===== DATA STORE =====
interface DataState {
  clientes: Cliente[];
  membresias: Membresia[];
  servicios: Servicio[];
  solicitudes: Solicitud[];
  presupuestos: Presupuesto[];
  leads: Lead[];
  isLoading: boolean;
  
  // Fetch methods
  fetchClientes: () => Promise<void>;
  fetchMembresias: () => Promise<void>;
  fetchServicios: () => Promise<void>;
  fetchSolicitudes: () => Promise<void>;
  fetchPresupuestos: () => Promise<void>;
  fetchLeads: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
  // Local updates
  setClientes: (clientes: Cliente[]) => void;
  setMembresias: (membresias: Membresia[]) => void;
  setServicios: (servicios: Servicio[]) => void;
  setSolicitudes: (solicitudes: Solicitud[]) => void;
  setPresupuestos: (presupuestos: Presupuesto[]) => void;
  setLeads: (leads: Lead[]) => void;
}

export const useDataStore = create<DataState>()((set, get) => ({
  clientes: [],
  membresias: [],
  servicios: [],
  solicitudes: [],
  presupuestos: [],
  leads: [],
  isLoading: false,

  fetchClientes: async () => {
    try {
      const res = await fetch('/api/clientes');
      const data = await res.json();
      set({ clientes: data.clientes || [] });
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  },

  fetchMembresias: async () => {
    try {
      const res = await fetch('/api/membresias');
      const data = await res.json();
      set({ membresias: data.membresias || [] });
    } catch (error) {
      console.error('Error fetching membresias:', error);
    }
  },

  fetchServicios: async () => {
    try {
      const res = await fetch('/api/servicios');
      const data = await res.json();
      set({ servicios: data.servicios || [] });
    } catch (error) {
      console.error('Error fetching servicios:', error);
    }
  },

  fetchSolicitudes: async () => {
    try {
      const res = await fetch('/api/solicitudes');
      const data = await res.json();
      set({ solicitudes: data.solicitudes || [] });
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
    }
  },

  fetchPresupuestos: async () => {
    try {
      const res = await fetch('/api/presupuestos');
      const data = await res.json();
      set({ presupuestos: data.presupuestos || [] });
    } catch (error) {
      console.error('Error fetching presupuestos:', error);
    }
  },

  fetchLeads: async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      set({ leads: data.leads || [] });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  },

  fetchAll: async () => {
    set({ isLoading: true });
    await Promise.all([
      get().fetchClientes(),
      get().fetchMembresias(),
      get().fetchServicios(),
      get().fetchSolicitudes(),
      get().fetchPresupuestos(),
      get().fetchLeads(),
    ]);
    set({ isLoading: false });
  },

  setClientes: (clientes) => set({ clientes }),
  setMembresias: (membresias) => set({ membresias }),
  setServicios: (servicios) => set({ servicios }),
  setSolicitudes: (solicitudes) => set({ solicitudes }),
  setPresupuestos: (presupuestos) => set({ presupuestos }),
  setLeads: (leads) => set({ leads }),
}));

// ===== UI STORE =====
interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  toggleSidebar: () => void;
  toggleChat: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  chatOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}));
