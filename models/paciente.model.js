import mongoose from 'mongoose'

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  rut: { type: String, required: true, unique: true, trim: true },
  fechaNacimiento: { type: Date, required: true },
  prevision: {
    type: String,
    enum: ['Fonasa', 'Isapre', 'Particular'],
    default: 'Fonasa',
    required: true
  },
  telefono: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true }
}, { timestamps: true })

export const Paciente = mongoose.model('Paciente', pacienteSchema, 'pacientes')
