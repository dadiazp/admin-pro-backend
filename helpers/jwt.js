const jwt = require('jsonwebtoken');

const generarJWT = (uid) =>{

    //Esto se hizo con una promesa para así poder colocarle un await en el auth.js ya que necesito esperar
    //la generación del token para luego continuar con el codigo
    return new Promise( (resolve, reject) => {
       
        const payload = {
            uid
        }
    
        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: '12h'
        }, (error, token) => {
    
            if(error){
                console.log(error);
                reject('No se pudo generar el JWT');
            }else{
                resolve(token);
            }
    
        });

    });

}

module.exports = {
    generarJWT
}