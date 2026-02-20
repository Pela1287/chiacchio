# 🎯 CHIACCHIO - Guía Rápida para Presentación

## ✅ Checklist ANTES de la presentación (hacer en casa)

### 1. Software necesario (instalar si no lo tienes):
- [ ] **Node.js** - https://nodejs.org (versión 18 o superior)
- [ ] **XAMPP** - https://www.apachefriends.org
- [ ] **Git** - https://git-scm.com
- [ ] **VS Code** (recomendado) - https://code.visualstudio.com

### 2. Verificar que todo funciona:
```powershell
node --version      # Debe mostrar v18.x.x o superior
npm --version       # Debe mostrar versión
git --version       # Debe mostrar versión
```

---

## 🚀 El día de la presentación - PASO A PASO

### PASO 1: Iniciar XAMPP (2 minutos)
1. Abrir **XAMPP Control Panel**
2. Click en **Start** en **Apache**
3. Click en **Start** en **MySQL**
4. Ambos deben quedar en verde

### PASO 2: Clonar el proyecto (2 minutos)
```powershell
cd C:\xampp\htdocs
git clone https://github.com/Pela1287/chiacchio.git
cd chiacchio
```

### PASO 3: Instalar dependencias (3-5 minutos)
```powershell
npm install
```

### PASO 4: Crear base de datos (1 minuto)
1. Abrir navegador: `http://localhost/phpmyadmin`
2. Click en **Nueva**
3. Escribir: `chiacchio`
4. Click en **Crear**

### PASO 5: Crear archivo .env (1 minuto)
Crear archivo `.env` en la carpeta del proyecto con:
```env
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"
NEXTAUTH_SECRET="chiacchio-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### PASO 6: Inicializar base de datos (2 minutos)
```powershell
npx prisma generate
npx prisma db push
npm run db:seed
```

### PASO 7: Ejecutar el proyecto (1 minuto)
```powershell
npm run dev
```

Abrir en el navegador: **http://localhost:3000**

---

## 🔑 Usuarios para demostrar

| Rol | Email | Contraseña |
|-----|-------|------------|
| Super Admin | super@chiacchio.com | admin123 |
| Admin | admin@chiacchio.com | admin123 |

---

## 🎬 Flujo sugerido para la presentación

### 1. Página Principal (5 min)
- Mostrar la home: `http://localhost:3000`
- Navegar por las secciones: Servicios, Quiénes Somos, Contacto
- Probar el **chat bot** (botón verde esquina inferior derecha)

### 2. Panel de Administración (10 min)
- Ir a **Iniciar Sesión**
- Login como **Admin**: `admin@chiacchio.com` / `admin123`
- Mostrar:
  - Dashboard con estadísticas
  - Lista de clientes
  - Lista de solicitudes
  - Técnicos disponibles

### 3. Panel Super Usuario (5 min)
- Logout
- Login como **Super**: `super@chiacchio.com` / `admin123`
- Mostrar:
  - Acceso completo al sistema
  - Configuración

---

## ❓ Posibles preguntas y respuestas

**P: ¿Qué tecnología usaron?**
R: Next.js 14 con TypeScript, MySQL con Prisma ORM, y NextAuth para autenticación.

**P: ¿Cuánto cuesta la membresía?**
R: $9,900 por mes con servicios ilimitados de mantenimiento eléctrico.

**P: ¿El bot funciona con IA real?**
R: Sí, está integrado con un modelo de lenguaje para responder consultas automáticamente.

**P: ¿Cómo se despliega en producción?**
R: Se puede desplegar en Vercel, un servidor VPS, o cualquier hosting que soporte Node.js.

---

## 🐛 Si algo falla

### "Can't reach database server"
→ Verificar que MySQL esté corriendo en XAMPP

### "Module not found"
→ Ejecutar `npm install` nuevamente

### "Prisma Client could not be generated"
→ Ejecutar `npx prisma generate`

### La página no carga
→ Verificar que el servidor esté corriendo (`npm run dev`)
→ Verificar que sea `http://localhost:3000`

---

## 📞 Contacto del proyecto

**WhatsApp:** +5492216011455

---

¡Éxitos en la presentación! 🎉
