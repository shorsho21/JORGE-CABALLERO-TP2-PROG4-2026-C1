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
- Chart.js (gráficos de estadísticas)
- PWA (@angular/pwa)

### Pantallas
- **Registro** — formulario con validaciones, imagen de perfil, rol de usuario
- **Login** — formulario con validaciones, autenticación por correo o usuario
- **Publicaciones** — feed de publicaciones, con ordenamiento y paginación
- **Publicación (detalle)** — vista ampliada de una publicación con sus comentarios
- **Mi Perfil** — perfil del usuario autenticado
- **Dashboard Admin** — gestión de usuarios y estadísticas con gráficos (solo administradores)

### Características
- Componentes standalone modernos con `inject()` y `@if`/`@for`
- Navegación entre componentes con `RouterLink`
- Validaciones reactivas en formularios
- Modal de Bootstrap para feedback al usuario (sin uso de `alert()`)
- Navbar único y reutilizable (`app-navbar`) compartido entre todas las vistas privadas
- Guards de ruta (`authGuard`, `adminGuard`, `guestGuard`) protegiendo el acceso según sesión y rol
- Interceptor HTTP que detecta respuestas `401` y `403` y actúa en consecuencia
- Contador de sesión de 8 minutos con modal de extensión a los 5 minutos restantes
- Keep-alive cada 3 minutos para mantener el backend activo en producción
- Spinner de carga al iniciar la app mientras se valida el token contra el backend
- Diseño dark minimalista uniforme en toda la aplicación
- Favicon propio
- Environments configurados para desarrollo y producción
- **3 Pipes propias:** `tiempoRelativo`, `truncar`, `nombrePerfil`
- **3 Directivas propias:** `appResaltarDeshabilitado`, `appTooltip`, `appClickCopiar`
- **PWA** configurada con service worker y manifest

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
- bcrypt (encriptación de contraseñas)
- JWT (autenticación y autorización)

