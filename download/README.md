# 🏠 Chiacchio - Mantenimiento Domiciliario por Membresía

Sistema de gestión para servicios de mantenimiento domiciliario con modelo de suscripción mensual.

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **XAMPP** (Apache + MySQL)
- **VS Code** (recomendado)

## 🚀 Instalación Rápida

### 1. Crear estructura de carpetas

```powershell
# En PowerShell, desde C:\xampp\htdocs
cd C:\xampp\htdocs
mkdir chiacchio
cd chiacchio
```

### 2. Copiar archivos

Copia todos los archivos del proyecto manteniendo la estructura de carpetas.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Abrir en navegador

```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
chiacchio/
├── src/
│   ├── app/                 # Páginas (App Router)
│   │   ├── auth/login/      # Login mock
│   │   ├── panel/           # Paneles privados
│   │   │   ├── cliente/     # Panel cliente
│   │   │   ├── admin/       # Panel admin
│   │   │   └── super/       # Panel super usuario
│   │   └── ...              # Páginas públicas
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizables
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   └── chat/            # Widget bot chat
│   ├── lib/                 # Utilidades y estado
│   ├── types/               # Tipos TypeScript
│   ├── data/                # Datos mock
│   └── styles/              # CSS global y variables
├── public/                  # Archivos estáticos
├── prisma/                  # Schema DB (FASE 2)
└── package.json
```

## 🔐 Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **Cliente** | Su perfil, membresía, solicitudes, presupuestos |
| **Admin** | Gestión de clientes, servicios, solicitudes, presupuestos |
| **Super** | Todo + configuración + usuarios |

## 🧪 Probar la App (FASE 1)

1. Ir a `/auth/login`
2. Seleccionar un rol
3. Click en "Ingresar"
4. Explorar el panel correspondiente

## 🗄️ Configurar MySQL (FASE 2)

### 1. Iniciar XAMPP
- Abrir XAMPP Control Panel
- Iniciar **Apache** y **MySQL**

### 2. Crear base de datos
- Ir a `http://localhost/phpmyadmin`
- Crear nueva BD: `chiacchio`
- Cotejamiento: `utf8mb4_general_ci`

### 3. Configurar conexión
```env
# Crear archivo .env
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"
```

### 4. Ejecutar migraciones
```bash
npx prisma generate
npx prisma db push
```

## 📱 WhatsApp Bot (FASE 3)

Para habilitar notificaciones WhatsApp:

1. Crear cuenta en Meta for Developers
2. Configurar WhatsApp Business API
3. Obtener Token y Phone Number ID
4. Agregar a `.env`:
```env
WHATSAPP_TOKEN="tu-token"
WHATSAPP_PHONE_NUMBER_ID="tu-phone-id"
```

## 🤖 Bot IA (FASE 3)

El bot IA usará un LLM para:
- Responder consultas sobre servicios
- Capturar leads calificados
- Derivar a asesor humano cuando sea necesario

## 🛠️ Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build producción
npm run start      # Servidor producción
npm run lint       # Verificar código
npm run db:push    # Sincronizar schema con DB
npm run db:studio  # Abrir Prisma Studio
```

## 📝 Estado del Proyecto

- [x] **FASE 1**: UI + CRUD con datos mock
- [ ] **FASE 2**: MySQL + Auth real
- [ ] **FASE 3**: WhatsApp + Bot IA

---

Desarrollado con ❤️ para **Chiacchio**
