import * as service from '../services/auth.service.js'
import { ErrorHttp } from '../middlewares/errores.js'

export async function registrar(req, res) {
  const { nombre, especialidad, email, password } = req.body ?? {}
  if (![nombre, especialidad, email, password].every(valor => typeof valor === 'string' && valor.trim())) {
    throw new ErrorHttp(400, 'Ingresa nombre, especialidad, email y contraseña')
  }

  const resultado = await service.registrar({ nombre, especialidad, email: email.trim(), password })
  res.status(201).json(resultado)
}

export async function login(req, res) {
  const { email, password } = req.body ?? {}
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password.trim()) {
    throw new ErrorHttp(400, 'Ingresa email y contraseña')
  }

  const resultado = await service.login(email.trim().toLowerCase(), password)
  if (!resultado) throw new ErrorHttp(401, 'Email o contraseña incorrectos')

  res.json(resultado)
}
