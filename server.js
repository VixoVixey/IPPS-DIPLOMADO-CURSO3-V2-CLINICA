import express from 'express'
import cors from 'cors'

import { conectar } from './config/db.js'
import { responderError } from './middlewares/errores.js'
import { Medico } from './models/medico.model.js'
import { Paciente } from './models/paciente.model.js'
import { authRoutes } from './routes/auth.routes.js'
import { medicoRoutes } from './routes/medico.route.js'
import { pacienteRoutes } from './routes/paciente.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/medicos', medicoRoutes)
app.use('/pacientes', pacienteRoutes)
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))
app.use(responderError)

await conectar()
await Promise.all([Medico.init(), Paciente.init()])

app.listen(3001, () => {
  console.log('API escuchando en http://localhost:3001')
})
