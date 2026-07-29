# TalentHub — Frontend

Admin dashboard built with **React**, **TypeScript**, and **Tailwind CSS**.

## Requisitos

- **Node.js** >= 20
- **npm**
- **Docker** (opcional, para despliegue contenerizado)

## Instalación (desarrollo local)

```bash
# 1. Clonar el repositorio
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env según sea necesario

# 4. Iniciar en modo desarrollo
npm run dev
```

El servidor de desarrollo arranca en `http://localhost:5173`.

## Despliegue con Docker

```bash
# Construir y levantar
docker compose up -d

# Opcional: especificar puerto y URL del backend
BACKEND_URL=http://localhost:3000 PORT=8080 docker compose up -d
```

El frontend queda en `http://localhost:8080`. El nginx integrado proxypea `/api` y `/uploads` al backend automáticamente.

## API Proxy

En desarrollo, Vite redirige las peticiones `/api` y `/uploads` al backend en `http://localhost:3000`.  
En Docker, el nginx integrado hace el mismo proxy usando la variable `BACKEND_URL`.

Ver `vite.config.ts` para los detalles del proxy de desarrollo y `nginx.conf.template` para el de producción.

## HTTPS (producción)

Para servir con SSL, monta los certificados y activa el template SSL:

```bash
docker compose run --rm -e SSL_ENABLED=true -e DOMAIN=midominio.com \
  -v /ruta/certs/fullchain.pem:/etc/ssl/certs/fullchain.pem \
  -v /ruta/certs/privkey.pem:/etc/ssl/private/privkey.pem \
  frontend
```

O agrégalo al `docker-compose.yml`:

```yaml
services:
  frontend:
    environment:
      SSL_ENABLED: "true"
      DOMAIN: midominio.com
    volumes:
      - /etc/letsencrypt/live/midominio.com/fullchain.pem:/etc/ssl/certs/fullchain.pem
      - /etc/letsencrypt/live/midominio.com/privkey.pem:/etc/ssl/private/privkey.pem
    ports:
      - "80:80"
      - "443:443"
```

El template `nginx.ssl.conf.template` redirige HTTP → HTTPS y aplica HSTS.

## Variables de Entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_APP_NAME` | Nombre de la aplicación | `TalentHub` |
| `VITE_COMPANY_NAME` | Nombre de la empresa | `Company` |
| `VITE_APP_EMAIL_DOMAIN` | Dominio de email | `company.com` |
| `VITE_FIREBASE_*` | Configuración de Firebase (opcional) | — |

> **Nota**: Si no se configuran las credenciales de Firebase, la autenticación con Google/Apple no estará disponible. El login por email/contraseña usa la API propia del backend.

## Scripts

```bash
npm run dev           # Servidor de desarrollo (hot-reload)
npm run build         # Compilar para producción
npm run preview       # Previsualizar build de producción
npm run lint          # ESLint
npm run format        # Prettier + ESLint --fix
npm run test          # Tests unitarios (Vitest + Testing Library)
npm run test:run      # Tests una sola vez (sin watch)
```

## Funcionalidades

- Diseño responsive (mobile-first)
- Modo oscuro / claro
- Múltiples layouts y temas
- Soporte multi-idioma (es, en, fr, it)
- Roles y permisos (CASL)
- Tablas con búsqueda, paginación, ordenamiento
- Exportación e importación de empleados en Excel (4 hojas)

## Diseño y Desarrollo

Desarrollado originalmente por **Luis Angel Gutiérrez**, Ingeniero en Informática y Desarrollador de Software.

- 🌐 **LinkedIn**: [lrgutierrez](https://www.linkedin.com/in/lrgutierrez/)
- 💻 **GitHub**: [LR-Gutierrez](https://github.com/LR-Gutierrez)
