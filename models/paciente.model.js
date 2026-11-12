import mongoose from 'mongoose'

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  especialidad: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true })

export const Paciente = mongoose.model('Paciente', pacienteSchema, 'pacientes')
