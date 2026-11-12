export class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje)
    this.status = status
  }
}

export function responderError(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error instanceof ErrorHttp) {
    return res.status(error.status).json({ error: error.message })
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo debe contener JSON válido' })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El cuerpo de la petición es demasiado grande' })
  }

  if (error.name === 'ValidationError') {
    const campos = Object.keys(error.errors).join(', ')
    return res.status(400).json({ error: `Revisa los campos: ${campos}` })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: `Formato inválido para ${error.path}` })
  }

  if (error.code === 11000) {
    const campo = Object.keys(error.keyPattern ?? {})[0] ?? 'campo único'
    return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` })
  }

  console.error(error)
  return res.status(500).json({ error: 'Error interno del servidor' })
}
