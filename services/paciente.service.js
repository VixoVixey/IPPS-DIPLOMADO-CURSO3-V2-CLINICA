import { Paciente } from '../models/paciente.model.js'
import { ErrorHttp } from '../middlewares/errores.js'

const camposEditables = ['nombre', 'rut', 'fechaNacimiento', 'prevision', 'telefono', 'email']

function datosPaciente(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ErrorHttp(400, 'Envía los datos del paciente como objeto JSON')
  }

  return Object.fromEntries(
    camposEditables.filter(campo => Object.hasOwn(body, campo)).map(campo => [campo, body[campo]])
  )
}

export function crear(body, medico) {
  return Paciente.create({ ...datosPaciente(body), medico })
}

export function listar(medico, prevision) {
  const filtro = { medico }
  if (prevision) filtro.prevision = prevision

  return Paciente.find(filtro)
}

export async function buscarPorId(id) {
  const paciente = await Paciente.findById(id)
  if (!paciente) throw new ErrorHttp(404, 'Paciente no encontrado')

  return paciente
}

async function verificarEscritura(id) {
  await buscarPorId(id)
  throw new ErrorHttp(403, 'Solo el médico tratante puede modificar o eliminar a este paciente')
}

export async function actualizar(id, medico, body) {
  const datos = datosPaciente(body)
  // El filtro comprueba quién es el tratante en la misma operación que guarda el cambio.
  const paciente = await Paciente.findOneAndUpdate(
    { _id: id, medico },
    { $set: datos },
    { runValidators: true, returnDocument: 'after' }
  )

  if (!paciente) await verificarEscritura(id)
  return paciente
}

export async function eliminar(id, medico) {
  const paciente = await Paciente.findOneAndDelete({ _id: id, medico })
  if (!paciente) await verificarEscritura(id)
}
