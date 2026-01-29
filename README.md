# 📚 Library Management API — NestJS, PostgreSQL, JWT

API REST robusta construida con **NestJS** + **TypeORM** + **PostgreSQL** para la gestión de inventario bibliotecario:

- Autenticación **JWT** (Passport Strategy)
- **RBAC** (Role-Based Access Control) con roles jerárquicos
- **Asynchronous Jobs** vía EventEmitter2 para actualización de contadores
- **Excel Reporting** con exceljs para exportación de inventario
- **Seeding System** integrado para carga inicial de datos
- **Documentación:** Swagger UI interactivo
- **Dockerizado:** Entorno completo con Docker y Docker Compose
---

## 🚀 Características

- ✅ CRUD de **Usuarios**, **Autores** y **Libros**
- 🔐 **JWT Auth** + **RolesGuard** (ADMIN, LIBRARIAN, USER)
- 🧠 **Async Logic:** el `booksCount` de los autores se actualiza en background al crear/eliminar libros
- 📂 **Exportación:** descarga de catálogo completo en formato `.xlsx`
- 🧪 **Database Seeder:** endpoint centralizado para reset y carga de datos de prueba
- 🧩 **Validación Global:** uso de `ValidationPipe` para sanitización de DTOs y `ParseUUIDPipe` para IDs de usuario
- 📘 **Swagger Docs:** Documentación viva en `/api/v1/docs`

---

## 📁 Estructura del proyecto

```text
src/
├─ auth/                       # Lógica de autenticación y seguridad
│  ├─ decorators/              # @Roles, @Public, etc.
│  ├─ dto/                     # LoginDto, RegisterDto
│  ├─ enums/                   # Role enum (ADMIN, LIBRARIAN, USER)
│  ├─ guards/                  # JwtAuthGuard, RolesGuard
│  ├─ auth.controller.ts
│  ├─ auth.module.ts
│  └─ auth.service.ts
├─ users/                      # Gestión de perfiles de usuario
│  ├─ entities/                # User entity (Bcrypt hashing @BeforeInsert)
│  ├─ users.controller.ts
│  ├─ users.module.ts
│  └─ users.service.ts
├─ authors/                    # Módulo de Autores (Contador asíncrono)
│  ├─ entities/                # Author entity (id, name, booksCount)
│  ├─ authors.controller.ts
│  └─ authors.service.ts       # Listener de eventos: 'book.count.update'
├─ books/                      # Módulo de Libros
│  ├─ entities/                # Book entity (Relación ManyToOne con Author)
│  ├─ books.controller.ts
│  └─ books.service.ts         # Emisor de eventos al crear/eliminar
├─ reports/                    # Generación de reportes
│  ├─ reports.controller.ts
│  └─ reports.service.ts       # Lógica de ExcelJS
├─ seed/                       # Datos iniciales y reset de DB
│  ├─ data/                    # Archivos de datos JSON/Arrays
│  ├─ seed.controller.ts
│  └─ seed.service.ts
├─ app.module.ts
└─ main.ts
Dockerfile                     # Imagen para producción
docker-compose.yml             # Orquestación de App + DB
```

---

## 🧩 Configuración (.env)

Ejemplo para entorno local:

```bash
# App Configuration
PORT=3000
NODE_ENV=dev

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=123456
DB_NAME=library_db

# Security
JWT_KEY=super_secret_key_123
JWT_EXPIRES_IN=2h
```

---

## 🧱 Seguridad / Roles

**Jerarquía y Permisos:**

1. `ADMIN` → Acceso total, gestión de usuarios, creación de bibliotecarios y reset de DB.

2. `LIBRARIAN` → Gestión de Autores y Libros (CRUD). No puede gestionar usuarios.

3. `USER` → Acceso de lectura (Read-only) a los catálogos de autores y libros.

> **Validation:** Se utiliza class-validator para asegurar que los ISBN sean válidos, las fechas tengan formato ISO y los campos obligatorios estén presentes.

