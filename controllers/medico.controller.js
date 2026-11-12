import * as service from '../services/medico.service.js'
import { ErrorHttp } from '../middlewares/errores.js'

export async function listar(req, res) {
  const { especialidad } = req.query
  if (especialidad !== undefined && typeof especialidad !== 'string') {
    throw new ErrorHttp(400, 'Envía una sola especialidad')
  }

  res.json(await service.listar(especialidad))
}

export async function perfil(req, res) {
  res.json(await service.buscarPorId(req.medico.id))
}

export async function buscarPorId(req, res) {
  res.json(await service.buscarPorId(req.params.id))
}

export async function listarPacientes(req, res) {
  res.json(await service.listarPacientes(req.params.id))
}
