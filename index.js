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

//Base de datos
dbConnection();


//Rutas
app.get('/', (request, response) => {

    response.json({
        ok: true,
        msg: 'Hola mundo'
    });
    
});


//Levantar la app
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})