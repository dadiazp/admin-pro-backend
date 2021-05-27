//Importacion de express, requiere instalacion previa
const express = require('express');

//Como dbConnection devuelve un objeto, se usa la desestructuracion, 
//de esta forma se obtiene todas las propiedades dentro del objeto
const { dbConnection } = require('./database/config');

//Paquete de npm dotenv, requiere instalacion previa
require('dotenv').config();

//Paquete de npm cors, requiere instalacion previa
const cors = require('cors');

//Crear el servidor express
const app = express();

//Configurar CORS
app.use(cors())

//Lectura y parseo del body(Request)
//Esto debe colocarse antes de las rutas, de lo contrario funciona mal, el orden importa
app.use(express.json())

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static('public'));


//Rutas

//El primer parametro es la ruta
//El segundo parametro es quien va a responder a esa ruta en el primer parametro
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


//Levantar la app
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})