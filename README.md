# Red Social — TP2 Programación 4 2026

Aplicación web de red social desarrollada con **Angular** (frontend) y **NestJS** (backend), deployada en Vercel y Render.

---

## 🚀 Deploy

| Servicio | URL |
|----------|-----|
| Frontend (Vercel) | https://jorge-caballero-tp-2-prog-4-2026-c1-ten.vercel.app |
| Backend (Render) | https://jorge-caballero-tp2-prog4-2026-c1-1.onrender.com |

---

## 📁 Estructura del repositorio

```
/
├── red-social-frontend/
│   └── red-social/        # Proyecto Angular
└── red-social-backend/    # Proyecto NestJS
```

---

## 🖥️ Frontend — Angular

### Tecnologías
- Angular (standalone components, última versión)
- Bootstrap 5
- Reactive Forms

### Pantallas
- **Registro** — formulario con validaciones, imagen de perfil, rol de usuario
- **Login** — formulario con validaciones, autenticación por correo o usuario
- **Publicaciones** — feed de publicaciones
- **Mi Perfil** — perfil del usuario autenticado

### Características
- Componentes standalone modernos con `inject()` y `@if`
- Navegación entre componentes con `RouterLink`
- Validaciones reactivas en formularios
- Modal de Bootstrap para feedback al usuario
- Favicon propio
- Environments configurados para desarrollo y producción

### Instalación y ejecución local

```bash
cd red-social-frontend/red-social
npm install
ng serve
```

Disponible en `http://localhost:4200`

---

## ⚙️ Backend — NestJS

### Tecnologías
- NestJS
- MongoDB + Mongoose
- Cloudinary (almacenamiento de imágenes)
- JWT (autenticación)
- bcrypt (encriptación de contraseñas)

### Módulos
- **Usuarios** — registro, gestión de perfiles
- **Autenticación** — login con JWT
- **Publicaciones** — CRUD de publicaciones

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/users` | Registro de usuario con imagen de perfil |
| POST | `/auth/login` | Login por correo o usuario |

### Instalación y ejecución local

```bash
cd red-social-backend
npm install
npm run start:dev
```

Disponible en `http://localhost:3000`

### Variables de entorno

Crear un archivo `.env` en la carpeta del backend con las siguientes variables:

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 📋 Sprint #1 — 23 de junio 2026

### Frontend
- [x] Creación del proyecto Angular
- [x] Pantallas: Registro, Login, Publicaciones, Mi Perfil
- [x] Deploy en Vercel
- [x] Navegación entre componentes
- [x] Favicon propio
- [x] Login con validaciones (correo o usuario, contraseña mínimo 8 caracteres, mayúscula y número)
- [x] Registro con todos los campos requeridos, imagen de perfil y atributo `perfil`

### Backend
- [x] Creación del proyecto NestJS
- [x] Módulos: Publicaciones, Autenticación, Usuarios
- [x] Registro: validación de datos, contraseña encriptada, imagen guardada en Cloudinary
- [x] Login: validación de credenciales, respuesta con datos del usuario

---

## 👤 Autor

**Jorge Caballero**  
Programación 4 — 2026
