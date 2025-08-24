import movies from '../movies.json' with { type: 'json' };
import { randomUUID } from 'node:crypto';

export class MovieModel {
  static getAll = async ({ genre }) => {
    if(genre){
      return movies.filter((movie) => { 
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      })
    }
    return movies;
  }

  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
    if (movie) return movie;
    throw new Error('Movie not found');
  }

  static async create(input) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    // esto no es REST, porque estamos guardando el estado de la aplicacion en la memoria
    movies.push(newMovie)
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.filter((movie) => movie.id === id)
    if(movieIndex === -1) return false;

    movies.splice(movieIndex, 1)
    return true;
  }
  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if(movieIndex === -1) throw new Error('Movie not found');
    
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }

    return movies[movieIndex];
  }
}