const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2025),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0), // .default() -> añade un valor por defecto
  poster: z.string().url(), // -> en este caso. tambien podemos usar endsWith('jpg') por ejemplo
  genre: z.array(
    z.enum(['Action', 'Thriller', 'Crime', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi'])
  )
})

function validateMovie(object){
  return movieSchema.safeParse(object)
}

function validatePartialMovie(object){
  return movieSchema.partial().safeParse(object) // partial -> si la propiedad existe la valida, si no, la considera opcional y no hace nada
}

module.exports = { validateMovie, validatePartialMovie }