import { Medico } from '../models/medico.model.js'
import { Paciente } from '../models/paciente.model.js'
import { ErrorHttp } from '../middlewares/errores.js'

export function listar(especialidad) {
  const filtro = especialidad ? { especialidad } : {}
  return Medico.find(filtro).select('-password')
}

export async function buscarPorId(id) {
  const medico = await Medico.findById(id).select('-password')
  if (!medico) throw new ErrorHttp(404, 'Médico no encontrado')

  return medico
}

export async function listarPacientes(id) {
  const medico = await buscarPorId(id)
  return Paciente.find({ medico: medico._id })
}
