const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    //Leer el token
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        //Con esto coloco el uid en la request para luego recogerlo en la funcion siguiente al
        //middleware
        req.uid = uid;

        next();

    }catch(error){
        return res.status(401).json({
            ok: true,
            msg: 'Token incorrecto'
        });
    }

}

module.exports = {
    validarJWT
}