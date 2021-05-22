/**
 * Ruta: /api/uploads/:tipo/:id
 */

 const {Router} = require('express');

//Middleware para carga de archivos en express, requiere importacion
 const expressfileUpload = require('express-fileupload');

 const { fileUpload, retornaImagen } = require('../controllers/uploads');
 
 const {validarJWT} = require('../middlewares/validar-jwt');
 
 const router = Router();

 //Este middleware prepara a express para recibir imagenes, se debe declarar antes de la ruta
 router.use(expressfileUpload()); //En ocasiones aparece como app.use, es igual cambiarlo a router.use

 router.put('/:tipo/:id', validarJWT, fileUpload);

 router.get('/:tipo/:foto', retornaImagen);

 module.exports = router;