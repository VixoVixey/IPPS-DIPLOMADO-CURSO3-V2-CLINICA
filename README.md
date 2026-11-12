# Clínica · API REST

Continuación del proyecto del Módulo 3 del diplomado. La API usa Express para recibir peticiones y Mongoose para guardar médicos y pacientes en MongoDB.

## Cómo levantarla

1. Abre la carpeta del repositorio en la terminal. Usa Node.js 20.19 o superior y Yarn. Ejecuta `yarn`.
2. En MongoDB Atlas, crea un clúster y un usuario de base de datos con lectura y escritura en `clinica`. Agrega tu IP en **Network Access**. En **Connect → Drivers → Node.js**, copia la URI.
3. En PowerShell, ejecuta `Copy-Item .env.example .env`. Abre `.env` y completa `MONGODB_URI` con la URI de Atlas. Agrega `/clinica` entre el host y los parámetros que empiezan con `?`. Si la contraseña contiene caracteres reservados como `@` o `#`, codifícalos para la URI.
4. Genera una clave local con `node -p "require('node:crypto').randomBytes(32).toString('hex')"`. Copia el resultado a `JWT_SECRET` en `.env`. Ese archivo se queda en tu equipo.
5. Ejecuta `yarn dev`. La terminal debe mostrar la conexión a MongoDB y luego la dirección `http://localhost:3001`.

Para comprobar el servidor, pide `GET /pacientes` en Postman sin token. Debe responder `401` con `{"error":"Falta el token"}`.

## Rutas

Las rutas de `/medicos` y `/pacientes` requieren `Authorization: Bearer <token>`.

| Método y ruta | Resultado |
| --- | --- |
| `POST /auth/registro` | Crea un médico y devuelve `{ medico, token }` con 201. |
| `POST /auth/login` | Recibe email y contraseña. Devuelve `{ medico, token }` con 200. |
| `GET /medicos` | Lista médicos. Acepta `?especialidad=Pediatría`. |
| `GET /medicos/perfil` | Devuelve al médico del token. |
| `GET /medicos/:id` | Consulta un médico por ID. |
| `GET /medicos/:id/pacientes` | Lista los pacientes de ese médico. |
| `POST /pacientes` | Crea un paciente asociado al médico del token. |
| `GET /pacientes` | Lista los pacientes del médico del token. Acepta `?prevision=Isapre`. |
| `GET /pacientes/:id` | Consulta un paciente por ID. |
| `PUT /pacientes/:id` | Actualiza los campos enviados. Requiere ser el tratante. |
| `DELETE /pacientes/:id` | Elimina el paciente y devuelve 204. Requiere ser el tratante. |

## Decisiones para explicar en la demostración

- En el arranque, los imports locales llevan ruta relativa y extensión `.js`. Express escucha después de conectar a MongoDB y de esperar los índices únicos de email y RUT. Así las primeras peticiones ya tienen protección contra duplicados.
- El paciente guarda el `ObjectId` del médico en `medico`, con una referencia al modelo `Medico`. Eso permite consultar sus pacientes con un filtro por ID y guardar los datos del médico en un solo lugar.
- Al crear, el servicio toma el médico del token. Al editar o eliminar, MongoDB busca por ID de paciente y de tratante en la misma operación. Si no encuentra coincidencia, se consulta el ID para distinguir un paciente inexistente (404) de uno asignado a otro médico (403). La lista de campos editables deja fuera `medico`.
- El modelo de médico genera el hash con bcrypt y elimina `password` al serializarse. Las consultas de médicos además excluyen ese campo desde MongoDB. Un middleware de Express devuelve los errores en JSON. Los índices únicos permiten detectar duplicados incluso si llegan dos solicitudes al mismo tiempo.

## Demostración en Postman

Usa datos ficticios. Registra a dos médicos con emails distintos y guarda sus tokens por separado. Inicia sesión con el primero. Prueba la lista de pacientes sin token (401), crea uno con el primer médico (201) y guárdate su ID. Pídelo por ID y luego consulta `GET /medicos/:id/pacientes`. Intenta editarlo con el token del segundo médico (403). Vuelve a consultar al paciente para mostrar que conservó sus datos. Repite el alta con el mismo RUT (409).

Para grabar los 5 a 8 minutos, muestra los códigos de estado en Postman y luego abre el modelo y el servicio de pacientes. Explica la relación, el filtro que aplica el permiso de escritura y dos correcciones del arranque que puedas reproducir o describir.

**Video de entrega:** pendiente de grabar y enlazar aquí. Antes de entregar, comprueba en una ventana de incógnito que el video de YouTube se abre.

Para crear el paciente de la demo, elige **Body → raw → JSON** y envía algo como esto:

```json
{
  "nombre": "Pedro Pérez",
  "rut": "12.345.678-9",
  "fechaNacimiento": "1990-01-02",
  "prevision": "Fonasa"
}
```

## Verificación local

Se inició con `yarn dev` y MongoDB Community 8.0.20 en una base de prueba. Pasaron 34 comprobaciones HTTP, entre ellas el flujo del video, las consultas filtradas, los IDs inválidos y el borrado autorizado. La conexión a tu clúster de Atlas se comprueba después de completar tu `.env`.
