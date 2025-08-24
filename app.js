import express, { json } from 'express';
import { moviesRouter } from './routes/movies_route.js';
import { corsMiddleware } from './middlewares/cors.js';

// forma recomendada para importar JSON
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);
// const movies = require('./movies.json');

const app = express();
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/movies', moviesRouter);

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