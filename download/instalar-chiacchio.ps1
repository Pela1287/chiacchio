# ================================================================
# CHIACCHIO - Script de Instalacion Completa
# Ejecutar en PowerShell como Administrador
# ================================================================

param(
    [string]$GithubToken = ""
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "CHIACCHIO - Instalador Automatico v1.0" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Configuracion
$ProjectPath = "C:\xampp\htdocs\chiacchio"
$RepoUrl = "https://github.com/Pela1287/chiacchio.git"

# Verificar si la carpeta ya existe
if (Test-Path $ProjectPath) {
    Write-Host "La carpeta ya existe. ¿Desea sobrescribirla? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s") {
        Remove-Item -Recurse -Force $ProjectPath
    } else {
        Write-Host "Instalacion cancelada." -ForegroundColor Red
        exit
    }
}

Write-Host "Paso 1: Creando estructura de carpetas..." -ForegroundColor Cyan

# Crear estructura
$folders = @(
    "src\app\auth\login",
    "src\app\contacto",
    "src\app\deslinde",
    "src\app\panel\admin\clientes",
    "src\app\panel\admin\leads",
    "src\app\panel\admin\membresias",
    "src\app\panel\admin\presupuestos",
    "src\app\panel\admin\servicios",
    "src\app\panel\admin\solicitudes",
    "src\app\panel\cliente",
    "src\app\panel\super\configuracion",
    "src\app\panel\super\usuarios",
    "src\app\quienes-somos",
    "src\app\api",
    "src\components\ui",
    "src\components\layout",
    "src\components\chat",
    "src\data",
    "src\hooks",
    "src\lib",
    "src\styles",
    "src\types",
    "public\images",
    "prisma"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path "$ProjectPath\$folder" | Out-Null
}

Write-Host "Estructura creada correctamente." -ForegroundColor Green
Write-Host ""

Write-Host "Paso 2: Inicializando repositorio Git..." -ForegroundColor Cyan

cd $ProjectPath
git init
git branch -M main

Write-Host "Repositorio Git inicializado." -ForegroundColor Green
Write-Host ""

Write-Host "Paso 3: Creando archivos de configuracion..." -ForegroundColor Cyan

# Crear package.json
$packageJson = @'
{
  "name": "chiacchio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.1.1",
    "@prisma/client": "^6.11.1",
    "date-fns": "^4.1.0",
    "next": "^15.3.0",
    "next-auth": "^4.24.11",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "uuid": "^11.1.0",
    "zod": "^3.24.0",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^10",
    "eslint": "^9",
    "eslint-config-next": "^15.3.0",
    "typescript": "^5"
  }
}
'@
$packageJson | Out-File -FilePath "$ProjectPath\package.json" -Encoding utf8

# Crear tsconfig.json
$tsConfig = @'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
'@
$tsConfig | Out-File -FilePath "$ProjectPath\tsconfig.json" -Encoding utf8

# Crear next.config.ts
$nextConfig = @'
import type { NextConfig } from "next";
const nextConfig: NextConfig = { reactStrictMode: true };
export default nextConfig;
'@
$nextConfig | Out-File -FilePath "$ProjectPath\next.config.ts" -Encoding utf8

# Crear next-env.d.ts
$nextEnv = @'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
'@
$nextEnv | Out-File -FilePath "$ProjectPath\next-env.d.ts" -Encoding utf8

# Crear .gitignore
$gitignore = @'
node_modules/
.next/
out/
build/
dist/
.DS_Store
*.pem
npm-debug.log*
.env
.env.local
.vercel
*.tsbuildinfo
'@
$gitignore | Out-File -FilePath "$ProjectPath\.gitignore" -Encoding utf8

# Crear .env.example
$envExample = @'
DATABASE_URL="mysql://root:@localhost:3306/chiacchio"
NEXTAUTH_SECRET="tu-clave-secreta-muy-larga-y-segura"
NEXTAUTH_URL="http://localhost:3000"
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
AI_API_KEY=""
'@
$envExample | Out-File -FilePath "$ProjectPath\.env.example" -Encoding utf8

Write-Host "Archivos de configuracion creados." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "IMPORTANTE: Archivos del codigo fuente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Los archivos TypeScript/CSS deben copiarse manualmente" -ForegroundColor Yellow
Write-Host "desde el servidor a sus carpetas correspondientes." -ForegroundColor Yellow
Write-Host ""
Write-Host "Despues de copiar los archivos, ejecuta:" -ForegroundColor Cyan
Write-Host "  cd $ProjectPath" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'FASE 1 completa'" -ForegroundColor White
Write-Host "  git remote add origin $RepoUrl" -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Luego: npm run dev" -ForegroundColor Cyan
Write-Host "Y abre: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
