/**
 * Ruta: /api/hospitales
 */

 const {Router} = require('express');

 const {check} = require('express-validator');
 
 const {validarCampos} = require('../middlewares/validar-campos');
 
 const {validarJWT} = require('../middlewares/validar-jwt');
 
 const router = Router();

 const {getHospitales, crearHospital, actualizarHospital, borrarHospital} = require('../controllers/hospitales');
 
 router.get('/', getHospitales);
 
 //El segundo paremetro es para middleware. Para definir mas de un middleware usamos corchetes
 router.post(
     '/', 
     [
         validarJWT,
         check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
         validarCampos
     ],
     crearHospital
 );
 
 router.put(
     '/:id', 
     [
         validarJWT,
         check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
         validarCampos
     ],
     actualizarHospital
 );
 
 router.delete(
     '/:id',
     validarJWT,
     borrarHospital
 );
 
 module.exports = router;