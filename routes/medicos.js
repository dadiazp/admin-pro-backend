/**
 * Ruta: /api/medicos
 */

 const {Router} = require('express');

 const {check} = require('express-validator');
 
 const {validarCampos} = require('../middlewares/validar-campos');
 
 const {validarJWT} = require('../middlewares/validar-jwt');
 
 const router = Router();
         
 const {getMedicos, crearMedico, actualizarMedico, borrarMedico} = require('../controllers/medicos');
 
 router.get('/', getMedicos);
 
 //El segundo paremetro es para middleware. Para definir mas de un middleware usamos corchetes
 router.post(
     '/', 
     [
         validarJWT,
         check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
         check('hospital', 'El hospital es necesario').not().isEmpty(),
         check('hospital', 'El hospital id debe ser valido').isMongoId(),
         validarCampos
     ],
     crearMedico
 );
 
 router.put(
     '/:id', 
     [],
     actualizarMedico
 );
 
 router.delete(
     '/:id',
     borrarMedico
 );
 
 module.exports = router;
