// hacer el import de express tradicional
// const express = require('express');

// hacer el nuevo import

// en el package.json poner "type": "module", vea el package.json y verá
import Express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import { conectarBD } from './db/db.js';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

import rutasVehiculo from './views/vehiculos/rutas.js';
import rutasUsuario from './views/usuarios/rutas.js';
import rutasVenta from './views/ventas/rutas.js';
import autorizacionEstadoUsuario from './middleware/autorizacionEstadoUsuario.js';

dotenv.config({ path: './.env' });

const app = Express();

// casi siempre se le pone app se le agregan las rutas, métodos todo lo que necesitamos

app.use(Express.json());
app.use(Cors());

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://misiontic-concesionario.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'api-autenticacion-concesionario-mintic',
  issuer: 'https://misiontic-concesionario.us.auth0.com/',
  algorithms: ['RS256'],
});

// 4 y 5: enviarle el token a auth0 para que devuelva si es valido o no
app.use(jwtCheck);

app.use(autorizacionEstadoUsuario);

app.use(rutasVehiculo);
app.use(rutasUsuario);
app.use(rutasVenta);

const main = () => {
  return app.listen(5000, () => {
    //Esto es lo que prende el servidor
    //Cambié al puerto 500 para hacer purebas pero usar el .env
    console.log('escuchando puerto');
  });
};

conectarBD(main);
