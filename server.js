import express from 'express'
import cors from 'cors'

import { conectar } from './config/db.js'
import { authRoutes } from './routes/auth.routes.js'
import { pacienteRoutes } from './routes/paciente.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/pacientes', pacienteRoutes)

await conectar()

app.listen(3001, () => {
  console.log('API escuchando en http://localhost:3001')
})
