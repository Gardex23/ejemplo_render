const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const cors = require('cors');

const { validateMovie, validatePartialMovie } = require('../schemas/movies')

const app = express();
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'http://192.168.1.103:8080'
      ]
      if(ACCEPTED_ORIGINS.includes(origin)){
        return callback(null, true)
      }

      if(!origin){
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  }))
app.disable('x-powered-by')

//Todos los recursos que sean movies, de identifican con /movies
app.get('/movies', (req, res) => {

  const { genre } = req.query
  if(genre){
    const filteredMovies = movies.filter((movie) => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies)
});

//Recuperar por id
app.get('/movies/:id', (req, res) => { //path-to-regexp -> convierte el path en una expresion regular
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if(movie) res.json(movie)
  res.status(404).json({ Error: 'Movie not found' })
});

app.post('/movies', (req, res) => {

  const resultado = validateMovie(req.body);
  
  if(!resultado.success){
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }

  // para bases de datos
  const newMovie = {
    id: crypto.randomUUID(),
    ...resultado.data
  }

  // esto on es REST, porque estamos guardando el estado de la aplicacion en la memoria
  movies.push(newMovie)
  res.status(201).json(newMovie) // actualizar la cache del cliente
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.filter((movie) => movie.id === id)

  if(movieIndex === -1){
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

//la id no se puede modificar porque no se está validando
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body);

  if(!result.success){
    return res.status(400).json({ Error: JSON.parse(result.error.message) });
  }
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if(!movieIndex === -1) res.status(404).json({ message: 'Movie not found' })
  
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// REST es un arquitectura de software -> se diseñó para comunicacion entre redes en pagina web especialmente.
// Recursos -> cada recurso de identifica con una URL
// Verbos HTTP -> para definir las operaciones que se pueden realizar con los recursos
// los recursos pueden tener diferentes representaciones -> JSON, html, xml, etc.
// El cliente siempre deberia enviar la informacion para procesar la request


// Diferencias entre POST, PUT y PATCH
// la idempotencia es la accion de realizar algo varias veces y siempre devuelve lo mismo
// POST -> en post, crea un nuevo recurso en el servidor
// no tenemos que darle
// PUT -> actualiza un elemento existente o lo crea si no existe
// PATCH -> actualiza parcialmente un elemento o recurso