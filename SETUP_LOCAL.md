# 🚀 Guía de Instalación Local - Chiacchio

Esta guía te permitirá ejecutar el proyecto **Chiacchio** en tu entorno local para desarrollo y pruebas.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js v18+** → [Descargar](https://nodejs.org/)
2. **XAMPP** (para MySQL) → [Descargar](https://www.apachefriends.org/)
3. **Git** → [Descargar](https://git-scm.com/)
4. **Editor de código** (VS Code recomendado)

---

## 🔧 Paso 1: Configurar Base de Datos

### 1.1 Iniciar XAMPP

1. Abrí **XAMPP Control Panel**
2. Iniciá **Apache** y **MySQL**
3. Verificá que MySQL corra en el puerto **3306**

### 1.2 Crear Base de Datos

1. Abrí tu navegador y andá a: `http://localhost/phpmyadmin`
2. Clic en **"Nueva"** (New)
3. Nombre de la base de datos: `chiacchio`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Clic en **"Crear"**

---

## 📦 Paso 2: Clonar e Instalar Proyecto

Abrí **PowerShell** y ejecutá:

```powershell
# Clonar repositorio
git clone https://github.com/Pela1287/chiacchio.git
cd chiacchio

# Instalar dependencias
npm install
```

---

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo `.env`

Copiá el archivo de ejemplo y renombralo:

```powershell
Copy-Item .env.example .env
```

### 3.2 Editar `.env`

Abrí el archivo `.env` con tu editor y configurá:

```env
# Base de Datos (XAMPP Local)
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"

# NextAuth (Generá un secret con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-generado-aqui-32-caracteres-minimo"

# Z-AI SDK (opcional - para bot IA real)
# Si no tenés, el bot usará respuestas scriptadas
Z_AI_API_KEY=""

# WhatsApp Meta Cloud API (opcional - para producción)
# Si no configurás, quedará en modo MOCK (desarrollo)
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_VERIFY_TOKEN="chiacchio-webhook-2025"

# Mercado Pago (opcional - para webhook de pagos)
MERCADOPAGO_ACCESS_TOKEN=""
```

**IMPORTANTE:**
- Generá un `NEXTAUTH_SECRET` seguro ejecutando:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Por ahora, dejá WhatsApp y Z-AI vacíos (funcionará en modo desarrollo)

---

## 🗄️ Paso 4: Configurar Base de Datos con Prisma

```powershell
# Generar cliente de Prisma
npx prisma generate

# Sincronizar schema con la base de datos
npx prisma db push

# Poblar datos iniciales (usuarios, servicios, configuración)
npx prisma db seed
```

**Usuarios creados por el seed:**

| Email | Contraseña | Rol |
|-------|------------|-----|
| `super@chiacchio.com` | `Super123!` | SUPER |
| `admin@chiacchio.com` | `Admin123!` | ADMIN |
| `cliente@test.com` | `Cliente123!` | CLIENTE |

---

## ▶️ Paso 5: Ejecutar Proyecto

```powershell
npm run dev
```

El servidor se iniciará en: **http://localhost:3000**

---

## 🧪 Paso 6: Verificar Instalación

### 6.1 Verificar Frontend

Abrí en tu navegador:
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login

### 6.2 Login como Super Usuario

1. Andá a: http://localhost:3000/auth/login
2. Email: `super@chiacchio.com`
3. Contraseña: `Super123!`
4. Deberías ser redirigido a: http://localhost:3000/panel/super

### 6.3 Verificar Paneles

Una vez logueado como Super, probá acceder a:

- ✅ Panel Super: http://localhost:3000/panel/super
- ✅ Gestión Usuarios: http://localhost:3000/panel/super/usuarios
- ✅ Configuración: http://localhost:3000/panel/super/configuracion
- ✅ Panel Admin: http://localhost:3000/panel/admin
- ✅ Solicitudes: http://localhost:3000/panel/admin
- ✅ Clientes: http://localhost:3000/panel/admin/clientes
- ✅ Servicios: http://localhost:3000/panel/admin/servicios
- ✅ Presupuestos: http://localhost:3000/panel/admin/presupuestos
- ✅ Membresías: http://localhost:3000/panel/admin/membresias
- ✅ Leads: http://localhost:3000/panel/admin/leads

### 6.4 Verificar APIs

Usá Postman, Thunder Client o curl para probar:

```powershell
# Health check
curl http://localhost:3000/api/health

# Listar servicios (sin auth requerida)
curl http://localhost:3000/api/servicios

# Ver leads (requiere login)
curl http://localhost:3000/api/leads
```

---

## 🔍 Paso 7: Verificar Base de Datos (Prisma Studio)

Para ver los datos en un UI visual:

```powershell
npx prisma studio
```

Esto abrirá **Prisma Studio** en: http://localhost:5555

Verificá que existan:
- ✅ 3 usuarios (super, admin, cliente)
- ✅ 5+ servicios eléctricos
- ✅ 5+ configuraciones del sistema

---

## 🛠️ Comandos Útiles

```powershell
# Desarrollo
npm run dev              # Ejecutar en modo desarrollo (port 3000)

# Base de Datos
npx prisma studio        # Abrir UI de base de datos
npx prisma db push       # Sincronizar schema sin migraciones
npx prisma db seed       # Poblar datos de prueba
npx prisma generate      # Regenerar cliente de Prisma

# Build (producción)
npm run build            # Compilar proyecto
npm run start            # Ejecutar build de producción

# TypeScript
npm run type-check       # Verificar tipos (si existe el script)
```

---

## 🐛 Resolución de Problemas

### Error: "Can't reach database server at localhost:3306"

**Solución:**
1. Verificá que MySQL de XAMPP esté corriendo
2. Abrí XAMPP Control Panel
3. Clic en **"Start"** en MySQL
4. Esperá que el indicador se ponga **verde**

### Error: "Environment variable not found: DATABASE_URL"

**Solución:**
1. Verificá que el archivo `.env` exista en la raíz del proyecto
2. Verificá que contenga: `DATABASE_URL="mysql://root:@localhost:3306/chiacchio"`
3. Reiniciá el servidor: `npm run dev`

### Error: "Invalid `prisma.user.findUnique()` invocation"

**Solución:**
```powershell
npx prisma generate
npx prisma db push
```

### Error: "Port 3000 is already in use"

**Solución:**
```powershell
# Encontrar proceso usando puerto 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Matarlo (reemplazá PID con el número que te dió)
Stop-Process -Id PID -Force

# O usar otro puerto
$env:PORT=3001; npm run dev
```

### Las páginas de Super no cargan

**Solución:**
1. Verificá que iniciaste sesión como Super: `super@chiacchio.com`
2. Verificá que el middleware esté funcionando
3. Revisá la consola del navegador (F12) por errores JavaScript

---

## 📱 Configurar WhatsApp (OPCIONAL - Producción)

Para habilitar envío real de WhatsApp:

1. Creá una cuenta de Meta for Developers: https://developers.facebook.com/
2. Creá una app de WhatsApp Business
3. Obtené tu **Access Token** y **Phone Number ID**
4. Actualizá `.env`:
   ```env
   WHATSAPP_TOKEN="tu-token-aqui"
   WHATSAPP_PHONE_NUMBER_ID="tu-phone-id-aqui"
   ```
5. Reiniciá el servidor

**Nota:** Sin estas variables, el sistema funcionará en **modo MOCK** (simulará envíos sin enviar realmente).

---

## 🤖 Configurar Bot IA (OPCIONAL)

Para habilitar respuestas inteligentes con IA:

1. Obtené una API key de z-ai-web-dev: https://z-ai-web-dev.com
2. Actualizá `.env`:
   ```env
   Z_AI_API_KEY="tu-api-key-aqui"
   ```
3. Reiniciá el servidor

**Nota:** Sin API key, el bot usará **respuestas scriptadas pre-definidas**.

---

## 🎯 Verificación Final

Lista de chequeo para confirmar que todo funciona:

- [ ] MySQL corriendo en XAMPP
- [ ] Base de datos `chiacchio` creada
- [ ] `npm install` completado sin errores
- [ ] `.env` configurado con `DATABASE_URL` y `NEXTAUTH_SECRET`
- [ ] `npx prisma db push` ejecutado exitosamente
- [ ] `npx prisma db seed` ejecutado exitosamente
- [ ] `npm run dev` corriendo en http://localhost:3000
- [ ] Login exitoso como super@chiacchio.com
- [ ] Acceso a /panel/super/usuarios funcionando
- [ ] Acceso a /panel/super/configuracion funcionando
- [ ] Acceso a /panel/admin/leads funcionando

---

## 📚 Recursos Adicionales

- **Documentación completa:** Ver `README.md`
- **Arquitectura del proyecto:** Ver `PRESENTACION.md`
- **Historial de cambios:** Ver `worklog.md`
- **Prisma Schema:** Ver `prisma/schema.prisma`

---

## 🆘 Soporte

Si encontrás problemas:

1. Revisá los logs de la consola donde corrés `npm run dev`
2. Verificá el estado de MySQL en XAMPP
3. Revisá que `.env` esté correctamente configurado
4. Ejecutá `npx prisma studio` para ver el estado de la base de datos

---

**¡Listo! Tu entorno local de Chiacchio está funcionando. 🎉**