---

## ⚡ Job Asíncrono (Event Driven)

Se implementó un desacoplamiento mediante EventEmitter2:

- Al ejecutar `POST /books`, el servicio guarda el registro y emite un evento `book.count.update`.

- El `AuthorsService` escucha el evento y recalcula el `booksCount` del autor afectado.

- **Ventaja:** La respuesta al cliente es inmediata; el cálculo pesado se realiza fuera del ciclo principal de la petición.

---

## 🔐 Autenticación

> **Nota:** Todos los endpoints de la API están bajo el prefijo global `/api/v1`.

### Endpoints Auth

| Método | Ruta           | Descripción                             |
| -----: | :------------- | :-------------------------------------- |
|   POST | /auth/register | Registro público (rol USER por defecto) |
|   POST | /auth/login    | Login (Devuelve JWT + Datos de usuario) |

---

## 📊 Endpoints Principales

### 👤 Usuarios (Solo ADMIN)

| Método | Ruta         | Descripción                              |
| -----: | :----------- | :--------------------------------------- |
|    GET | /users       | Listar todos los usuarios                |
|    GET | /users/:uuid | Obtener usuario por UUID (ParseUUIDPipe) |

### ✍️ Autores

| Método | Ruta         | Roles Permitidos     | Descripción             |
| -----: | :----------- | :------------------- | :---------------------- |
|    GET | /authors     | Todos (Autenticados) | Listado con booksCount  |
|   POST | /authors     | ADMIN, LIBRARIAN     | Crear nuevo autor       |
|  PATCH | /authors/:id | ADMIN, LIBRARIAN     | Actualizar datos autor  |
| DELETE | /authors/:id | ADMIN                | Eliminar autor y libros |

### 📖 Libros

| Método | Ruta       | Roles Permitidos     | Descripción              |
| -----: | :--------- | :------------------- | :----------------------- |
|    GET | /books     | Todos (Autenticados) | Listado con relación     |
|   POST | /books     | ADMIN, LIBRARIAN     | Crear y emitir evento    |
|  PATCH | /books/:id | ADMIN, LIBRARIAN     | Actualizar libro         |
| DELETE | /books/:id | ADMIN, LIBRARIAN     | Eliminar y emitir evento |

### 📉 Reportes

| Método | Ruta                   | Descripción                           |
| -----: | :--------------------- | :------------------------------------ |
|    GET | /reports/books/excel   | Descarga archivo .xlsx (Requiere JWT) |
|    GET | /reports/authors/excel | Descarga archivo .xlsx (Requiere JWT) |

### ⚙️ Sistema

| Método | Ruta  | Descripción                               |
| -----: | :---- | :---------------------------------------- |
|    GET | /seed | Limpia DB y carga datos iniciales (Admin) |

---

## ▶️ Pasos para levantar el proyecto

Sigue estos pasos para poner en marcha el proyecto:

1. **Clonar el repositorio y acceder:**
    ```bash
    git clone https://github.com/gabrielravelo/library-management-api
    cd library-management-api
    ```
2. **Configurar el entorno:**
    - Crear archivo `.env` basado en la sección anterior.
3. **Levantar con Docker (Recomendado):**
    - **Nota:** Este comando levanta la base de datos y la API con Hot-Reload activo. 
    ```bash
    docker compose up --build -d
    ```
4. **Instalación Manual (Opcional):**
    - Requiere Yarn instalado.
    - Levantar solo DB: `docker compose up db -d`
    - Ejecutar App: `yarn install` y luego `yarn start:dev`
Una vez levantado, puedes inicializar los datos de prueba accediendo a GET /api/v1/seed desde tu navegador o cliente REST.

### 💡 Recordatorio técnico:
No olvides que para que el prefijo funcione, en tu archivo `main.ts` debe estar configurado así:
```typescript
app.setGlobalPrefix('api/v1');
