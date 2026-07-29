# TalentHub — Frontend

Admin dashboard built with **React**, **TypeScript**, and **Tailwind CSS**.

## Requisitos

- **Node.js** >= 20
- **npm**

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
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

## API Proxy

El frontend incluye un proxy de Vite que redirige las peticiones `/api` y `/uploads` al backend en `http://localhost:3000`. No es necesario configurar CORS en desarrollo.

Ver `vite.config.ts` para los detalles del proxy.

## Scripts

```bash
npm run dev           # Servidor de desarrollo (hot-reload)
npm run build         # Compilar para producción
npm run preview       # Previsualizar build de producción
npm run lint          # ESLint
npm run format        # Prettier + ESLint --fix
```

## Variables de Entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_APP_NAME` | Nombre de la aplicación | `TalentHub` |
| `VITE_COMPANY_NAME` | Nombre de la empresa | `Company` |
| `VITE_APP_EMAIL_DOMAIN` | Dominio de email | `company.com` |
| `VITE_FIREBASE_*` | Configuración de Firebase (opcional) | — |

## Funcionalidades

- Diseño responsive (mobile-first)
- Modo oscuro / claro
- Múltiples layouts y temas
- Soporte multi-idioma (es, en, fr, it)
- Roles y permisos (CASL)
- Tablas con búsqueda, paginación, ordenamiento
- Exportación e importación de empleados en Excel

## Diseño y Desarrollo

Desarrollado originalmente por **Luis Angel Gutiérrez**, Ingeniero en Informática y Desarrollador de Software.

- 🌐 **LinkedIn**: [lrgutierrez](https://www.linkedin.com/in/lrgutierrez/)
- 💻 **GitHub**: [LR-Gutierrez](https://github.com/LR-Gutierrez)
