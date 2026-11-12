import { Router } from 'express'
import * as controller from '../controllers/paciente.controller.js'
import { proteger } from '../middlewares/proteger.js'

export const pacienteRoutes = Router()

pacienteRoutes.use(proteger)
pacienteRoutes.post('/', controller.crear)
pacienteRoutes.get('/', controller.listar)
pacienteRoutes.get('/:id', controller.buscarPorId)
pacienteRoutes.put('/:id', controller.actualizar)
pacienteRoutes.delete('/:id', controller.eliminar)
