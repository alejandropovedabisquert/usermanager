# User Manager

Aplicación full-stack de gestión de usuarios con autenticación JWT. El backend está hecho con Express y MongoDB, y el frontend con Next.js.

## Importante

Este proyecto está pensado para desarrollo local. No hay configuración de producción.

## Stack y versiones

Estas son las versiones que usa el proyecto actualmente en Docker y las que conviene replicar si lo ejecutas sin contenedores:

| Componente | Versión recomendada | Observaciones |
| --- | --- | --- |
| Docker Desktop | 4.x o superior | Con Docker Compose v2 (`docker compose`) |
| Docker Compose | v2 | El repositorio usa `docker-compose.yml` pero el comando recomendado es `docker compose` |
| MongoDB | 8.0 | La imagen del proyecto es `mongo:8.0` |
| Node.js para backend | 24 | La API usa `node:24` en Docker |
| npm para backend | 10 o el que venga con Node 24 | El backend instala dependencias con `npm` |
| Node.js para frontend | 22 | El frontend usa `node:22` en Docker |
| pnpm para frontend | 9 o superior | El lockfile es versión 9 |

## Estructura del proyecto

```text
usermanager/
├── docker-compose.yml
├── usermanagerapi/          # API Express
├── usermanagerfront/        # Frontend Next.js
└── mongodb/
	├── dump/user_manager    # Backup de datos
	├── init/restore.sh      # Restauración automática en Mongo
	└── data/                # Datos persistidos en local
```

## Variables de entorno

### Backend (`usermanagerapi/.env`)

Archivo base: `usermanagerapi/.env.example`

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/user_manager
JWT_SECRET=pega_aqui_un_secreto_largo_y_aleatorio
REFRESH_SECRET=pega_aqui_otro_secreto_distinto
```

Notas:

- `JWT_SECRET` firma el access token.
- `REFRESH_SECRET` firma el refresh token. Conviene que sea distinto al `JWT_SECRET`.
- Si no defines `REFRESH_SECRET`, el backend acaba usando un derivado de `JWT_SECRET`, pero es mejor declararlo explícitamente.
- En modo Docker Compose, `MONGO_URI` ya se sobreescribe desde `docker-compose.yml` a `mongodb://mongo:27017/user_manager`.

### Frontend (`usermanagerfront/.env`)

Archivo base: `usermanagerfront/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

Si vas a ejecutar el frontend sin Docker, añade también esta variable para que las llamadas server-side de Next.js apunten bien a la API local:

```env
API_URL=http://localhost:5050
```

## Cómo generar claves JWT seguras

Genera dos secretos distintos, uno para `JWT_SECRET` y otro para `REFRESH_SECRET`.

Con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Con PowerShell:

```powershell
-join ((1..64 | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) }))
```

Recomendaciones:

- Usa al menos 64 bytes aleatorios.
- No reutilices el mismo valor para ambos secretos.
- No subas los archivos `.env` al repositorio.

## Opción 1: levantar todo con Docker Compose

Es la forma más simple y la recomendada para empezar.

### 1. Clona el repositorio

```bash
git clone https://github.com/alejandropovedabisquert/usermanager
cd usermanager
```

### 2. Crea los archivos `.env`

Backend:

```bash
cp ./usermanagerapi/.env.example ./usermanagerapi/.env
```

Frontend:

```bash
cp ./usermanagerfront/.env.example ./usermanagerfront/.env
```

Después edita `usermanagerapi/.env` y sustituye `JWT_SECRET` y `REFRESH_SECRET` por valores reales.

### 3. Arranca los servicios

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: http://localhost:3000
- Backend: http://localhost:5050
- MongoDB: mongodb://localhost:27017

### 4. Qué hace MongoDB al arrancar

El contenedor de Mongo restaura automáticamente el contenido de `mongodb/dump/user_manager`, pero solo cuando la base de datos se inicializa desde cero.

Si quieres forzar una restauración limpia:

1. Para los contenedores.
2. Borra el contenido de `mongodb/data`.
3. Vuelve a ejecutar `docker compose up --build`.

### 5. Comandos útiles

```bash
docker compose up -d
docker compose down
docker compose logs -f
docker compose logs -f mongo
docker compose logs -f backend
docker compose logs -f frontend
```

## Opción 2: levantarlo sin Docker

Usa esta opción solo si quieres ejecutar cada servicio manualmente en tu máquina.

## Requisitos extra

- MongoDB 8.0 levantado en local.
- Node.js 24 para `usermanagerapi`.
- Node.js 22 y `pnpm` 9+ para `usermanagerfront`.

### 1. Prepara MongoDB

Levanta MongoDB en local en el puerto `27017` y crea la base `user_manager`.

Si quieres cargar el backup incluido en el repositorio:

```bash
mongorestore --db user_manager --drop ./mongodb/dump/user_manager
```

### 2. Configura el backend

En `usermanagerapi/.env`:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/user_manager
JWT_SECRET=tu_secreto_de_access_token
REFRESH_SECRET=tu_secreto_de_refresh_token
```

Instala dependencias y arranca la API:

```bash
cd usermanagerapi
npm install
npm start
```

La API quedará en `http://localhost:5050`.

### 3. Configura el frontend

En `usermanagerfront/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
API_URL=http://localhost:5050
```

Instala dependencias y arranca el frontend:

```bash
cd usermanagerfront
pnpm install
pnpm dev
```

La aplicación quedará en `http://localhost:3000`.

## Autenticación JWT en este proyecto

- El access token caduca a los `15m`.
- El refresh token caduca a los `7d`.
- Las rutas protegidas esperan un header `Authorization: Bearer <token>`.

## Problemas comunes

### El frontend en local no encuentra la API

Revisa que `usermanagerfront/.env` tenga tanto `NEXT_PUBLIC_API_URL` como `API_URL` cuando no usas Docker.

### Mongo no restaura el backup otra vez

La restauración automática solo ocurre con una base vacía. Elimina `mongodb/data` y vuelve a arrancar los contenedores.

### Cambié los `.env` y Docker sigue usando valores antiguos

Reconstruye imágenes:

```bash
docker compose up --build
```

## Usuarios de prueba
Usuario administrador:
- Username: admin
- Password: admin

Usuario no administrador:
- Username: user1
- Password: user1