### Módulos
- **Usuarios** — registro, listado, alta/baja lógica
- **Autenticación** — login, validación y refresco de token
- **Publicaciones** — alta, baja lógica, listado paginado, me gusta
- **Comentarios** — alta, edición y listado paginado de comentarios por publicación
- **Estadísticas** — aggregations de MongoDB para gráficos del dashboard

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/users` | ❌ Público | Registro de usuario con imagen de perfil |
| GET | `/users` | ✅ JWT + Admin | Listado de todos los usuarios |
| DELETE | `/users/:id` | ✅ JWT + Admin | Deshabilitar usuario (baja lógica) |
| POST | `/users/:id/rehabilitar` | ✅ JWT + Admin | Rehabilitar usuario deshabilitado |
| POST | `/auth/login` | ❌ Público | Login por correo o usuario |
| POST | `/auth/autorizar` | ✅ JWT | Valida el token y devuelve los datos del usuario |
| POST | `/auth/refrescar` | ✅ JWT | Genera un nuevo token con el mismo payload y 15 min de vencimiento |
| GET | `/posts` | ❌ Público | Lista publicaciones, paginadas y ordenables por fecha o me gusta |
| GET | `/posts/:id` | ❌ Público | Trae una publicación específica |
| POST | `/posts` | ✅ JWT | Crea una publicación (título, descripción, imagen) |
| DELETE | `/posts/:id` | ✅ JWT | Baja lógica de una publicación (autor o admin) |
| POST | `/posts/:id/likes` | ✅ JWT | Da me gusta a una publicación |
| DELETE | `/posts/:id/likes` | ✅ JWT | Quita el me gusta propio de una publicación |
| GET | `/posts/:postId/comentarios` | ❌ Público | Lista comentarios paginados, más recientes primero |
| POST | `/posts/:postId/comentarios` | ✅ JWT | Agrega un comentario a una publicación |
| PUT | `/comentarios/:id` | ✅ JWT | Edita un comentario propio y lo marca como `modificado` |
| GET | `/stats/publicaciones-por-usuario` | ✅ JWT + Admin | Publicaciones por usuario en rango de fechas |
| GET | `/stats/comentarios-por-tiempo` | ✅ JWT + Admin | Comentarios por día en rango de fechas |
| GET | `/stats/comentarios-por-publicacion` | ✅ JWT + Admin | Comentarios recibidos por usuario en rango de fechas |

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
- [x] Login con validaciones (correo o usuario, contraseña mínimo 6 caracteres)
- [x] Registro con todos los campos requeridos, imagen de perfil y atributo `perfil`

### Backend
- [x] Creación del proyecto NestJS
- [x] Módulos: Publicaciones, Autenticación, Usuarios
- [x] Registro: validación de datos, contraseña encriptada, imagen guardada en Cloudinary
- [x] Login: validación de credenciales, respuesta con datos del usuario

---

## 📋 Sprint #2 — 24 de junio 2026

### Frontend
- [x] Página Publicaciones: listado ordenado por fecha por defecto, con opción de ordenar por cantidad de me gusta
- [x] Paginación con cantidad limitada de publicaciones por página
- [x] Cada publicación renderizada como componente independiente
- [x] Dar y quitar me gusta desde el feed
- [x] Eliminar publicaciones propias (visible solo para el autor o un administrador)
- [x] Componente Mi Perfil: datos completos del usuario y foto de perfil
- [x] Mi Perfil: últimas 3 publicaciones del usuario

### Backend
- [x] Módulo Publicaciones — Controller:
  - [x] POST: alta de publicación (título, descripción, URL de imagen)
  - [x] Imagen guardada en Cloudinary
  - [x] DELETE: baja lógica, restringida al creador o administrador
  - [x] GET: listado de publicaciones con parámetro de orden (fecha / me gusta)
  - [x] GET: filtro por usuario (`autorId`)
  - [x] GET: paginación con `offset` y `limit`
  - [x] POST (me gusta): un usuario solo puede dar un me gusta por publicación
  - [x] DELETE (me gusta): elimina el me gusta únicamente si el usuario lo había dado

---

## 📋 Sprint #3 — 30 de junio 2026

### Frontend
- [x] Página Publicación (detalle): vista ampliada de la publicación junto a sus comentarios
- [x] Formulario para escribir comentarios
- [x] Comentarios ordenados de más reciente a más antiguo, paginados con botón "Cargar más"
- [x] Edición de comentarios propios, marcados visualmente como "(editado)"
- [x] Login y Registro: token guardado en `localStorage` tras una autenticación exitosa
- [x] Spinner de carga al iniciar la app
- [x] Validación del token contra la ruta `autorizar` al arrancar: si es válido redirige a Publicaciones, si no a Login
- [x] Contador de sesión con modal de extensión a los 5 minutos restantes
- [x] Refresco de token si el usuario acepta extender la sesión
- [x] Interceptor HTTP que redirige al login ante cualquier respuesta `401`
- [x] Guards de ruta (`authGuard`, `adminGuard`, `guestGuard`)
- [x] Navbar único reutilizable en todas las vistas, con botón de cierre de sesión funcional

### Backend
- [x] Módulo Publicaciones — Comentarios Controller:
  - [x] POST: agrega un comentario a una publicación, asociando usuario y fecha
  - [x] PUT: modifica el mensaje de un comentario propio y agrega el atributo `modificado: true`
  - [x] GET: trae los comentarios de una publicación, paginados y ordenados de más recientes a más antiguos
- [x] Módulo Autenticación:
  - [x] JWT con payload de uuid, correo, nombre de usuario y rol (usuario / administrador), vencimiento de 15 minutos
  - [x] POST `autorizar`: valida el token, responde `401` si es inválido o devuelve los datos del usuario si es válido
  - [x] POST `refrescar`: valida el token y devuelve uno nuevo con el mismo payload y 15 minutos de vencimiento

---

## 📋 Sprint #4 — 1 de julio 2026

### Frontend
- [x] Administrador en Publicaciones: botón de baja lógica visible para admin en cualquier publicación del feed
- [x] Dashboard Admin — tab Usuarios:
  - [x] Listado completo de usuarios con avatar, username y rol
  - [x] Crear nuevo usuario con todos los campos, imagen de perfil y radio buttons para elegir perfil (usuario / administrador)
  - [x] Deshabilitar usuario (baja lógica) — el usuario deshabilitado no puede ingresar y es notificado al intentar login
  - [x] Rehabilitar usuario deshabilitado (alta lógica)
- [x] Dashboard Admin — tab Estadísticas:
  - [x] Filtro de rango de fechas aplicable a todos los gráficos
  - [x] Gráfico de barras: publicaciones por usuario en el período
  - [x] Gráfico de líneas: comentarios por día en el período
  - [x] Gráfico de torta: comentarios recibidos por usuario en el período
- [x] 3 Pipes propias:
  - [x] `tiempoRelativo` — muestra "hace X minutos/horas/días" en lugar de la fecha completa
  - [x] `truncar` — trunca textos largos a N caracteres con "..."
  - [x] `nombrePerfil` — convierte 'usuario'/'administrador' en etiquetas legibles con ícono
- [x] 3 Directivas propias:
  - [x] `appResaltarDeshabilitado` — resalta visualmente las cards de usuarios deshabilitados
  - [x] `appTooltip` — muestra un tooltip personalizado al hacer hover sobre cualquier elemento
  - [x] `appClickCopiar` — copia texto al portapapeles al hacer clic con feedback visual
- [x] PWA configurada con service worker, manifest y soporte de instalación

### Backend
- [x] Módulo Usuarios — validación de token admin en endpoints protegidos:
  - [x] GET `/users`: listado de todos los usuarios (sin passwords)
  - [x] DELETE `/users/:id`: deshabilitar usuario, notifica al intentar login con mensaje específico
  - [x] POST `/users/:id/rehabilitar`: rehabilitar usuario deshabilitado
- [x] `RolesGuard`: guard de NestJS que verifica que el token sea de un administrador
- [x] Módulo Estadísticas — rutas GET protegidas por JWT + admin:
  - [x] GET `/stats/publicaciones-por-usuario`: aggregation por autor con `$group` y `$lookup`
  - [x] GET `/stats/comentarios-por-tiempo`: aggregation por día con `$dateToString`
  - [x] GET `/stats/comentarios-por-publicacion`: aggregation de comentarios recibidos por usuario

---

## 👤 Autor

**Jorge Caballero**
Programación 4 — 2026
