import cors from 'cors';

export const corsMiddleware = () => cors({
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
  })