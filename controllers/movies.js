import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MoviesController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    //que es lo que renderiza
    res.json(movies)
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });

    if(movie) return res.json(movie);
    return res.status(404).json({ Error: 'Movie not found' });
  }

  static async create(req, res) {
    const resultado = validateMovie(req.body);
      
    if(!resultado.success){
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }
  
    const newMovie = await MovieModel.create({ input: resultado.data });
  
    // para bases de datos
    
    res.status(201).json(newMovie) // actualizar la cache del cliente
  }

  static async delete(req, res) {
    const { id } = req.params

    const result = await MovieModel.delete({ id });

    if(result === false){
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  static async update(req, res) {
    const { id } = req.params
    const result = validatePartialMovie(req.body);

    if(!result.success){
      return res.status(400).json({ Error: JSON.parse(result.error.message) });
    }
    
    const updatedMovie = await MovieModel.update({ id, input: result.data });

    return res.json(updatedMovie)
  }
}