export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRA = '2h'

if (!JWT_SECRET) {
  throw new Error('Define JWT_SECRET en el archivo .env')
}
