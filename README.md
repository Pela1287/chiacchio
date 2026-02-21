# 🏠 Chiacchio - Mantenimiento Domiciliario por Membresía

![Estado](https://img.shields.io/badge/Estado-Completo-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748)

Sistema completo de gestión para servicios de mantenimiento domiciliario con modelo de suscripción mensual.

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar
git clone https://github.com/Pela1287/chiacchio.git
cd chiacchio

# 2. Instalar dependencias
npm install

# 3. Crear base de datos en MySQL (XAMPP)
# Ir a http://localhost/phpmyadmin → Nueva BD: chiacchio

# 4. Configurar .env
echo 'DATABASE_URL="mysql://root:@localhost:3306/chiacchio"' > .env
echo 'NEXTAUTH_SECRET="chiacchio-secret-2024"' >> .env
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env

# 5. Inicializar BD
npx prisma generate
npx prisma db push
npm run db:seed

# 6. Ejecutar
npm run dev
```

Abrir: **http://localhost:3000**

---

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| 🔴 Super | super@chiacchio.com | admin123 |
| 🟡 Admin | admin@chiacchio.com | admin123 |
| 🟢 Cliente | juan.perez@email.com | cliente123 |

---

## 📋 Funcionalidades por Fase

### ✅ FASE 1 - UI + CRUD Mock
- [x] Páginas públicas (Home, Quiénes Somos, Contacto, Deslinde)
- [x] Sistema de login con 3 roles
- [x] Paneles completos (Cliente, Admin, Super)
- [x] CRUD de clientes
- [x] Widget de chat bot (mock)
- [x] Componentes UI reutilizables (CSS Modules)

### ✅ FASE 2 - Backend Real
- [x] MySQL + Prisma ORM
- [x] Autenticación NextAuth
- [x] API REST para todas las entidades
- [x] Repositorios para acceso a datos
- [x] Seed con datos de prueba

### ✅ FASE 3 - Integraciones
- [x] Servicio WhatsApp (listo para configurar)
- [x] Servicio Bot IA con RAG
- [x] Notificaciones automáticas
- [x] Captura de leads desde el bot

---

## 🗂️ Estructura

```
chiacchio/
├── prisma/
│   ├── schema.prisma     # 15 modelos
│   └── seed.ts           # Datos prueba
├── src/
│   ├── app/
│   │   ├── api/          # 6 endpoints
│   │   ├── auth/login/   # Login real
│   │   └── panel/        # 3 paneles
│   ├── components/
│   │   ├── ui/           # 12 componentes
│   │   ├── layout/       # 4 componentes
│   │   └── chat/         # Bot widget
│   └── lib/
│       ├── auth.ts       # NextAuth
│       ├── prisma.ts     # DB client
│       ├── repositories.ts
│       ├── whatsapp.ts
│       └── bot.ts
└── INSTALACION.md       # Guía completa
```

---

## 🤖 Configurar WhatsApp (Opcional)

1. Crear app en [Meta Developers](https://developers.facebook.com)
2. Agregar producto WhatsApp
3. Obtener Token y Phone Number ID
4. Agregar a `.env`:
```env
WHATSAPP_TOKEN="tu-token"
WHATSAPP_PHONE_NUMBER_ID="tu-id"
```

---

## 🔧 Configurar Bot IA Real (Opcional)

1. Crear cuenta en [OpenAI](https://platform.openai.com)
2. Generar API Key
3. Agregar a `.env`:
```env
AI_API_KEY="sk-..."
```

---

## 📖 Documentación

Ver **[INSTALACION.md](./INSTALACION.md)** para guía completa paso a paso.

---

## 🔧 Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npx prisma studio    # GUI base de datos
npm run db:seed      # Recargar datos
```

---

**Desarrollado para Chiacchio** 🏠
