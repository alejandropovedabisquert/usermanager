# User Manager - Full Stack Application

Aplicación full-stack para gestión de usuarios con autenticación JWT, construida con Node.js/Express en el backend, Next.js en el frontend y MongoDB como BBDD.

## 🚨 Importante!!

Este proyecto esta hecho para que se levante en local no en producción.

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
- **UI Shadcn**

## 📋 Requisitos Previos

- Docker y Docker Compose instalados

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/alejandropovedabisquert/usermanager
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
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
REFRESH_SECRET=refresh_secret_here
```

#### Frontend

Crea un archivo `.env` en `usermanagerfront` basándote en `.env.example`:

```bash
cd usermanagerfront
cp .env.example .env
```

### 3. Levantar el proyecto con Docker

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levantará:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5050

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
docker-compose logs -f mongo
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
usermanager/
├── docker-compose.yml
├── usermanagerapi/          # Backend API
│   ├── app.js               # Configuración Express
│   ├── bin/www              # Punto de entrada
│   ├── db/conn.js           # Conexión MongoDB
│   ├── middleware/          # Middlewares personalizados
│   ├── models/              # Modelos Mongoose
│   └── routes/              # Rutas de la API
├── usermanagerfront/        # Frontend Next.js
│   ├── app/                 # App directory de Next.js
│   └── public/              # Archivos estáticos
├── mongodb/                 # BBDD
│   ├── dump/user_manager    # Datos de la tabla
│   └── init/restore.sh      # Restaura los datos de la BBDD
```

## 📝 Notas

- Si quieres restaurar los datos de la BBDD elimina la carpeta `/data` de proyecto `mongodb`
- Los archivos `.env` no están incluidos en el repositorio por seguridad