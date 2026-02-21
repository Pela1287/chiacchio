# 🚀 CHIACCHIO - Guía Completa de Instalación y Pruebas

## ✅ Estado del Proyecto

| Fase | Estado | Descripción |
|------|--------|-------------|
| **FASE 1** | ✅ Completa | UI + CRUD con datos mock |
| **FASE 2** | ✅ Completa | MySQL + Prisma + Auth real + API |
| **FASE 3** | ✅ Completa | WhatsApp + Bot IA (listo para configurar) |

---

## 📋 Requisitos Previos

1. **Node.js** v18+ - [Descargar](https://nodejs.org)
2. **XAMPP** (Apache + MySQL) - [Descargar](https://www.apachefriends.org)
3. **Git** - [Descargar](https://git-scm.com)
4. **VS Code** (recomendado) - [Descargar](https://code.visualstudio.com)

---

## 🛠️ PASO 1: Clonar el Proyecto

Abre **PowerShell** y ejecuta:

```powershell
# Ir a la carpeta de XAMPP
cd C:\xampp\htdocs

# Clonar el repositorio
git clone https://github.com/Pela1287/chiacchio.git

# Entrar al proyecto
cd chiacchio
```

---

## 📦 PASO 2: Instalar Dependencias

```powershell
npm install
```

Esto instalará todas las dependencias (puede tardar 2-3 minutos).

---

## 🗄️ PASO 3: Configurar MySQL con XAMPP

### 3.1 Iniciar XAMPP
1. Abre **XAMPP Control Panel**
2. Click en **Start** en Apache
3. Click en **Start** en MySQL

### 3.2 Crear la Base de Datos
1. Abre el navegador: `http://localhost/phpmyadmin`
2. Click en **Nueva** (en el menú izquierdo)
3. Nombre de la base de datos: `chiacchio`
4. Cotejamiento: `utf8mb4_general_ci`
5. Click en **Crear**

### 3.3 Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"
NEXTAUTH_SECRET="chiacchio-secret-key-cambiar-en-produccion-2024"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🔄 PASO 4: Inicializar Base de Datos

```powershell
# Generar cliente Prisma
npx prisma generate

# Crear tablas en MySQL
npx prisma db push

# Cargar datos de prueba (seed)
npm run db:seed
```

### Verificar en phpMyAdmin
1. Ve a `http://localhost/phpmyadmin`
2. Selecciona la BD `chiacchio`
3. Deberías ver todas las tablas creadas
4. La tabla `usuarios` debe tener 4 usuarios de prueba

---

## 🚀 PASO 5: Ejecutar el Proyecto

```powershell
npm run dev
```

Abrir en el navegador: `http://localhost:3000`

---

## 🧪 PASO 6: Probar la Aplicación

### 6.1 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Super Usuario | super@chiacchio.com | admin123 |
| Administrador | admin@chiacchio.com | admin123 |
| Cliente | juan.perez@email.com | cliente123 |
| Cliente | ana.garcia@email.com | cliente123 |

### 6.2 Pruebas por Rol

#### 🔴 SUPER USUARIO
1. Ir a `/auth/login`
2. Login: `super@chiacchio.com` / `admin123`
3. **Verificar:**
   - [ ] Dashboard con estadísticas
   - [ ] Acceso a "Usuarios" en sidebar
   - [ ] Acceso a "Configuración" en sidebar
   - [ ] Ver todos los clientes
   - [ ] Ver todos los leads
   - [ ] Estado del sistema (mock hasta configurar)

#### 🟡 ADMINISTRADOR
1. Logout del Super Usuario
2. Login: `admin@chiacchio.com` / `admin123`
3. **Verificar:**
   - [ ] Dashboard con estadísticas
   - [ ] NO ver "Usuarios" en sidebar
   - [ ] NO ver "Configuración" en sidebar
   - [ ] CRUD de Clientes funciona
   - [ ] CRUD de Servicios funciona
   - [ ] Ver solicitudes pendientes

#### 🟢 CLIENTE
1. Logout del Admin
2. Login: `juan.perez@email.com` / `cliente123`
3. **Verificar:**
   - [ ] Dashboard personal
   - [ ] Ver membresía activa
   - [ ] Ver solicitudes propias
   - [ ] Ver presupuestos
   - [ ] Solo ve SUS datos

---

## 🤖 PASO 7: Probar el Bot Chat (FASE 3)

1. Ir a la home: `http://localhost:3000`
2. Click en el **botón verde** (esquina inferior derecha)
3. **Probar conversación:**

```
Usuario: Hola
Bot: ¡Hola! Soy el asistente virtual de Chiacchio...

Usuario: ¿Cuánto cuesta la membresía?
Bot: Nuestros planes son: Básico $5.000, Estándar $9.000, Premium $15.000...

Usuario: Me interesa el plan Premium
Bot: ¡Genial! Para ayudarte necesito algunos datos: nombre, teléfono, zona...

Usuario: Me llamo Juan, mi teléfono es +5492216011455, zona Palermo
Bot: ¡Perfecto! Un asesor te contactará...

Usuario: Quiero hablar con un asesor
Bot: ¡Entendido! Te conectaré con un asesor humano...
```

4. **Verificar:**
   - [ ] El bot responde correctamente
   - [ ] Los datos del lead se guardan (ver en panel admin)
   - [ ] Se envía notificación (ver consola del servidor)

---

## 📱 PASO 8: Configurar WhatsApp Real (Opcional)

### 8.1 Crear App en Meta
1. Ir a [Meta for Developers](https://developers.facebook.com)
2. Crear nueva app → Business
3. Agregar producto WhatsApp
4. Obtener:
   - Token de acceso permanente
   - Phone Number ID

### 8.2 Configurar Variables
Agregar al `.env`:

```env
WHATSAPP_TOKEN="tu-token-de-meta"
WHATSAPP_PHONE_NUMBER_ID="tu-phone-id"
```

### 8.3 Probar Notificación
1. Reiniciar el servidor: `Ctrl+C` → `npm run dev`
2. Crear una nueva solicitud
3. Verificar que llega WhatsApp al número del Super Usuario

---

## 🤖 PASO 9: Configurar Bot IA Real (Opcional)

### 9.1 Obtener API Key
1. Crear cuenta en [OpenAI](https://platform.openai.com)
2. Generar API Key

### 9.2 Configurar
Agregar al `.env`:

```env
AI_API_KEY="sk-tu-api-key-de-openai"
AI_MODEL="gpt-3.5-turbo"
```

### 9.3 Probar
El bot ahora usará IA real para responder.

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor

# Base de datos
npx prisma studio        # Abrir GUI de la BD
npm run db:push          # Sincronizar schema
npm run db:seed          # Recargar datos de prueba

# Producción
npm run build            # Compilar
npm run start            # Servidor producción
```

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verificar que MySQL esté corriendo en XAMPP
- Verificar que la BD `chiacchio` exista
- Verificar el `.env`

### Error: "Authentication failed"
- Verificar que el seed se ejecutó: `npm run db:seed`
- Verificar que la tabla `usuarios` tiene datos

### El bot no responde
- Verificar consola del navegador (F12)
- Verificar consola del servidor
- Sin API key, usa respuestas mock

### No puedo hacer login
- Verificar que el usuario existe en la BD
- Verificar contraseña correcta
- Verificar que el campo `password` no esté vacío

---

## 📂 Estructura Final del Proyecto

```
chiacchio/
├── prisma/
│   ├── schema.prisma    # Definición de tablas
│   └── seed.ts          # Datos de prueba
├── src/
│   ├── app/
│   │   ├── api/         # Endpoints REST
│   │   ├── auth/        # Login
│   │   └── panel/       # Paneles privados
│   ├── components/
│   │   ├── ui/          # Componentes reutilizables
│   │   ├── layout/      # Header, Footer, Sidebar
│   │   ├── auth/        # AuthProvider
│   │   └── chat/        # Bot widget
│   └── lib/
│       ├── auth.ts      # NextAuth config
│       ├── prisma.ts    # Cliente DB
│       ├── repositories.ts # Acceso a datos
│       ├── whatsapp.ts  # Servicio WhatsApp
│       └── bot.ts       # Bot IA
├── .env                 # Variables de entorno
└── package.json
```

---

## ✅ Checklist Final

- [ ] XAMPP instalado y funcionando
- [ ] MySQL corriendo
- [ ] Base de datos `chiacchio` creada
- [ ] Proyecto clonado
- [ ] `npm install` ejecutado
- [ ] `npx prisma generate` ejecutado
- [ ] `npx prisma db push` ejecutado
- [ ] `npm run db:seed` ejecutado
- [ ] `npm run dev` funcionando
- [ ] Login funciona con usuarios de prueba
- [ ] Cada rol ve su panel correspondiente
- [ ] CRUD de clientes funciona
- [ ] Bot chat responde
- [ ] WhatsApp configurado (opcional)
- [ ] Bot IA real configurado (opcional)

---

¡El proyecto está listo para usar! 🎉
