//Esta importacion me desbloquea la ayuda de VSC de las response
const {response} = require('express');

//Esto nos permitirá capturar los errores ocurridos previamente en el middleware
const {validationResult} = require('express-validator');

const  validarCampos = (req, res = response, next) => {
    
    //En la request se creara un arreglo de errores, por eso se le pasa la request como argumento
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();

}

module.exports = {
    validarCampos
};