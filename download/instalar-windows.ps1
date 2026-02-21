# ================================================================
# CHIACCHIO - Script de Instalación para Windows
# Ejecutar en PowerShell como Administrador
# ================================================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "CHIACCHIO - Creando estructura de carpetas" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Crear carpeta principal
$basePath = "C:\xampp\htdocs\chiacchio"

if (Test-Path $basePath) {
    Write-Host "La carpeta chiacchio ya existe." -ForegroundColor Yellow
} else {
    New-Item -ItemType Directory -Path $basePath | Out-Null
    Write-Host "Carpeta creada: $basePath" -ForegroundColor Cyan
}

# Lista de carpetas a crear
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
    "prisma",
    "download"
)

# Crear carpetas
foreach ($folder in $folders) {
    $fullPath = Join-Path $basePath $folder
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Creada: $folder" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "ESTRUCTURA CREADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Copia los archivos del proyecto a sus carpetas correspondientes"
Write-Host "2. Abre VS Code en C:\xampp\htdocs\chiacchio"
Write-Host "3. Ejecuta: npm install"
Write-Host "4. Ejecuta: npm run dev"
Write-Host "5. Abre: http://localhost:3000"
Write-Host ""
