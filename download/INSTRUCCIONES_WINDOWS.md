# INSTRUCCIONES DE INSTALACIÓN - CHIACCHIO
## Para Windows con XAMPP

---

## ✅ REQUISITOS PREVIOS

1. **XAMPP instalado** con MySQL corriendo
2. **Node.js 18+** instalado
3. **PowerShell** o CMD

---

## 📋 PASO 1: CREAR LA BASE DE DATOS

1. Abre **phpMyAdmin**: http://localhost/phpmyadmin
2. Ve a la pestaña **SQL**
3. Ejecuta:

```sql
CREATE DATABASE chiacchio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📋 PASO 2: CREAR EL ARCHIVO .env

En la raíz del proyecto (`C:\xampp\htdocs\chiacchio1\chiacchio\`), crea un archivo llamado `.env` con este contenido:

```env
# Base de datos MySQL (XAMPP - sin contraseña por defecto)
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"

# NextAuth
NEXTAUTH_SECRET="chiacchio-secret-key-cambiar-en-produccion-2024"
NEXTAUTH_URL="http://localhost:3000"

# WhatsApp API (FASE 3 - opcional)
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""

# Bot IA (FASE 3 - opcional)
AI_API_KEY=""
AI_MODEL="gpt-3.5-turbo"
```

> **NOTA**: Si tu MySQL tiene contraseña, cambia `root:` por `root:tu_password`

---

## 📋 PASO 3: INSTALAR DEPENDENCIAS

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd C:\xampp\htdocs\chiacchio1\chiacchio
npm install
```

---

## 📋 PASO 4: GENERAR PRISMA CLIENT

```powershell
npx prisma generate
```

Deberías ver:
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

---

## 📋 PASO 5: CREAR LAS TABLAS EN LA BASE DE DATOS

```powershell
npx prisma db push
```

Deberías ver:
```
🚀 Your database is now in sync with your Prisma schema.
```

---

## 📋 PASO 6: EJECUTAR EL SEED (DATOS DE PRUEBA)

```powershell
npm run db:seed
```

Deberías ver:
```
🌱 Iniciando seed...
✅ Usuarios creados
✅ Clientes creados
✅ Servicios creados
✅ Membresías creadas
✅ Configuración creada
✅ Artículos de conocimiento creados
🎉 Seed completado exitosamente!
```

---

## 📋 PASO 7: INICIAR LA APLICACIÓN

```powershell
npm run dev
```

Abre el navegador en: http://localhost:3000

---

## 🔐 USUARIOS DE PRUEBA

| Rol | Email | Contraseña |
|-----|-------|------------|
| SUPER | super@chiacchio.com | admin123 |
| ADMIN | admin@chiacchio.com | admin123 |
| CLIENTE | juan.perez@email.com | cliente123 |
| CLIENTE | ana.garcia@email.com | cliente123 |

---

## 🔧 COMANDOS ÚTILES

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npx prisma studio` | Abrir interfaz visual de la DB |
| `npx prisma db push` | Sincronizar schema con DB |
| `npm run db:seed` | Cargar datos de prueba |

---

## ❗ POSIBLES ERRORES Y SOLUCIONES

### Error: "Environment variable not found: DATABASE_URL"
**Solución**: Asegúrate de que el archivo `.env` existe en la raíz del proyecto (no en una subcarpeta).

### Error: "Can't reach database server"
**Solución**: Verifica que MySQL esté corriendo en XAMPP (el icono debe estar en verde).

### Error: "Access denied for user 'root'@'localhost'"
**Solución**: Si tu MySQL tiene contraseña, edita el `.env`:
```
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/chiacchio"
```

### Error: "Module not found: @prisma/client"
**Solución**: Ejecuta:
```powershell
npm install @prisma/client
npx prisma generate
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
chiacchio/
├── prisma/
│   ├── schema.prisma    # Definición de la DB
│   └── seed.ts          # Datos de prueba
├── src/
│   ├── app/             # Páginas (App Router)
│   ├── components/      # Componentes React
│   └── lib/             # Utilidades, auth, etc.
├── .env                 # Variables de entorno
└── package.json
```

---

## 🚀 PRÓXIMOS PASOS (FASE 3)

1. **WhatsApp API**: Configurar WhatsApp Business API para notificaciones
2. **AI Bot**: Integrar modelo de lenguaje para el chatbot
3. **Deploy**: Subir a producción (Vercel, Railway, etc.)

---

## 📞 SOPORTE

Si tienes problemas, verifica:
1. XAMPP con MySQL corriendo
2. Node.js versión 18 o superior
3. Archivo `.env` en la raíz del proyecto
4. Base de datos `chiacchio` creada en MySQL
