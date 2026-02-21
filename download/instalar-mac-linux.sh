#!/bin/bash
# ================================================================
# VERDENT - Script de Instalación para Mac/Linux
# Ejecutar con: chmod +x instalar.sh && ./instalar.sh
# ================================================================

echo "========================================"
echo "VERDENT - Creando estructura de carpetas"
echo "========================================"

# Carpeta base (cambiar según tu configuración)
BASE_PATH="/Applications/XAMPP/htdocs/verdent"

# En Mac XAMPP está en /Applications/XAMPP/htdocs
# En Linux suele estar en /opt/lampp/htdocs

# Detectar sistema
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    BASE_PATH="/Applications/XAMPP/htdocs/verdent"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    BASE_PATH="/opt/lampp/htdocs/verdent"
else
    # Por defecto usar carpeta actual
    BASE_PATH="$(pwd)/verdent"
fi

echo "Creando proyecto en: $BASE_PATH"

# Crear carpeta principal
mkdir -p "$BASE_PATH"

# Crear estructura de carpetas
folders=(
    "src/app/auth/login"
    "src/app/contacto"
    "src/app/deslinde"
    "src/app/panel/admin/clientes"
    "src/app/panel/admin/leads"
    "src/app/panel/admin/membresias"
    "src/app/panel/admin/presupuestos"
    "src/app/panel/admin/servicios"
    "src/app/panel/admin/solicitudes"
    "src/app/panel/cliente"
    "src/app/panel/super/configuracion"
    "src/app/panel/super/usuarios"
    "src/app/quienes-somos"
    "src/app/api"
    "src/components/ui"
    "src/components/layout"
    "src/components/chat"
    "src/data"
    "src/hooks"
    "src/lib"
    "src/styles"
    "src/types"
    "public/images"
    "prisma"
    "download"
)

for folder in "${folders[@]}"; do
    mkdir -p "$BASE_PATH/$folder"
    echo "Creada: $folder"
done

echo ""
echo "========================================"
echo "ESTRUCTURA CREADA EXITOSAMENTE"
echo "========================================"
echo ""
echo "Proximos pasos:"
echo "1. Copia los archivos del proyecto a sus carpetas"
echo "2. cd $BASE_PATH"
echo "3. npm install"
echo "4. npm run dev"
echo "5. Abre: http://localhost:3000"
echo ""
