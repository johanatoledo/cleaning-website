# 🔧 Backend - Pristine Homes Cleaning Service

## Descripción

Backend Node.js/Express para gestionar cotizaciones y servicios de limpieza confirmados. Incluye:
- ✅ API RESTful para cotizaciones
- ✅ Gestión de clientes en MySQL
- ✅ Envío de correos con cotizaciones
- ✅ Envío de correos despues de confirmado el servicio
- ✅ Confirmación de servicios
- ✅ Protección CSRF
- ✅ Auditoría de cambios

## 📋 Requisitos

- Node.js 16+
- MySQL 8.0+
- npm o yarn
- Cuenta de Gmail con contraseña de app

## 🚀 Instalación

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:
```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=pristine_homes_db

# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Correo
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-aqui
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar servidor

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📁 Estructura de Archivos

```
server/
├── index.js                    # Archivo principal del servidor
├── config/
│   └── database.js            # Configuración de conexión MySQL
├── controllers/
│   └── bookingController.js   # Lógica de cotizaciones y servicios
├── services/
│   └── emailService.js        # Servicio de envío de correos
├── routes/
│   └── bookingRoutes.js       # Rutas API
├── middleware/
│   └── csrf.js                # Middleware CSRF
├── package.json               # Dependencias
├── .env.example               # Variables de entorno (ejemplo)
└── .env                       # Variables de entorno (no commitear)
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { status: "OK", timestamp: "..." }
```

### CSRF Token
```
GET /api/csrf-token
Response: { csrfToken: "token-string" }
```

### Cotizaciones

#### Crear cotización
```
POST /api/bookings/quote
Headers:
  - Content-Type: application/json
  - X-CSRF-Token: token

Body:
{
  "serviceCode": "Regular",
  "beds": 3,
  "baths": 2,
  "freq": "Once",
  "extras": [],
  "date": "2024-01-15",
  "time": "10:00",
  "address": "123 Main St",
  "zip": "12345",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "quoteAmount": 15000
}

Response:
{
  "success": true,
  "message": "Quote submitted successfully",
  "quoteId": "uuid",
  "customerId": 1
}
```

#### Obtener cotización
```
GET /api/bookings/quote/:quoteId
Headers:
  - X-CSRF-Token: token

Response:
{
  "success": true,
  "quote": { ... }
}
```

#### Confirmar cotización
```
POST /api/bookings/quote/:quoteId/confirm
Headers:
  - Content-Type: application/json
  - X-CSRF-Token: token

Body:
{
  "customerConfirmation": true
}

Response:
{
  "success": true,
  "message": "Quote confirmed successfully",
  "bookingId": "uuid",
  "bookingDetails": { ... }
}
```

#### Obtener servicio confirmado
```
GET /api/bookings/confirmed/:bookingId
Headers:
  - X-CSRF-Token: token

Response:
{
  "success": true,
  "booking": { ... }
}
```

#### Listar cotizaciones
```
GET /api/bookings?status=pending&startDate=2024-01-01&endDate=2024-12-31
Headers:
  - X-CSRF-Token: token

Response:
{
  "success": true,
  "total": 10,
  "bookings": [ ... ]
}
```

## 📧 Servicio de Correos

### Configuración Gmail

1. **Habilitar contraseñas de aplicación:**
   - Ir a: https://myaccount.google.com/apppasswords
   - Seleccionar "Mail" y "Windows Computer"
   - Copiar la contraseña generada
   - Usar en `.env` como `EMAIL_PASSWORD`

2. **Credenciales necesarias:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASSWORD=contraseña-de-app
   ```

### Plantillas de Correo

#### Correo de Cotización
- Enviado: Cuando cliente solicita cotización
- Contenido: Detalles del servicio, costo, enlace de confirmación
- Destinatario: Email del cliente

#### Correo de Confirmación
- Enviado: Cuando cliente confirma desde el enlace
- Contenido: Confirmación de reserva, ID de booking, detalles
- Destinatario: Email del cliente y email de la persona que presta el servicio

## 🔑 CSRF

## 🛡️ Seguridad

### Tokens CSRF
- Se generan en el endpoint `/api/csrf-token`
- Se validan en cada POST a `/api/bookings`


### Validaciones
- Frontend: Zod schemas
- Backend: Validaciones manuales
- Base de datos: Constraints y transacciones

### CORS
- Origen permitido: `http://localhost:5173` (desarrollo)
- Producción: Configurar en `.env`

## 📊 Base de Datos

### Tablas principales

#### `customers`
```sql
- id (PK)
- name
- email (UNIQUE)
- phone
- created_at
- updated_at
```

#### `quotes`
```sql
- id (PK)
- quote_id (UUID, UNIQUE)
- customer_id (FK)
- service_code
- beds, baths
- frequency
- address, zip_code
- extras (JSON)
- quote_amount
- status (pending, confirmed, rejected, completed)
- service_date, service_time
- created_at, updated_at
```

#### `confirmed_bookings`
```sql
- id (PK)
- booking_id (UUID, UNIQUE)
- quote_id (FK)
- customer_id (FK)
- scheduled_date, scheduled_time
- completion_status
- confirmed_at, completed_at
- created_at, updated_at
```

## 🔧 Troubleshooting

### Error: "CSRF token missing"
- Solución: Asegúrate de obtener el token antes de hacer POST
- GET `/api/csrf-token` primero
- Luego incluir en headers: `X-CSRF-Token: token`

### Error: "Connection refused" (BD)
- Verificar que MySQL está corriendo
- Verificar credenciales en `.env`
- Verificar que base de datos existe: `mysql -u root -p < ../database.sql`

### Error: "Correos no se envían"
- Verificar que `EMAIL_PASSWORD` es contraseña de app (no contraseña de cuenta)
- Habilitar "Acceso de apps menos seguras" (si corresponde)
- Revisar logs: `console.log()` en emailService.js

### Error: "Module not found"
- Ejecutar: `npm install`
- Verificar node_modules existe
- Usar `npm ls` para diagnosticar

## 📈 Logs y Debugging

El servidor imprime logs en consola:
- Conexiones de BD
- Errores de CSRF
- Correos enviados
- Errores de controladores

Ejemplo output:
```
🚀 Server running on http://localhost:3001
💾 Database: pristine_homes_db
Quote email sent to john@example.com
Quote submitted successfully
```

## 🚀 Deployment

### Heroku
```bash
git push heroku main
```

Configurar variables de entorno en Heroku:
```bash
heroku config:set DB_HOST=db.host.com
heroku config:set EMAIL_PASSWORD=app-password
```

### Railway / Render
- Conectar repo Git
- Configurar enviroment variables
- Comandos:
  - Build: `npm install`
  - Start: `npm start`

## 📚 Recursos

- [Express Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Nodemailer Documentation](https://nodemailer.com/)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 📞 Support

Para problemas:
1. Revisar logs del servidor
2. Verificar configuración `.env`
3. Consultar la tabla de troubleshooting arriba
4. Revisar console del navegador (frontend errors)



## 👤 Autor

Johana Toledo 
