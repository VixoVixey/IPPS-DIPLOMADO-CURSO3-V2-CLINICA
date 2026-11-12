import * as service from '../services/paciente.service.js'
import { ErrorHttp } from '../middlewares/errores.js'

export async function crear(req, res) {
  const paciente = await service.crear(req.body, req.medico.id)
  res.status(201).json(paciente)
}

export async function listar(req, res) {
  const { prevision } = req.query
  if (prevision !== undefined && typeof prevision !== 'string') {
    throw new ErrorHttp(400, 'Envía una sola previsión')
  }

  res.json(await service.listar(req.medico.id, prevision))
}

export async function buscarPorId(req, res) {
  res.json(await service.buscarPorId(req.params.id))
}

export async function actualizar(req, res) {
  res.json(await service.actualizar(req.params.id, req.medico.id, req.body))
}

export async function eliminar(req, res) {
  await service.eliminar(req.params.id, req.medico.id)
  res.status(204).end()
}
