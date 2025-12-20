#!/bin/bash
# install.sh - Script de instalación rápida para Pristine Homes

echo "=========================================="
echo "🚀 Pristine Homes - Instalación Rápida"
echo "=========================================="
echo ""

# 1. Crear base de datos MySQL
echo "📊 Creando base de datos MySQL..."
echo "   Asegúrate que MySQL esté ejecutándose"
echo "   Ejecuta en otra terminal:"
echo "   mysql -u root -p < database.sql"
echo ""

# 2. Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install
echo "✅ Dependencias del frontend instaladas"
echo ""

# 3. Configurar backend
echo "⚙️  Configurando backend..."
mkdir -p server
cd server

if [ ! -f .env ]; then
    echo "   Creando archivo .env..."
    cp .env.example .env
    echo "   ⚠️  IMPORTANTE: Edita server/.env con tus credenciales"
    echo "   - DB_PASSWORD: Tu contraseña de MySQL"
    echo "   - EMAIL_USER: Tu email de Gmail"
    echo "   - EMAIL_PASSWORD: Tu contraseña de app de Gmail"
fi

# 4. Instalar dependencias del servidor
echo ""
echo "📦 Instalando dependencias del servidor..."
npm install express mysql2 cors uuid nodemailer dotenv
echo "✅ Dependencias del servidor instaladas"
echo ""

# 5. Resumen
cd ..
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Editar configuración de la base de datos:"
echo "   → Ejecutar: mysql -u root -p < database.sql"
echo ""
echo "2. Configurar variables de entorno:"
echo "   → Editar: server/.env"
echo "   → Agregar credenciales de BD y Gmail"
echo ""
echo "3. Iniciar frontend (Terminal 1):"
echo "   → npm run dev"
echo "   → Acceder a: http://localhost:5173"
echo ""
echo "4. Iniciar backend (Terminal 2):"
echo "   → npm run dev:server"
echo "   → Servidor en: http://localhost:3001"
echo ""
echo "📚 Documentación:"
echo "   → SETUP.md - Guía completa de instalación"
echo "   → CAMBIOS.md - Resumen de cambios realizados"
echo "   → SQL_QUERIES.md - Consultas útiles de BD"
echo ""
echo "=========================================="
