/**
 * Ruta: /api/usuarios
 */

const {Router} = require('express');

//Paquete para validaciones, requiere instalacion previa
const {check} = require('express-validator');

//Importacion del middleware que valida campos
const {validarCampos} = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');

const router = Router();
        
router.get('/', validarJWT, getUsuarios);

//El segundo paremetro es para middleware. Para definir mas de un middleware usamos corchetes
router.post(
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
        validarCampos //Validar campos recogerá los errores que ocurran en los checks y los mostrará
    ],
    crearUsuario
);

router.put(
    '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos //Validar campos recogerá los errores que ocurran en los checks y los mostrará
    ],
    actualizarUsuario
);

router.delete(
    '/:id', 
    validarJWT, 
    borrarUsuario
);

module.exports = router;