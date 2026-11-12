import { Router } from 'express'
import * as controller from '../controllers/medico.controller.js'
import { proteger } from '../middlewares/proteger.js'

export const medicoRoutes = Router()

medicoRoutes.use(proteger)
medicoRoutes.get('/', controller.listar)
medicoRoutes.get('/perfil', controller.perfil)
medicoRoutes.get('/:id/pacientes', controller.listarPacientes)
medicoRoutes.get('/:id', controller.buscarPorId)
