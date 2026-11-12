import mongoose from 'mongoose'

export const conectar = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Define MONGODB_URI en el archivo .env')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Conectado a la base de datos')
}
