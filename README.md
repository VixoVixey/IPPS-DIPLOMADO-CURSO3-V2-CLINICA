# Evaluación 3 · API REST Clínica (Módulo 3)

API REST desarrollada con Node.js, Express y MongoDB (Mongoose) para la gestión de médicos y pacientes con autenticación mediante JWT y validación de permisos por médico tratante.

## 📹 Demostración en Video
- **Enlace:** https://youtu.be/fc_dd-3g8tM

---

## 🚀 Cómo levantar el proyecto

1. Clonar el repositorio e instalar dependencias (requiere Node.js 20.19+ y Yarn):
```bash
git clone https://github.com/VixoVixey/IPPS-DIPLOMADO-CURSO3-V2-CLINICA.git
cd IPPS-DIPLOMADO-CURSO3-V2-CLINICA
yarn
```

2. Configurar variables de entorno:
   * Copia `.env.example` a `.env` (`Copy-Item .env.example .env` en PowerShell).
   * En `MONGODB_URI`, pega tu cadena de conexión de MongoDB Atlas apuntando a la base `/clinica` (recuerda tener tu IP habilitada en Network Access).
   * Genera una clave segura para `JWT_SECRET` ejecutando en terminal:
     ```bash
     node -p "require('node:crypto').randomBytes(32).toString('hex')"
     ```
   * Pega el resultado en `JWT_SECRET` dentro de `.env`.

3. Iniciar el servidor en modo desarrollo:
```bash
yarn dev
```

El servidor quedará levantado en `http://localhost:3001` una vez confirmada la conexión a MongoDB.

---

## 📌 Endpoints Principales

Las rutas de `/medicos` y `/pacientes` requieren enviar el header `Authorization: Bearer <token>`.

### Autenticación
- `POST /auth/registro`: Registra un nuevo médico y devuelve `{ medico, token }` (`201`).
- `POST /auth/login`: Valida credenciales y devuelve `{ medico, token }` (`200`).

### Médicos
- `GET /medicos`: Lista los médicos registrados (soporta filtro `?especialidad=Pediatría`).
- `GET /medicos/perfil`: Devuelve los datos del médico autenticado en el token.
- `GET /medicos/:id`: Consulta un médico por su ID.
- `GET /medicos/:id/pacientes`: Lista los pacientes asociados a ese médico.

### Pacientes
- `POST /pacientes`: Crea un paciente vinculado al médico del token (`201`).
- `GET /pacientes`: Lista los pacientes del médico autenticado (soporta `?prevision=Isapre`).
- `GET /pacientes/:id`: Consulta el detalle de un paciente por ID.
- `PUT /pacientes/:id`: Actualiza datos del paciente (`200`). Solo permitido para el médico tratante (`403` si es otro médico).
- `DELETE /pacientes/:id`: Elimina al paciente (`204`). Solo permitido para el médico tratante (`403` si es otro médico).

---

## 🧠 Decisiones Técnicas Clave

- **Arranque e índices:** Express comienza a escuchar recién después de conectar a MongoDB y asegurar los índices únicos (`email` y `rut`), evitando duplicados desde la primera petición. Todos los imports locales incluyen ruta relativa y extensión `.js`.
- **Relación Médico–Paciente:** Cada paciente guarda el `ObjectId` del médico tratante en el campo `medico` (`ref: 'Medico'`), lo que permite filtrar rápidamente sus pacientes sin duplicar datos.
- **Regla de negocio (403 vs 404):** Al editar o eliminar, se filtra en MongoDB por ID de paciente y ID del médico del token en la misma operación. Si no hay coincidencia, se verifica si el ID del paciente existe para distinguir si no fue encontrado (`404`) o si pertenece a otro médico (`403`). Además, el campo `medico` está bloqueado en la lista de campos editables.
- **Seguridad:** Las contraseñas se guardan como hash con `bcrypt` en el modelo y se excluyen automáticamente tanto en las consultas como al serializar las respuestas JSON.