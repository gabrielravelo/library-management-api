# 📚 Library Management API — NestJS, PostgreSQL, JWT

API REST robusta construida con **NestJS** + **TypeORM** + **PostgreSQL** para la gestión de inventario bibliotecario:

- Autenticación **JWT** (Passport Strategy)
- **RBAC** (Role-Based Access Control) con roles jerárquicos
- **Asynchronous Jobs** vía EventEmitter2 para actualización de contadores
- **Excel Reporting** con exceljs para exportación de inventario
- **Seeding System** integrado para carga inicial de datos

---

## 🚀 Características

- ✅ CRUD de **Usuarios**, **Autores** y **Libros**
- 🔐 **JWT Auth** + **RolesGuard** (ADMIN, LIBRARIAN, USER)
- 🧠 **Async Logic:** el `booksCount` de los autores se actualiza en background al crear/eliminar libros
- 📂 **Exportación:** descarga de catálogo completo en formato `.xlsx`
- 🧪 **Database Seeder:** endpoint centralizado para reset y carga de datos de prueba
- 🧩 **Validación Global:** uso de `ValidationPipe` para sanitización de DTOs y `ParseUUIDPipe` para IDs de usuario

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

## ▶️ Arranque rápido

Sigue estos pasos para poner en marcha el proyecto:

1. **Clonar el repositorio:**
    ```bash
    git clone https://github.com/gabrielravelo/library-management-api
    ```
2. **Acceder al directorio:**
    ```bash
    cd library-management-api
    ```
3. **Instalar dependencias:**
    - **Nota:** Es necesario tener Yarn instalado (`npm install --global yarn`). 
    ```bash
    yarn install
    ```
4. **Configurar variables de entorno::**
    - Copia el archivo de plantilla:
    ```bash
    cp .env.template .env
5. **Levantar la Base de Datos:**
    - **Opción A (Recomendada):** Usar Docker Compose para levantar PostgreSQL automáticamente:
    ```bash
    docker compose up -d
    ```
    - **Opción B (Manual):** Asegúrate de tener una instancia de PostgreSQL corriendo y que los datos coincidan con tu archivo `.env`
6. **Ejecutar en modo desarrollo:**
    ```bash
    yarn start:dev
    ```
Una vez levantado, puedes inicializar los datos de prueba accediendo a GET /api/v1/seed desde tu navegador o cliente REST.

### 💡 Recordatorio técnico:
No olvides que para que el prefijo funcione, en tu archivo `main.ts` debe estar configurado así:
```typescript
app.setGlobalPrefix('api/v1');
