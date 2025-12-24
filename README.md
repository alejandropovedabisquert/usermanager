# User Manager - Full Stack Application

Aplicación full-stack para gestión de usuarios con autenticación JWT, construida con Node.js/Express en el backend y Next.js en el frontend.

## 🚀 Tecnologías

### Backend (usermanagerapi)
- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas

### Frontend (usermanagerfront)
- **Next.js** 
- **TypeScript**
- **Tailwind CSS**

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ (si vas a ejecutar sin Docker)
- MongoDB Atlas account o MongoDB local (si vas a ejecutar sin Docker)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd usermanager
```

### 2. Configurar variables de entorno

#### Backend

Crea un archivo `.env` en `usermanagerapi` basándote en `.env.example`:

```bash
cd usermanagerapi
cp .env.example .env
```

Edita `usermanagerapi/.env` con tus credenciales:

```env
ATLAS_URI=mongo_uri_here
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=5050
```

### 3. Levantar el proyecto con Docker

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levantará:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5050

### 4. Levantar el proyecto sin Docker

#### Backend

```bash
cd usermanagerapi
npm install
npm start
```

El servidor estará corriendo en http://localhost:5050

#### Frontend

```bash
cd usermanagerfront
pnpm install
pnpm dev
```

El frontend estará corriendo en http://localhost:3000

## 📚 API Endpoints

### Autenticación

- **POST** `/register` - Registrar nuevo usuario
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

- **POST** `/login` - Iniciar sesión
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

### Usuarios (requiere autenticación)

- **GET** `/users` - Obtener todos los usuarios
  - Header: `Authorization: Bearer <token>`

## 🔒 Seguridad

- Las contraseñas se encriptan con bcryptjs
- Autenticación mediante JWT
- Variables de entorno para credenciales sensibles
- Verificación de tokens en rutas protegidas

## 🐳 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up

# Levantar en segundo plano
docker-compose up -d

# Reconstruir imágenes
docker-compose up --build

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
usermanager/
├── docker-compose.yml
├── usermanagerapi/           # Backend API
│   ├── app.js               # Configuración Express
│   ├── bin/www              # Punto de entrada
│   ├── db/conn.js           # Conexión MongoDB
│   ├── middleware/          # Middlewares personalizados
│   ├── models/              # Modelos Mongoose
│   └── routes/              # Rutas de la API
└── usermanagerfront/         # Frontend Next.js
    ├── app/                 # App directory de Next.js
    └── public/              # Archivos estáticos
```

## 📝 Notas

- Asegúrate de tener una base de datos MongoDB activa
- El backend debe estar corriendo antes que el frontend para evitar errores de conexión
- Los archivos `.env` no están incluidos en el repositorio por seguridad